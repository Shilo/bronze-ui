import {chromium,webkit} from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.BRONZE_BASE_URL||'http://127.0.0.1:5204/bronze-ui/';
for(const engine of (process.argv.includes("--webkit")?[webkit]:process.argv.includes("--chromium")?[chromium]:[chromium,webkit])){const browser=await engine.launch();try{const page=await browser.newPage();await page.goto(base+'contract.html');const group=page.getByRole('radiogroup',{name:'Unselected choices'});await group.getByRole('radio',{name:'One'}).focus();assert.equal(await group.getByRole('radio',{name:'One'}).getAttribute('tabindex'),'0');await page.keyboard.press('ArrowRight');assert.equal(await group.getByRole('radio',{name:'One'}).getAttribute('aria-checked'),'true');await page.keyboard.press('ArrowRight');assert.equal(await group.getByRole('radio',{name:'Two'}).getAttribute('aria-checked'),'true');await page.getByRole('button',{name:'Form help'}).click();await page.keyboard.press('Escape');assert.equal(await page.getByTestId('hidden-contract').isVisible(),false);assert.ok(await page.getByLabel('Unrelated host file').evaluate(e=>e.getBoundingClientRect().width<500));assert.equal(await page.getByRole('button',{name:'Open dialog'}).evaluate(e=>getComputedStyle(e).color),'rgb(242, 238, 230)');const owner=page.getByRole('button',{name:'Open dialog'});await owner.click();await page.getByRole('dialog').getByRole('button',{name:'Close'}).click();assert.equal(await page.getByLabel('Form submissions').innerText(),'0');assert.ok(await owner.evaluate(e=>e===document.activeElement));assert.equal(await page.getByLabel('Host artwork').evaluate(e=>e.getBoundingClientRect().width),64);console.log(engine.name()+': form safety, empty/unselected radio and host style contract passed');}finally{await browser.close();}}


// Appearance recipes are consumed without base.css: the host keeps geometry.
const engines = process.argv.includes('--webkit') ? [webkit] : process.argv.includes('--chromium') ? [chromium] : [chromium, webkit];
for (const engine of engines) {
  const browser = await engine.launch();
  try {
    for (const width of [900, 320]) for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + 'contract.html');
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const roles = await page.evaluate(() => {
        const result = {};
        for (const role of ['text', 'accent', 'on-accent', 'field', 'surface']) {
          const probe = document.createElement('i'); probe.style.color = `var(--bu-${role})`; document.body.append(probe);
          result[role] = getComputedStyle(probe).color; probe.remove();
        }
        return result;
      });
      const style = locator => locator.evaluate(el => {
        const s = getComputedStyle(el), b = el.getBoundingClientRect();
        return { color: s.color, background: s.backgroundColor, border: s.borderTopWidth, opacity: Number(s.opacity), width: b.width, height: b.height, font: s.fontSize, outline: s.outlineStyle, outlineWidth: s.outlineWidth };
      });
      for (const variant of ['primary', 'outline', 'tile', 'field', 'row', 'direction', 'tab']) {
        const row = page.getByTestId('variant-' + variant), normal = row.getByRole('button', { name: 'Normal ' + variant, exact: true }), pressed = row.getByRole('button', { name: 'Pressed ' + variant, exact: true }), disabled = row.getByRole('button', { name: 'Disabled ' + variant, exact: true });
        await page.mouse.move(0, 0);
        const [n, p, d] = await Promise.all([style(normal), style(pressed), style(disabled)]);
        for (const state of [n, p, d]) { assert.equal(state.width, 160); assert.equal(state.height, 34); assert.equal(state.font, '17px'); }
        assert.ok(d.opacity < 1); assert.equal(await disabled.isDisabled(), true);
        assert.equal(n.color, variant === 'primary' ? roles['on-accent'] : roles.text);
        assert.equal(p.color, variant === 'primary' ? roles['on-accent'] : roles.accent);
        if (['outline', 'tile', 'field'].includes(variant)) { assert.equal(n.border, '1px'); assert.notEqual(n.background, 'rgba(0, 0, 0, 0)'); assert.notEqual(n.background, p.background); }
        if (variant === 'direction' || variant === 'row') assert.notEqual(n.background, p.background);
        if (variant === 'tab') assert.equal(await pressed.evaluate(el => getComputedStyle(el).borderBottomStyle), 'solid');
        await page.keyboard.press('Tab'); await normal.focus();
        const f = await style(normal); assert.equal(f.outline, 'solid'); assert.equal(f.outlineWidth, '2px'); assert.equal(f.height, 34);
      }
      for (const variant of ['outline', 'tile', 'field']) assert.equal((await style(page.getByRole('button', { name: 'Hostile ' + variant }))).color, roles.text, 'Filled action supplies its own foreground on a hostile host');
      const joined = page.getByTestId('joined-contract');
      const seam = await joined.locator('button').evaluateAll(es => es.map(e => { const b = e.getBoundingClientRect(), s = getComputedStyle(e); return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, tl: s.borderTopLeftRadius, tr: s.borderTopRightRadius, bl: s.borderBottomLeftRadius, br: s.borderBottomRightRadius }; }));
      if (width > 380) { assert.equal(seam[1].left, seam[0].right - 1); assert.equal(seam[0].tr, '0px'); assert.equal(seam[1].tl, '0px'); }
      else { assert.equal(seam[1].top, seam[0].bottom - 1); assert.equal(seam[0].bl, '0px'); assert.equal(seam[1].tl, '0px'); }
      const single = page.getByTestId('singleton-contract').locator('button');
      assert.deepEqual(await single.evaluate(el => { const s = getComputedStyle(el); return [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius]; }), ['8px', '8px', '8px', '8px']);
      const compactSelect = await style(page.getByLabel('Compact select')); assert.equal(compactSelect.width, 132); assert.equal(compactSelect.height, 32); assert.equal(compactSelect.font, '15px'); assert.equal(compactSelect.background, roles.field); assert.equal(compactSelect.color, roles.text);
      const swatch = await style(page.getByRole('button', { name: 'Flat host swatch' })); assert.equal(swatch.width, 28); assert.equal(swatch.height, 28); assert.equal(swatch.background, 'rgb(66, 141, 122)');
      await page.getByTestId('focus-contract').focus(); const focus = await style(page.getByTestId('focus-contract')); assert.equal(focus.outline, 'solid'); assert.equal(focus.outlineWidth, '2px');
      await page.getByRole('button', { name: 'Opaque review', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: 'Opaque host dialog' });
      const panel = await style(dialog); assert.equal(panel.width, 260); assert.equal(panel.background, roles.surface); assert.equal(panel.color, roles.text);
      assert.equal(await dialog.evaluate(el => getComputedStyle(el).backdropFilter), 'none');
      await dialog.getByRole('button', { name: 'Close review' }).click(); assert.deepEqual(errors, []); await page.close();
    }
    console.log(engine.name() + ': four no-base appearance/theme/geometry cases passed');
  } finally { await browser.close(); }
}

