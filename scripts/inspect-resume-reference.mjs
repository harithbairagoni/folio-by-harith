import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
await fs.mkdir('tmp/resume-review',{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.addInitScript(()=>{Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{};Element.prototype.requestPointerLock=()=>{};});
 await page.goto('https://sudarveldesignportfolio.framer.website/resume',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(2000);
 await page.screenshot({path:'tmp/resume-review/reference-start.png',fullPage:true});
 const before=await page.locator('.rp-paper').evaluate(el=>el.parentElement.getAttribute('style'));
 await page.waitForTimeout(2500);
 await page.screenshot({path:'tmp/resume-review/reference-settled.png',fullPage:true});
 const after=await page.locator('.rp-paper').evaluate(el=>el.parentElement.getAttribute('style'));
 const buttons=await page.locator('button').allTextContents();
 await page.getByRole('button',{name:'Read the résumé',exact:true}).click();
 await page.waitForTimeout(500);
 await page.screenshot({path:'tmp/resume-review/reference-reader.png'});
 console.log(JSON.stringify({before,after,buttons,dialogs:await page.locator('[role=dialog]').count(),pageTitle:await page.title()},null,2));
}finally{await browser.close();}
