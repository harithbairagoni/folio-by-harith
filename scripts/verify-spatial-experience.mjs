import { chromium } from "playwright-core";
import fs from "node:fs/promises";

const out = "tmp/spatial-experience";
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const results = [];
try {
  for (const [name, width, height, reducedMotion, fallback] of [
    ["desktop",1440,1000,"no-preference",false], ["phone",375,844,"no-preference",false],
    ["reduced",360,740,"reduce",false], ["fallback",390,844,"reduce",true],
  ]) {
    const context = await browser.newContext({viewport:{width,height}, reducedMotion});
    if (fallback) await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type,...args) { return String(type).includes("webgl") ? null : original.call(this,type,...args); };
    });
    const page = await context.newPage(); const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto("http://127.0.0.1:4174/", {waitUntil:"networkidle"});
    const plant = page.locator(".plant-story");
    const scrollPlant = async fraction => plant.evaluate((el,f) => window.scrollTo({top:el.getBoundingClientRect().top+scrollY+Math.max(0,el.clientHeight-innerHeight)*f,behavior:"instant"}), fraction);
    await scrollPlant(0.2);
    if (!fallback) await page.locator('.plant-canvas[data-ready="true"]').waitFor();
    await plant.getByRole("button",{name:"Civil works",exact:true}).click();
    if (width < 700) await plant.locator('input[type=range]').fill("0.7");
    else await scrollPlant(0.7);
    await page.waitForTimeout(1000);
    if (!fallback) await page.locator('.plant-canvas[data-settled=true]').waitFor();
    if (!fallback) {
      const positions = (await page.locator('.plant-canvas').getAttribute('data-sc-verify-state')).split(':').map(Number);
      if (positions[0] <= 0 || Math.abs(positions[1]) > .01 || Math.abs(positions[2]) > .01) throw Error(`${name}: civil isolation failed: ${positions}`);
      if (name === 'desktop') {
        await scrollPlant(.35); await page.waitForTimeout(150); await page.locator('.plant-canvas[data-settled=true]').waitFor();
        const reverse = (await page.locator('.plant-canvas').getAttribute('data-sc-verify-state')).split(':').map(Number);
        if (reverse[0] >= positions[0] || reverse[1] !== 0 || reverse[2] !== 0) throw Error('Reverse civil scroll failed');
      }
    }
    for (const [label,index] of [["Mechanical",1],["Clearances",2]]) {
      await plant.getByRole('button',{name:label,exact:true}).click(); await page.waitForTimeout(900);
      if (!fallback) await page.locator('.plant-canvas[data-settled=true]').waitFor();
      if (!fallback) {
        const p=(await page.locator('.plant-canvas').getAttribute('data-sc-verify-state')).split(':').map(Number);
        if (p[index] <= 0 || p.slice(0,3).some((v,i)=>i!==index && Math.abs(v)>.01)) throw Error(`${name}: ${label} isolation failed ${p}`);
      }
    }
    await plant.getByRole('button',{name:'Overview',exact:true}).click();
    await page.screenshot({path:`${out}/${name}-plant.png`});
    for (const [id,labels,kind] of [["landsafe",["Records","Field verification","Review report"],"land"],["political-analysis",["Research","Synthesize","Brief"],"research"]]) {
      const section=page.locator(`#${id}`); const study=section.locator('.spatial-study');
      for (let i=0;i<labels.length;i++) {
        const button=study.getByRole('button',{name:new RegExp(labels[i]+'$')});
        await button.click();
        if(await button.getAttribute('aria-pressed')!=='true') throw Error('Selection not reflected');
        await study.locator('.study-explanation h4').waitFor();
        if(!fallback) await section.locator(`.artifact-canvas[data-kind="${kind}"][data-ready=true][data-state="${i}"][data-settled=true]`).waitFor();
        else if (!(await study.locator('.artifact-fallback').isVisible())) throw Error('Fallback not visible');
        await study.screenshot({path:`${out}/${name}-${id}-${i}.png`});
      }
      await section.locator('.chapter-heading a').click();
      if(!(await section.locator('.chapter-case-strip').isVisible())) throw Error('Read the work target missing');
    }
    const checks=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))}));
    if(checks.overflow||checks.missingAnchors.length||errors.length)throw Error(JSON.stringify({name,checks,errors}));
    results.push({name,...checks,errors,scenes:'all stages and plant isolation passed',fallback}); await context.close();
  }
  await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));
} finally {await browser.close();}