// Feedback shares semantic colors without requiring a title or a document reset.
for (const engine of engines) {
  const browser = await engine.launch();
  try {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width: 320, height: 568 } });
      await page.goto(base + 'contract.html');
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      const notices = page.getByRole('region', { name: 'Notification contracts' });
      const toasts = notices.locator('.bu-toast');
      assert.equal(await toasts.count(), 3);
      assert.equal(await toasts.first().locator('strong').count(), 0, 'ordinary message needs no title');
      assert.equal(await toasts.nth(1).locator('strong').innerText(), 'Preview');
      for (const toast of await toasts.all()) {
        const style = await toast.evaluate(el => {
          const s = getComputedStyle(el), icon = getComputedStyle(el.querySelector('svg'));
          const probe = document.createElement('i'); probe.style.color = 'var(--bu-' + el.dataset.tone + ')'; el.append(probe);
          const tone = getComputedStyle(probe).color; probe.remove();
          const canvas = document.createElement('canvas').getContext('2d'); canvas.fillStyle = s.backgroundColor; canvas.fillRect(0,0,1,1);
          return { edge: s.borderInlineStartColor, icon: icon.color, tone, alpha: canvas.getImageData(0,0,1,1).data[3], width: el.getBoundingClientRect().width, overflow: el.scrollWidth > el.clientWidth };
        });
        assert.equal(style.edge, style.tone); assert.equal(style.icon, style.tone);
        assert.equal(style.alpha, 255, 'feedback surface stays opaque over artwork');
        assert.ok(style.width <= 320); assert.equal(style.overflow, false);
      }
      const close = notices.getByRole('button', { name: 'Dismiss notification' });
      assert.ok(await close.evaluate(el => el.getBoundingClientRect().width >= 44 && el.getBoundingClientRect().height >= 44));
      await close.click(); assert.equal(await page.getByTestId('notification-dismissals').innerText(), '1');
      assert.equal(await page.getByLabel('Form submissions').innerText(), '0', 'dismiss does not submit its host form');
      await page.close();
    }
    console.log(engine.name() + ': optional feedback title, semantic themes, opaque surface and form-safe dismissal passed');
  } finally { await browser.close(); }
}
