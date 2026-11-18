import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const output = path.resolve(
  process.argv[2] || "scrollcraft/builds/harith/verification",
);
const baseURL = process.env.PORTFOLIO_URL || "http://127.0.0.1:4173";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const errors = [];
const results = [];
const safeContext = async (options) => {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    Element.prototype.setPointerCapture = () => {};
    Element.prototype.releasePointerCapture = () => {};
    Element.prototype.requestPointerLock = () => {};
  });
  return context;
};
try {
  for (const [name, width, height, reducedMotion] of [
    ["desktop", 1440, 1000, "no-preference"],
    ["phone", 390, 844, "no-preference"],
    ["compact", 360, 640, "no-preference"],
    ["reduced", 1440, 1000, "reduce"],
  ]) {
    const context = await safeContext({
      viewport: { width, height },
      reducedMotion,
    });
    const page = await context.newPage();
    page.on("pageerror", (error) =>
      errors.push({ name, error: error.message }),
    );
    page.on("response", (response) => {
      if (
        response.status() >= 400 &&
        new URL(response.url()).hostname === "127.0.0.1"
      )
        errors.push({ name, status: response.status(), url: response.url() });
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}-opening.png` });
    if (name === "desktop") {
      await page.mouse.move(1300, 420);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${output}/desktop-pointer-right.png` });
      await page.mouse.move(160, 420);
      await page.waitForTimeout(350);
      await page.screenshot({ path: `${output}/desktop-pointer-left.png` });
    }
    await page.keyboard.press("Tab");
    if (
      (await page.evaluate(() =>
        document.activeElement?.textContent?.trim(),
      )) !== "Skip to content"
    )
      throw new Error(`${name}: skip link is not first in keyboard order`);
    await page.keyboard.press("Enter");
    const opening = await page.evaluate(() => ({
      title: document.title,
      overflow: document.documentElement.scrollWidth > innerWidth,
      failedImages: [...document.images]
        .filter((image) => image.complete && !image.naturalWidth)
        .map((image) => image.src),
      h1: document.querySelector("h1")?.innerText,
    }));
    await page.getByRole("button", { name: "Clean this sample" }).click();
    const clean = await page.locator(".csv-artifact tbody tr").count();
    if (clean !== 3)
      throw new Error(`${name}: clean sample expected 3 rows, got ${clean}`);
    await page.getByRole("button", { name: "Reset sample" }).click();
    if ((await page.locator(".csv-artifact tbody tr").count()) !== 4)
      throw new Error(`${name}: reset failed`);
    await page.getByRole("tab", { name: /Rehearse/ }).click();
    await page
      .getByRole("heading", { name: "A short, human introduction." })
      .waitFor();
    await page.getByRole("tab", { name: /Follow through/ }).click();
    await page
      .getByRole("heading", { name: "Leave with a next step." })
      .waitFor();
    await page.getByRole("tab", { name: /Prepare/ }).click();
    const points = [];
    for (const selector of [
      ".premium-hero",
      ".tidy-spread",
      ".cold-spread",
      ".plant-story",
      ".landsafe-chapter",
      ".political-chapter",
      ".about-section",
      "#contact",
    ]) {
      const box = await page.locator(selector).boundingBox();
      const absolute = (box?.y || 0) + (await page.evaluate(() => scrollY));
      const span =
        selector === ".plant-story" && reducedMotion !== "reduce"
          ? Math.max(0, (box?.height || 0) - height)
          : 0;
      const positions =
        selector === ".premium-hero"
          ? [0, 0.35, 0.7]
          : span
            ? [0, 0.25, 0.5, 0.75, 1]
            : [0];
      for (let i = 0; i < positions.length; i++) {
        await page.evaluate(
          (y) => window.scrollTo({ top: y, behavior: "instant" }),
          absolute +
            (span || Math.min(box?.height || 0, height)) * positions[i],
        );
        await page.waitForTimeout(450);
        const filename = `${name}-${selector.replace(/[.#]/g, "")}-${i}.png`;
        await page.screenshot({ path: `${output}/${filename}` });
        points.push(filename);
      }
    }
    await page.locator("#landsafe").getByRole("button", { name: /Field verification/ }).click();
    if (!(await page.getByText("Compare the records with the site.").isVisible()))
      throw new Error(`${name}: parcel comparison failed`);
    await page.locator("#political-analysis").getByRole("button", { name: /Synthesize/ }).click();
    if (
      !(await page.getByText("Turn research into a briefing point.", { exact: true }).isVisible())
    )
      throw new Error(`${name}: briefing failed`);
    await page.getByRole("button", { name: /Positioning/ }).click();
    if (
      !(await page
        .getByText(
          "If someone remembers only one thing about your product, what should it be?",
        )
        .isVisible())
    )
      throw new Error(`${name}: bookshelf failed`);
    if (width < 600) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      if (!(await page.locator("#mobile-navigation").isVisible()))
        throw new Error(`${name}: menu failed`);
      await page.keyboard.press("Escape");
      await page.locator("#mobile-navigation").waitFor({ state: "detached" });
    }
    await page.locator(".plant-story").evaluate((el) =>
      window.scrollTo({
        top:
          el.getBoundingClientRect().top +
          scrollY +
          Math.max(0, el.clientHeight - innerHeight) * 0.88,
        behavior: "instant",
      }),
    );
    await page
      .locator(".plant-canvas[data-ready=true]")
      .waitFor({ timeout: 20000 });
    await page.getByRole("button", { name: "Mechanical", exact: true }).click();
    if (
      (await page
        .getByRole("button", { name: "Mechanical", exact: true })
        .getAttribute("aria-pressed")) !== "true"
    )
      throw new Error(`${name}: workstream failed`);
    await page.waitForTimeout(450);
    await page.screenshot({
      path: `${output}/${name}-selected-workstream.png`,
    });
    await page.getByRole("button", { name: "Mechanical", exact: true }).click();
    if (name === "desktop") {
      await page.waitForTimeout(600);
      await page
        .locator(".plant-coordinate")
        .evaluate((el) => (el.style.visibility = "hidden"));
      await page
        .locator(".plant-bottom-note")
        .evaluate((el) => (el.style.visibility = "hidden"));
      await page
        .locator(".plant-canvas")
        .screenshot({ path: `${output}/plant-render.png` });
      await page
        .locator(".plant-coordinate")
        .evaluate((el) => (el.style.visibility = ""));
      await page
        .locator(".plant-bottom-note")
        .evaluate((el) => (el.style.visibility = ""));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${output}/${name}-full.png`,
      fullPage: true,
    });
    results.push({ name, ...opening, cleanRows: clean, webgl: true, points });
    await context.close();
  }
  const context = await safeContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return String(type).includes("webgl")
        ? null
        : original.call(this, type, ...args);
    };
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page.locator(".plant-story").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: `output/no-webgl.png`.replace("output/", `${output}/`),
  });
  results.push({
    name: "no-webgl",
    fallback: await page.locator(".plant-poster").isVisible(),
  });
  await context.close();
  const thumbs = await Promise.all(
    results.flatMap((result) =>
      (result.points || []).map(async (filename) => ({
        input: await sharp(`${output}/${filename}`)
          .resize(280, 200, { fit: "contain", background: "#e5dac8" })
          .png()
          .toBuffer(),
        filename,
      })),
    ),
  );
  const columns = 7,
    rows = Math.ceil(thumbs.length / columns);
  await sharp({
    create: {
      width: columns * 280,
      height: rows * 200,
      channels: 3,
      background: "#e5dac8",
    },
  })
    .composite(
      thumbs.map((thumb, index) => ({
        input: thumb.input,
        left: (index % columns) * 280,
        top: Math.floor(index / columns) * 200,
      })),
    )
    .png()
    .toFile(`${output}/sheet.png`);
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  console.log(
    JSON.stringify(
      { results: results.map(({ points, ...rest }) => rest), errors, output },
      null,
      2,
    ),
  );
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
