// Regressions from the independent 0.2.0 audit. No base.css or paid calls.
import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';
const base = process.env.BRONZE_BASE_URL || 'http://127.0.0.1:5204/bronze-ui/';
const engines = process.argv.includes('--chromium') ? [chromium] : process.argv.includes('--webkit') ? [webkit] : [chromium, webkit];
const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
const luminance = color => rgb(color).map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((n, v, i) => n + v * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
for (const engine of engines) {
  const browser = await engine.launch();
  try {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
      await page.goto(base + 'contract.html');
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      // These ordinary unlayered element resets also test stylesheet ordering.
      await page.addStyleTag({ content: '* {box-sizing:content-box} button {all:revert} p {margin:28px}' });
      const field = page.getByLabel('Sample name');
      const geometry = await field.evaluate(e => ({ width: e.getBoundingClientRect().width, parent: e.parentElement.getBoundingClientRect().width, box: getComputedStyle(e).boxSizing, margin: getComputedStyle(e.parentElement.querySelector('.bu-error')).margin }));
      assert.equal(geometry.box, 'border-box'); assert.equal(geometry.width, geometry.parent); assert.equal(geometry.margin, '0px');
      for (const icon of await page.getByTestId('reset-contract').locator('svg').evaluateAll(es => es.map(e => ({ w: getComputedStyle(e).width, h: getComputedStyle(e).height })))) assert.deepEqual(icon, { w: '20px', h: '20px' });
      assert.equal(await page.getByRole('button', { name: 'Open dialog', exact: true }).evaluate(e => getComputedStyle(e).fontSize), '16px');
      const select = page.getByLabel('Compact select');
      // Resolve color-mix to sRGB with a canvas before measuring the rendered border.
      const boundary = await select.evaluate(e => { const s = getComputedStyle(e), c = document.createElement('canvas').getContext('2d'); const resolve = color => { c.fillStyle = color; c.fillRect(0, 0, 1, 1); const p = c.getImageData(0, 0, 1, 1).data; return `rgb(${p[0]},${p[1]},${p[2]})`; }; return { border: resolve(s.borderColor), background: resolve(s.backgroundColor) }; });
      assert.ok(contrast(boundary.border, boundary.background) >= 3, JSON.stringify(boundary));
      const quiet = page.getByLabel('Quiet select');
      assert.deepEqual(await quiet.evaluate(e => { const s = getComputedStyle(e), b = e.getBoundingClientRect(); return [s.backgroundColor, s.borderTopColor, b.width, b.height, s.fontSize]; }), ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)', 132, 32, '15px']);
      await quiet.selectOption('Cross-punch'); assert.equal(await quiet.inputValue(), 'Cross-punch');
      const focus = page.getByTestId('focus-contract'); await focus.focus();
      assert.equal(await focus.evaluate(e => getComputedStyle(e).outlineOffset), '3px');
      await focus.evaluate(e => e.style.setProperty('--bu-focus-offset', '-3px'));
      assert.deepEqual(await focus.evaluate(e => { const s = getComputedStyle(e); return [s.outlineOffset, s.outlineWidth, s.outlineStyle]; }), ['-3px', '2px', 'solid']);
      const owner = page.getByRole('button', { name: 'Open dialog', exact: true }); await owner.click();
      const dialog = page.getByRole('dialog', { name: 'Form dialog', exact: true }); await dialog.getByRole('button', { name: 'Start sample' }).click();
      for (let i = 0; i < 4; i++) { await page.keyboard.press('Escape'); assert.ok(await dialog.isVisible(), `busy Escape ${i + 1}`); }
      await dialog.getByRole('button', { name: 'Finish sample' }).click(); await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' }); assert.ok(await owner.evaluate(e => e === document.activeElement));
      // Existing translucent action materials become opaque when requested.
      await page.emulateMedia({ contrast: 'more' });
      for (const variant of ['outline', 'row', 'direction']) {
        const action = page.getByRole('button', { name: 'Pressed ' + variant, exact: true });
        const alpha = await action.evaluate(e => { const c = document.createElement('canvas').getContext('2d'); c.fillStyle = getComputedStyle(e).backgroundColor; c.fillRect(0, 0, 1, 1); return c.getImageData(0, 0, 1, 1).data[3]; });
        assert.equal(alpha, 255, variant + ' opaque contrast fallback');
      }
      if (engine === chromium) {
        const cdp = await page.context().newCDPSession(page); await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
        assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bu-outline').trim()), theme === 'dark' ? '#202329' : '#faf7f0');
      }
      await page.emulateMedia({ forcedColors: 'active' });
      await quiet.focus();
      assert.deepEqual(await quiet.evaluate(e => { const s = getComputedStyle(e); return [s.outlineStyle, s.outlineWidth]; }), ['solid', '2px']);
      await page.close();
    }
    console.log(engine.name() + ': no-base resets, select contrast/quiet geometry, four busy Escapes and material fallbacks passed');
  } finally { await browser.close(); }
}
