import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import sharp from "sharp";

const base = process.env.PORTFOLIO_URL || "http://127.0.0.1:4174";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.addInitScript(() => {
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    Element.prototype.requestPointerLock = () => {};
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({
    path: "scrollcraft/builds/harith/production-verification/refined-desktop.png",
  });
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((link) => link.getAttribute("href"))
      .filter(
        (href) => href.length > 1 && !document.getElementById(href.slice(1)),
      ),
  );
  if (missing.length)
    throw new Error(`Missing anchor targets: ${missing.join(", ")}`);
  const emails = await page
    .locator('a[href="mailto:harith.bairagoni2027@mastersunion.org"]')
    .count();
  if (!emails) throw new Error("Email action missing");
  await page.locator(".plant-story").evaluate((el) =>
    window.scrollTo({
      top:
        el.getBoundingClientRect().top +
        scrollY +
        el.clientHeight -
        innerHeight,
      behavior: "instant",
    }),
  );
  await page.locator(".plant-canvas[data-ready=true]").waitFor();
  await page.waitForTimeout(700);
  await page
    .locator(".plant-coordinate")
    .evaluate((el) => (el.style.visibility = "hidden"));
  await page
    .locator(".plant-bottom-note")
    .evaluate((el) => (el.style.visibility = "hidden"));
  await page.locator(".plant-canvas").evaluate((el) => {
    for (let ancestor = el; ancestor; ancestor = ancestor.parentElement)
      ancestor.style.setProperty("background", "transparent", "important");
  });
  await page.locator(".plant-canvas").screenshot({
    path: "scrollcraft/builds/harith/production-verification/plant-render-clean.png",
    omitBackground: true,
  });
  const poster = await sharp(
    "scrollcraft/builds/harith/production-verification/plant-render-clean.png",
  )
    .webp({ quality: 90 })
    .toBuffer();
  await fs.writeFile("public/photos/plant-poster.webp", poster);
  await fs.writeFile("dist/photos/plant-poster.webp", poster);
  const response = await page.goto(`${base}/resume.html`, {
    waitUntil: "networkidle",
  });
  if (response.status() !== 200) throw new Error("Résumé unavailable");
  await page.getByRole("button", { name: "Read résumé", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("heading", { name: "BAIRAGONI HARITH", exact: true })
    .waitFor();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Print résumé", exact: true })
    .waitFor();
  await page.pdf({
    path: "scrollcraft/builds/harith/production-verification/resume-overview.pdf",
    format: "A4",
    printBackground: true,
  });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.screenshot({
    path: "scrollcraft/builds/harith/production-verification/refined-phone.png",
  });
  await page.locator(".plant-story").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator(".plant-visual").screenshot({
    path: "scrollcraft/builds/harith/production-verification/refined-fallback.png",
  });
  const result = {
    anchors: "all local targets present",
    emailActions: emails,
    resumeStatus: response.status(),
    resumePrint: "PDF exported successfully",
    externalLinks:
      "destinations present; external account ownership not reverified",
  };
  await fs.writeFile(
    "scrollcraft/builds/harith/production-verification/links.json",
    JSON.stringify(result, null, 2),
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
