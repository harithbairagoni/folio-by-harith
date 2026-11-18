import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
const out='tmp/motion-books'; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const results=[];
try {
 for(const [name,width,height] of [['desktop',1440,1000],['phone',390,844]]) {
  const page=await browser.newPage({viewport:{width,height}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4174/',{waitUntil:'networkidle'});
  const times=[];
  for(const id of ['landsafe','political-analysis']){
   const section=page.locator('#'+id),study=section.locator('.spatial-study'),canvas=study.locator('.artifact-canvas');
   await study.scrollIntoViewIfNeeded();await canvas.locator('canvas').waitFor();
   await page.waitForFunction(el=>el.dataset.ready==='true',await canvas.elementHandle());
   await canvas.evaluate(el=>el.dataset.settled='false');
   const button=study.locator('.study-controls button').nth(2);
   const started=Date.now();await button.click();
   await page.waitForFunction(el=>el.dataset.state==='2'&&el.dataset.settled==='true',await canvas.elementHandle());
   times.push({id,settleMs:Date.now()-started,drawCalls:await canvas.getAttribute('data-draw-calls')});
   await study.screenshot({path:`${out}/${name}-${id}.png`});
  }
  const plant=page.locator('.plant-story');await plant.getByRole('button',{name:'Mechanical',exact:true}).click();
  await page.locator('.plant-canvas[data-ready=true]').waitFor();await page.waitForTimeout(400);
  const plantDrawCalls=await page.locator('.plant-canvas').getAttribute('data-draw-calls');
  await plant.locator('.plant-visual').screenshot({path:`${out}/${name}-plant.png`});
  const shelf=page.locator('.bookshelf');await shelf.scrollIntoViewIfNeeded();
  for(const img of await shelf.locator('.cover-book img').all()) await img.evaluate(i=>i.decode());
  const covers=await shelf.locator('.cover-book img').evaluateAll(imgs=>imgs.map(i=>({src:i.getAttribute('src'),loaded:i.naturalWidth>0,width:i.naturalWidth,height:i.naturalHeight})));
  if(covers.length!==4||covers.some(c=>!c.loaded||c.height<c.width))throw Error('Missing or malformed cover');
  await shelf.getByRole('button',{name:/Dopamine Detox/}).click();await page.waitForTimeout(250);
  await shelf.screenshot({path:`${out}/${name}-books.png`});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow||errors.length)throw Error(JSON.stringify({overflow,errors}));
  results.push({name,times,plantDrawCalls,covers,overflow,errors});await page.close();
 }
 await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
