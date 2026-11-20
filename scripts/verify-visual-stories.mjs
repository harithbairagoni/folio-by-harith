import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import assert from "node:assert/strict";

const out = "tmp/experience-timeline";
const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:4174/";
const configs = [
  { name: "desktop", width: 1440, height: 960 },
  { name: "tablet", width: 820, height: 1024 },
  { name: "phone", width: 390, height: 844 },
  { name: "compact", width: 360, height: 640, manual: true },
  { name: "reduced", width: 1440, height: 960, manual: true, reducedMotion: "reduce" },
  { name: "fallback", width: 1440, height: 960, fallback: true },
];
const scenes = [
  ["ethanol", 5, "#ethanol"],
  ["land", 4, "#landsafe"],
  ["research", 4, "#political-analysis"],
];

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const results = [];
try {
  for (const config of configs.filter(config => !process.env.PORTFOLIO_VIEWPORT || config.name === process.env.PORTFOLIO_VIEWPORT)) {
    const { name, width, height, reducedMotion = "no-preference", fallback, manual } = config;
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion });
    await context.addInitScript(({ fallback }) => {
      Element.prototype.requestPointerLock = () => {};
      Element.prototype.setPointerCapture = () => {};
      if (fallback) {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (type, ...args) {
          return String(type).includes("webgl") ? null : getContext.call(this, type, ...args);
        };
      }
    }, { fallback });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(url + "#experience", { waitUntil: "networkidle" });
    assert.equal(await page.locator(".visual-chapter").count(), 3);
    const frames = [];
    for (const [kind, count, anchor] of scenes) {
      const sequence = page.locator(`[data-story="${kind}"]`);
      const buttons = sequence.locator(".beat-nav button");
      assert.equal(await buttons.count(), count);
      assert.equal(await sequence.evaluate(el => el.classList.contains("sequence-still")), Boolean(manual));
      const go = async phase => {
        await sequence.evaluate((element, ratio) => {
          const top = element.getBoundingClientRect().top + scrollY;
          window.scrollTo({ top: top + (element.clientHeight - innerHeight) * ratio, behavior: "instant" });
        }, .035 + phase / (count - 1) * .93);
        await page.waitForFunction(({ kind, phase }) => {
          const el = document.querySelector(`[data-story="${kind}"] .story-motion`);
          return ["--first", "--second", "--third", "--finish"].every((name, index) => {
            const expected = Math.min(1, Math.max(0, (phase - index - .06) / .86));
            return Math.abs(Number(el.style.getPropertyValue(name)) - expected) < .025;
          });
        }, { kind, phase });
      };
      const style = selector => sequence.locator(selector).evaluate(el => getComputedStyle(el).transform);
      const stage = sequence.locator(".sequence-sticky");
      const film = sequence.locator(".experience-film");
      await film.scrollIntoViewIfNeeded();
      await page.waitForFunction(kind => {
        const images = [...document.querySelectorAll(`[data-story="${kind}"] .film-screen img`)];
        return images.length === 3 && images.every(image => image.complete && image.naturalWidth > 0);
      }, kind);
      const clip = index => film.locator("img").nth(index).evaluate(el => getComputedStyle(el).clipPath);
      if (!manual) {
        const seek = phase => sequence.evaluate((element, ratio) => {
          const start = element.getBoundingClientRect().top + scrollY;
          window.scrollTo({ top: start + (element.clientHeight - innerHeight) * ratio, behavior: "instant" });
        }, .035 + phase / (count - 1) * .93);
        const half = kind === "ethanol" ? 1.55 : .55;
        await seek(half);
        await page.waitForFunction(kind => {
          const middle = document.querySelectorAll(`[data-story="${kind}"] .film-screen img`)[1];
          return /polygon|ellipse/.test(getComputedStyle(middle).clipPath);
        }, kind);
        const intermediate = await clip(1);
        if (name === "desktop" || name === "phone") {
          await stage.screenshot({ path: `${out}/${name}-${kind}-film-transition.png` });
        }
        await seek(count - 1);
        await page.waitForFunction(kind => {
          const last = document.querySelectorAll(`[data-story="${kind}"] .film-screen img`)[2];
          return getComputedStyle(last).clipPath === "inset(0px)";
        }, kind);
        if (name === "desktop" || name === "phone") {
          await stage.screenshot({ path: `${out}/${name}-${kind}-film-finish.png` });
        }
        await seek(half);
        await page.waitForFunction(({ kind, intermediate }) => {
          const middle = document.querySelectorAll(`[data-story="${kind}"] .film-screen img`)[1];
          return getComputedStyle(middle).clipPath === intermediate;
        }, { kind, intermediate });
      } else {
        await buttons.last().click();
        assert.equal(await clip(2), "inset(0px)");
        assert.equal(await film.locator(".film-scan").count(), 0);
      }
      await sequence.getByRole("button", { name: "View workflow diagram" }).click();
      await sequence.locator(".story-motion").waitFor();
      let plant;
      if (!manual && kind === "ethanol") {
        await go(0);
        if (fallback) await sequence.locator(".story-plant-poster").waitFor({ state: "visible" });
        else {
          plant = sequence.locator(".plant-canvas[data-ready=true]");
          await plant.waitFor();
        }
      }
      const watch = kind === "ethanol" ? ".work-lane:first-child" : kind === "land" ? ".land-field" : ".research-inputs";
      const values = new Map();
      const phases = Array.from({ length: 2 * count - 1 }, (_, i) => i / 2);
      for (const phase of manual ? phases.filter(Number.isInteger) : phases) {
        if (manual) await buttons.nth(phase).click(); else await go(phase);
        await page.waitForTimeout(140);
        assert.ok(Math.abs(Number(await sequence.getAttribute("data-beat")) - phase) <= .5, `${name}/${kind}/${phase}: active beat`);
        const currentCopy = sequence.locator(".beat-copy:not([aria-hidden=true])");
        assert.equal(await currentCopy.count(), 1);
        assert.equal(await sequence.locator(".beat-copy:visible").count(), 1, "No overlaid narration");
        if (phase === count - 1 && kind !== "ethanol") {
          const output = kind === "land" ? ".land-report" : ".brief-document";
          assert.ok(Number(await sequence.locator(output).evaluate(el => getComputedStyle(el).opacity)) > .99);
        }
        if (!manual) {
          const stageBox = await stage.boundingBox();
          const nav = await page.locator(".premium-nav").boundingBox();
          assert.ok(stageBox.y >= nav.y + nav.height - 1, `${name}/${kind}: nav collision ${JSON.stringify(stageBox)}`);
          assert.ok(stageBox.y + stageBox.height <= height + 3, `${name}/${kind}: stage taller than viewport ${JSON.stringify(stageBox)}`);
          values.set(phase, await style(watch));
        }
        if (plant && Number.isInteger(phase)) {
          const lifts = (await plant.getAttribute("data-sc-verify-state")).split(":").map(Number);
          if (phase > 0 && phase < 4) {
            assert.ok(lifts[phase - 1] > .15 && lifts.every((lift, i) => i === phase - 1 || lift < .01), `Workstream isolation: ${lifts}`);
          }
          if (phase === 4) assert.ok(lifts.every(lift => lift < .01), "Plant reassembled");
        }
        if (name === "desktop" || (name === "phone" && (phase === .5 || phase === count - 1))) {
          const file = `${name}-${kind}-${phase}.png`;
          await stage.screenshot({ path: `${out}/${file}` });
          frames.push(file);
        }
      }
      if (!manual) {
        assert.notEqual(values.get(0), values.get(.5), `${kind}: first in-between transform`);
        assert.notEqual(values.get(.5), values.get(1), `${kind}: second in-between transform`);
        await go(.5);
        await page.waitForTimeout(140);
        const reverse = await style(watch);
        const coefficients = value => value === "none" ? [1, 0, 0, 1, 0, 0] : value.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi).map(Number);
        assert.ok(coefficients(reverse).every((value, i) => Math.abs(value - coefficients(values.get(.5))[i]) < 2), `${kind}: reverse reaches same pose`);
      }
      await buttons.last().click();
      await page.waitForFunction(({ kind, count }) => document.querySelector(`[data-story="${kind}"]`).dataset.beat === String(count - 1), { kind, count });
      if (kind === "research") {
        await sequence.getByRole("button", {name: "Nomination portfolio", exact: true}).click();
        await sequence.getByRole("button", {name: "Portfolio", exact: true}).click();
        await page.waitForFunction(() => Number(getComputedStyle(document.querySelector(".is-nomination .brief-document")).opacity) > .99);
        await sequence.getByRole("button", {name: "Research & briefing", exact: true}).click();
      }
      await page.evaluate(anchor => { location.hash = anchor; }, anchor);
      await page.waitForTimeout(150);
      assert.equal(new URL(page.url()).hash, anchor);
    }
    if (name === "desktop") {
      for (const id of ["work", "about", "experience"]) {
        await page.locator(`.premium-nav a[href="#${id}"]`).click();
        await page.waitForURL(`**/#${id}`);
        await page.waitForFunction(id => {
          const heading = document.getElementById(id);
          const top = heading.getBoundingClientRect().top;
          return top >= -3 && top < innerHeight;
        }, id);
      }
      for (const kind of ["land", "research"]) {
        const bridge = page.locator(`.bridge-${kind}`);
        await bridge.scrollIntoViewIfNeeded();
        await bridge.screenshot({ path: `${out}/bridge-${kind}.png` });
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(200);
      assert.equal(await page.locator(".sequence-still").count(), 0);
      await page.setViewportSize({ width: 360, height: 640 });
      await page.waitForTimeout(200);
      assert.equal(await page.locator(".sequence-still").count(), 3);
    }
    for (const anchor of ["ethanol-deliverable", "landsafe-deliverable", "political-deliverable"]) {
      await page.evaluate(anchor => { location.hash = anchor; }, anchor);
      const detail = page.locator(`#${anchor}`);
      await page.waitForFunction(anchor => document.getElementById(anchor).open, anchor);
      await detail.locator("summary").focus();
      await page.keyboard.press("Enter");
      assert.equal(await detail.evaluate(el => el.open), false);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    results.push({ name, viewport: [width, height], mode: manual ? "stage controls" : "scroll", frames, errors });
    console.log(`${name}: passed`);
    await context.close();
  }
  const filename = process.env.PORTFOLIO_VIEWPORT ? `results-${process.env.PORTFOLIO_VIEWPORT}.json` : "results.json";
  await fs.writeFile(`${out}/${filename}`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
