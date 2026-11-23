import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import resume from "../src/data/resume.json" with { type: "json" };

const base = "http://127.0.0.1:4174";
const out = process.argv[2] || "tmp/resume-review/final";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const results = [],
  errors = [];
try {
  for (const [name, width, height, reducedMotion] of [
    ["desktop", 1440, 1000, "no-preference"],
    ["phone", 390, 844, "no-preference"],
    ["compact", 360, 640, "no-preference"],
    ["reduced", 1440, 1000, "reduce"],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion,
      acceptDownloads: true,
    });
    await context.addInitScript(() => {
      Element.prototype.setPointerCapture = () => {};
      Element.prototype.releasePointerCapture = () => {};
      Element.prototype.requestPointerLock = () => {};
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push({ name, message: e.message }));
    page.on("response", (r) => {
      if (r.status() >= 400 && r.url().startsWith(base))
        errors.push({ name, status: r.status(), url: r.url() });
    });
    await page.goto(base, { waitUntil: "networkidle" });
    const mobile = width < 600;
    if (mobile) await page.getByRole("button", { name: "Open navigation" }).click();
    const navigation = page.locator(mobile ? "#mobile-navigation" : ".premium-nav");
    await navigation.getByRole("link", { name: "Résumé", exact: true }).click();
    await page.waitForURL(`${base}/resume.html`);
    if (context.pages().length !== 1) throw new Error(`${name}: résumé opened another tab`);
    const models = await page.locator("a[download]").evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")))]);
    if (models.length !== 1 || models[0] !== "/resume/harith-focos-original.pdf")
      throw new Error(`${name}: expected one résumé download format`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${out}/${name}-opening.png` });
    await page.waitForTimeout(3500);
    await page.screenshot({
      path: `${out}/${name}-settled.png`,
      fullPage: true,
    });
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      previewHeight: document.querySelector(".document-preview").clientHeight,
      previewContentHeight:
        document.querySelector(".document-preview").scrollHeight,
    }));
    if (layout.overflow) throw new Error(`${name}: horizontal overflow`);
    await page
      .getByRole("button", {
        name: "Replay the printing animation",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", { name: "Read résumé", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await page.screenshot({ path: `${out}/${name}-reader-original.png` });
    if (
      (await dialog.locator(".resume-section").count()) !==
      resume.sections.length
    )
      throw new Error(`${name}: missing sections`);
    if (await dialog.getByRole("button", { name: /ATS reading|Original layout/ }).count())
      throw new Error(`${name}: alternate reading mode is still shown`);
    await page.keyboard.press("Escape");
    if (await dialog.isVisible())
      throw new Error(`${name}: Escape did not close dialog`);
    await page.getByRole("button", { name: "Skills", exact: true }).click();
    if (
      !(await dialog
        .getByRole("heading", { name: "Skills", exact: true })
        .isVisible())
    )
      throw new Error(`${name}: section navigation failed`);
    await dialog.getByRole("button", { name: "Close résumé" }).click();
    const downloadEvent = page.waitForEvent("download");
    await page
      .getByRole("link", { name: "Download résumé PDF", exact: true })
      .click();
    const download = await downloadEvent;
    await download.saveAs(`${out}/${name}-download.pdf`);
    const original = await page.request.get(
      `${base}/resume/harith-focos-original.pdf`,
    );
    const originalBody = await original.body();
    const source = await fs.readFile(
      "/Users/harith/Downloads/Copy of Bairagoni Harith c7 FOCOS CV Ver3.docx.pdf",
    );
    if (
      createHash("sha256").update(originalBody).digest("hex") !==
      createHash("sha256").update(source).digest("hex")
    )
      throw new Error(`${name}: source PDF changed`);
    if (name === "desktop")
      await page.pdf({
        path: `${out}/browser-print.pdf`,
        format: "A4",
        printBackground: true,
      });
    results.push({
      name,
      ...layout,
      sections: resume.sections.length,
      reader: "same-tab navigation, open, close and jump passed",
      download: download.suggestedFilename(),
      original: "byte-for-byte identical",
    });
    await context.close();
  }
  await fs.writeFile(
    `${out}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(JSON.stringify({ results, errors }, null, 2));
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
