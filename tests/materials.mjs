import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const base=process.env.BRONZE_BASE_URL||'http://127.0.0.1:5204/bronze-ui/';
const engines=process.argv.includes('--webkit')?[webkit]:process.argv.includes('--chromium')?[chromium]:[chromium,webkit];
await mkdir('.evidence',{recursive:true});
async function codeSurface(locator) {
  const geometry=await locator.evaluate(el=>{
    const b=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();
    const range=document.createRange();range.selectNodeContents(el);
    return {display:getComputedStyle(el).display,fragments:el.getClientRects().length,
      contained:[...range.getClientRects()].every(r=>r.left>=b.left&&r.right<=b.right&&r.top>=b.top&&r.bottom<=b.bottom),
      bounded:b.width<=p.width+1,scroll:el.scrollWidth<=el.clientWidth+1};
  });
  assert.equal(geometry.display,'block');assert.equal(geometry.fragments,1);
  assert.ok(geometry.contained&&geometry.bounded&&geometry.scroll,JSON.stringify(geometry));
}
for(const engine of engines){
 const browser=await engine.launch();let cases=0;const errors=[];
 try {for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:320,height:568},{width:844,height:390}])for(const theme of ['dark','light']){
  const page=await browser.newPage({viewport});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'contract.html');
  const hostBefore=await page.getByLabel('Unrelated host select').evaluate(e=>{const s=getComputedStyle(e);return {appearance:s.appearance,padding:s.padding,border:s.borderRadius};});
  await page.evaluate(t=>{document.documentElement.dataset.theme=t;document.body.getBoundingClientRect();},theme);
  await page.screenshot({path:'.evidence/material-contract-'+engine.name()+'-'+theme+'-'+viewport.width+'.png'});
  for(const label of ['Shared field select','Compact select','Quiet select']){
    const select=page.getByLabel(label);
    await select.scrollIntoViewIfNeeded();
    await page.waitForFunction(t=>getComputedStyle(document.querySelector('select.bu-input')).colorScheme===t,theme);
    const styles=await select.evaluate(e=>{const option=e.options[1],s=getComputedStyle(option),field=document.createElement('i');field.style.background='var(--bu-field)';field.style.color='var(--bu-text)';e.after(field);const f=getComputedStyle(field);const result={scheme:s.colorScheme,background:s.backgroundColor,text:s.color,expectedBackground:f.backgroundColor,expectedText:f.color};field.remove();return result;});
    assert.equal(styles.scheme,theme);assert.equal(styles.background,styles.expectedBackground);assert.equal(styles.text,styles.expectedText);
    const disabled=await select.locator('option:disabled').evaluateAll(options=>options.map(o=>({disabled:o.matches(':disabled'),opacity:Number(getComputedStyle(o).opacity)})));
    assert.equal(disabled.length,2);assert.ok(disabled.every(o=>o.disabled&&o.opacity<1));
    const custom=await page.evaluate(()=>CSS.supports('appearance','base-select'));
    if(custom){await select.click();assert.ok(await select.evaluate(e=>e.matches(':open')));await page.keyboard.press('Escape');assert.ok(await select.evaluate(e=>document.activeElement===e));await select.click();await select.getByRole('option',{name:'Cross-punch',exact:true}).click();}
    else {await select.focus();await page.keyboard.press('ArrowDown');}
    assert.equal(await select.inputValue(),'Cross-punch');
    await select.press('ArrowDown');await select.press('Escape');assert.equal(await select.inputValue(),'Cross-punch','Disabled choices are skipped');
  }
  const hostAfter=await page.getByLabel('Unrelated host select').evaluate(e=>{const s=getComputedStyle(e);return {appearance:s.appearance,padding:s.padding,border:s.borderRadius};});assert.deepEqual(hostAfter,hostBefore);assert.equal(hostAfter.appearance,'auto','Unrelated host select keeps native appearance');
  await codeSurface(page.locator('.bu-code').filter({visible:true}));
  await page.locator('.bu-code').filter({visible:true}).evaluate(e=>e.append(document.createTextNode('\n'+ 'a'.repeat(160)+'.png')));await codeSurface(page.locator('.bu-code').filter({visible:true}));
  await page.goto(base+'?theme='+theme+'&page=overlays');
  await page.getByRole('button',{name:'Open export dialog',exact:true}).click();
  await page.getByText('Files · 3',{exact:true}).click();
  await codeSurface(page.getByRole('dialog').locator('.bu-code'));
  await page.screenshot({path:'.evidence/material-'+engine.name()+'-'+theme+'-'+viewport.width+'.png'});
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.getByRole('button',{name:'Controls',exact:true}).click();
  await page.getByText('Export files',{exact:true}).click();await codeSurface(page.locator('.bu-code').filter({visible:true}));
  await page.close();cases++;
 }assert.deepEqual(errors,[]);console.log(engine.name()+': '+cases+' code-surface/native-select cases passed; no page errors');
 }finally{await browser.close();}
}

