import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import assert from "node:assert/strict";

const out = "tmp/visual-stories";
await fs.mkdir(out,{recursive:true});
const browser = await chromium.launch({executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",headless:true,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const results=[];
try {
  for (const [name,width,height,reducedMotion,fallback] of [["desktop",1440,1000,"no-preference",false],["phone",390,844,"no-preference",false],["compact",360,640,"no-preference",false],["reduced",1440,1000,"reduce",false],["fallback",1440,1000,"no-preference",true]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion});
    await context.addInitScript(({fallback})=>{
      Element.prototype.requestPointerLock=()=>{};
      Element.prototype.setPointerCapture=()=>{};
      if(fallback){const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes("webgl")?null:original.call(this,type,...args);};}
    },{fallback});
    const page=await context.newPage();const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    await page.goto(process.env.PORTFOLIO_URL||"http://127.0.0.1:4174/",{waitUntil:"networkidle"});
    assert.equal(await page.locator('.visual-chapter').count(),3);
    const stacked=width<=760||height<=700||reducedMotion==='reduce';
    for(const kind of ['ethanol','land','research']){
      const sequence=page.locator(`[data-story="${kind}"]`);
      const scrollTo=async p=>sequence.evaluate((el,p)=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY-100+(el.offsetHeight-innerHeight+100)*p,behavior:'instant'}),p);
      if(!stacked){
        for(const p of [.06,.24,.42,.58,.76,.94]){
          await scrollTo(p);await page.waitForTimeout(500);
          assert.equal(Number(await sequence.getAttribute('data-beat')),Math.floor(p*3));
          if(name==='desktop')await sequence.locator('.sequence-sticky').screenshot({path:`${out}/${name}-${kind}-${p}.png`});
        }
        await scrollTo(.12);await page.waitForTimeout(300);
        assert.equal(await sequence.getAttribute('data-beat'),'0','Reverse scroll returns to first stage');
        const buttons=sequence.locator('.beat-nav button');
        for(let i=0;i<3;i++){await buttons.nth(i).click();await page.waitForTimeout(350);assert.equal(await buttons.nth(i).getAttribute('aria-pressed'),'true');}
        if(kind==='ethanol'){
          for(const [index,label] of [[0,'Civil works'],[1,'Mechanical'],[2,'Clearances']]){
            await sequence.getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(550);
            assert.equal(await sequence.getAttribute('data-beat'),'2','Filter preserves progress');
            assert.equal(await sequence.locator('.work-lane.is-selected').count(),1);
            assert.match(await sequence.locator('.work-lane.is-selected').innerText(),new RegExp(label));
            if(!fallback){
              await page.locator('.plant-canvas[data-ready=true]').waitFor();
              const positions=(await page.locator('.plant-canvas').getAttribute('data-sc-verify-state')).split(':').map(Number);
              assert.ok(positions[index]>0&&positions.slice(0,3).every((v,i)=>i===index||Math.abs(v)<.01),'Plant isolation');
            }
          }
          await sequence.getByRole('button',{name:'Overview',exact:true}).click();
          if(fallback)assert.ok(await sequence.locator('.story-plant-poster').isVisible());
        }
      }else{
        assert.equal(await sequence.locator('.mobile-storyboard figure').count(),3);
        for(let i=0;i<3;i++){
          const figure=sequence.locator('figure').nth(i);await figure.scrollIntoViewIfNeeded();
          assert.ok(await figure.locator('figcaption').isVisible());
          if(name!=='reduced')await figure.screenshot({path:`${out}/${name}-${kind}-${i}.png`});
        }
      }
      if(kind==='research'){
        await sequence.getByRole('button',{name:'Nomination portfolio',exact:true}).click();await page.waitForTimeout(450);
        assert.equal(await sequence.locator('.is-nomination').count(),stacked?3:1);
        if(name==='desktop')await sequence.locator('.sequence-sticky').screenshot({path:`${out}/desktop-nomination.png`});
        await sequence.getByRole('button',{name:'Research & briefing',exact:true}).click();
      }
    }
    for(const id of ['ethanol-deliverable','landsafe-deliverable','political-deliverable']){
      await page.evaluate(id=>{location.hash=id;},id);await page.waitForTimeout(150);
      assert.ok(await page.locator(`#${id}`).evaluate(el=>el.open),'Deep link opens detail');
      await page.locator(`#${id} summary`).focus();await page.keyboard.press('Enter');
      assert.equal(await page.locator(`#${id}`).evaluate(el=>el.open),false,'Keyboard closes detail');
    }
    const checks=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),missingAnchors:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))}));
    assert.equal(checks.overflow,false);assert.deepEqual(checks.brokenImages,[]);assert.deepEqual(checks.missingAnchors,[]);assert.deepEqual(errors,[]);
    results.push({name,...checks,errors,stacked,stages:'verified',filters:'verified'});
    await context.close();
  }
  await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
