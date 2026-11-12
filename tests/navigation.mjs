// Tabs, rail, tiles, sticky section fades, edge fades and the top toast region, without base.css.
import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.BRONZE_BASE_URL || 'http://127.0.0.1:5204/bronze-ui/';
const engines = process.argv.includes('--webkit') ? [webkit] : process.argv.includes('--chromium') ? [chromium] : [chromium, webkit];

for (const engine of engines) {
  const browser = await engine.launch();
  try {
    for (const width of [900, 320]) for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width, height: 800 } });
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(base + 'contract.html');
      await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
      const role = name => page.evaluate(n => { const p = document.createElement('i'); p.style.color = `var(--bu-${n})`; document.body.append(p); const c = getComputedStyle(p).color; p.remove(); return c; }, name);
      const accent = await role('accent'), text = await role('text');

      // Horizontal tabs: the selected tab carries the accent marker (keyboard behavior is host-owned).
      const tabs = page.getByRole('tablist', { name: 'Horizontal contract tabs' });
      const tab = n => tabs.getByRole('tab', { name: n, exact: true });
      await tab('Two').click(); assert.equal(await tab('Two').getAttribute('aria-selected'), 'true');
      await tab('One').click();
      assert.equal(await tab('One').evaluate(e => getComputedStyle(e).borderBottomColor), accent);
      assert.equal(await tab('One').evaluate(e => getComputedStyle(e).color), accent);

      // Filled tabs: buttons touch (no dead gap between targets) and the label, not the button, carries the underline.
      const fill = page.getByRole('tablist', { name: 'Filled contract tabs' });
      const ftab = n => fill.getByRole('tab', { name: n, exact: true });
      await ftab('Middle').click();
      const [l, m] = await Promise.all([ftab('Left').boundingBox(), ftab('Middle').boundingBox()]);
      assert.ok(Math.abs(l.x + l.width - m.x) < 1, 'filled tabs leave no gap between targets');
      assert.equal(await ftab('Middle').evaluate(e => getComputedStyle(e).borderBottomStyle), 'none');
      const under = await ftab('Middle').locator('.bu-tab-label').evaluate(e => { const s = getComputedStyle(e), b = e.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect(); return [s.borderBottomColor, Math.round(p.bottom - b.bottom), b.width < p.width]; });
      assert.deepEqual(under, [accent, 0, true], 'the underline sits at the tab bottom under the label only');
      assert.notEqual(await ftab('Left').locator('.bu-tab-label').evaluate(e => getComputedStyle(e).borderBottomColor), accent);
      // .bu-tab-text reserves the bold width, so selecting a tab never resizes its text.
      const textWidth = () => ftab('Left').locator('.bu-tab-text').evaluate(e => e.getBoundingClientRect().width);
      const atRest = await textWidth(); await ftab('Left').click(); assert.ok(Math.abs(await textWidth() - atRest) < 0.5, 'tab text keeps its width when selected'); await ftab('Middle').click();

      // Navigation rail: aria-current marks the current entry; the label is accent + underlined; filled dot visible only when not current.
      const rail = page.getByTestId('rail-contract');
      const item = n => rail.getByRole('button', { name: 'Rail ' + n, exact: true });
      assert.equal(await rail.evaluate(e => e.tagName), 'NAV');
      await item('B').click(); assert.equal(await item('B').getAttribute('aria-current'), 'location');
      assert.equal(await item('B').locator('.bu-rail-dot').evaluate(e => getComputedStyle(e).opacity), '0', 'the current entry hides its dot');
      await item('A').click(); assert.equal(await item('A').getAttribute('aria-current'), 'location'); assert.equal(await item('B').getAttribute('aria-current'), null);
      assert.equal(await item('C').evaluate(e => { e.setAttribute('aria-current', 'false'); const w = getComputedStyle(e.querySelector('.bu-rail-label')).fontWeight; e.removeAttribute('aria-current'); return w; }), '400', 'aria-current=false is not current');
      const label = await item('A').locator('.bu-rail-label').evaluate(e => { const s = getComputedStyle(e); return [s.color, s.borderBottomColor, s.borderBottomStyle, s.fontWeight]; });
      assert.deepEqual(label.slice(0, 3), [accent, accent, 'solid']); assert.equal(Number(label[3]), 600);
      assert.equal(await item('C').locator('.bu-rail-label').evaluate(e => getComputedStyle(e).fontWeight), '400');
      assert.ok(Number(await item('B').locator('.bu-rail-dot').evaluate(e => getComputedStyle(e).opacity)) > 0.5, 'filled dot shows');
      assert.equal(await item('A').locator('.bu-rail-dot').evaluate(e => getComputedStyle(e).opacity), '0');
      assert.equal(await rail.evaluate(e => getComputedStyle(e).scrollbarWidth), 'none');

      // Edge fades appear only toward remaining content.
      const fades = () => rail.evaluate(e => [e.style.getPropertyValue('--bu-fade-start'), e.style.getPropertyValue('--bu-fade-end')]);
      await rail.evaluate(e => e.scrollTop = 0); await page.waitForTimeout(50);
      assert.deepEqual(await fades(), ['0px', '24px']);
      await rail.evaluate(e => e.scrollTop = e.scrollHeight); await page.waitForTimeout(50);
      assert.deepEqual(await fades(), ['24px', '0px']);
      await rail.evaluate(e => e.scrollTop = 40); await page.waitForTimeout(50);
      assert.deepEqual(await fades(), ['24px', '24px']);
      assert.notEqual(await rail.evaluate(e => getComputedStyle(e).maskImage || getComputedStyle(e).webkitMaskImage), 'none');

      // Tiles: selected uses accent border/fill/check; empty is dashed; add activates.
      const tiles = page.getByTestId('tile-contract');
      const tileStyle = l => l.evaluate(e => { const s = getComputedStyle(e); return { color: s.color, border: s.borderTopColor, style: s.borderTopStyle, background: s.backgroundColor }; });
      const sel = await tileStyle(tiles.getByRole('button', { name: 'Selected tile' })), normal = await tileStyle(tiles.getByRole('button', { name: 'Normal tile' }));
      assert.equal(sel.border, accent); assert.equal(sel.color, accent); assert.notEqual(sel.background, normal.background); assert.equal(normal.color, text);
      assert.equal(await tiles.locator('.bu-tile-check').evaluate(e => getComputedStyle(e).color), accent);
      assert.equal((await tileStyle(tiles.getByRole('button', { name: 'Empty' }))).style, 'dashed');
      // Selected for details but not on: the plain border role, no accent text or fill.
      const viewed = await tileStyle(tiles.getByRole('button', { name: 'Viewed tile' })), border = await role('border');
      assert.equal(viewed.border, border); assert.equal(viewed.color, text); assert.equal(viewed.background, normal.background); assert.notEqual(normal.border, border);
      const label2 = await tiles.getByRole('button', { name: 'Normal tile' }).evaluate(e => { const t = e.getBoundingClientRect(), l = e.querySelector('.bu-tile-label').getBoundingClientRect(); return t.bottom - l.bottom; });
      assert.ok(label2 >= 8 && label2 <= 12, 'label sits on the shared bottom baseline');
      await tiles.getByRole('button', { name: 'New' }).click(); assert.equal(await page.getByTestId('tile-presses').innerText(), '1');

      // Tile status, dimmed art and the sibling options button.
      const status = page.getByTestId('tile-status-contract');
      const warn = await role('warning'), muted = await role('muted'), hover = await role('hover');
      assert.equal(await status.locator('.bu-tile-status[data-tone=warning]').evaluate(e => getComputedStyle(e).color), warn);
      assert.equal(await status.locator('.bu-tile-status[data-tone=hidden]').evaluate(e => getComputedStyle(e).color), muted);
      assert.equal(await status.locator('.bu-tile-status').first().evaluate(e => getComputedStyle(e).lineHeight), '0px');
      assert.ok(Number(await status.locator('.bu-tile[data-dim] > .bu-tile-art').evaluate(e => getComputedStyle(e).opacity)) < 0.6, 'hidden item art is dimmed');
      assert.equal(await status.getByRole('button', { name: 'Look tile, needs a look' }).locator('.bu-tile-art').evaluate(e => getComputedStyle(e).opacity), '1');
      const more = status.getByRole('button', { name: 'More options for Look tile' });
      assert.equal(await more.evaluate(e => e.parentElement.querySelector('.bu-tile').contains(e)), false, 'options button is a sibling, not nested');
      const moreStyle = () => more.evaluate(e => { const s = getComputedStyle(e); return { color: s.color, background: s.backgroundColor, display: s.display, radius: s.borderTopLeftRadius }; });
      const rest = await moreStyle();
      assert.equal(rest.color, muted); assert.equal(rest.background, 'rgba(0, 0, 0, 0)'); assert.equal(rest.display, 'grid'); assert.equal(rest.radius, '8px');
      const hit = await more.boundingBox(); assert.ok(hit.width >= 40 && hit.height >= 40, 'host sizes the hit area');
      await more.click(); await page.mouse.move(0, 0); await page.waitForTimeout(250);
      const open = await moreStyle(); assert.equal(await more.getAttribute('aria-expanded'), 'true');
      assert.equal(open.color, text); assert.equal(open.background, hover);
      await more.click();
      await page.mouse.move(0, 0); await status.getByRole('button', { name: 'Look tile, needs a look' }).focus(); await page.keyboard.press('Tab');
      assert.ok(await more.evaluate(e => e === document.activeElement));
      assert.equal(await more.evaluate(e => getComputedStyle(e).outlineStyle), 'solid', 'focus ring like other controls');

      // Sticky fade: content under a header gets a mask positioned at the header's lower edge; content far below does not.
      const list = page.getByTestId('sticky-contract');
      await list.evaluate(e => e.scrollTop = 0); await page.waitForTimeout(80);
      const second = page.getByTestId('block-Second');
      assert.equal(await second.getAttribute('data-bu-fade'), null, 'nothing fades far below a header');
      await list.evaluate(e => e.scrollTop = 120); await page.waitForTimeout(80);
      const first = page.getByTestId('block-First');
      assert.equal(await first.getAttribute('data-bu-fade'), '');
      const y = await first.evaluate(e => parseFloat(e.style.getPropertyValue('--bu-fade-y')));
      const expected = await first.evaluate(e => e.previousElementSibling.getBoundingClientRect().bottom - e.getBoundingClientRect().top);
      assert.ok(Math.abs(y - expected) < 1.5, `fade sits at the header edge (${y} vs ${expected})`);
      assert.notEqual(await first.evaluate(e => getComputedStyle(e).maskImage || getComputedStyle(e).webkitMaskImage), 'none');
      assert.equal(await list.locator('.bu-section-head').first().evaluate(e => getComputedStyle(e).backgroundColor), 'rgba(0, 0, 0, 0)', 'header has no backing');
      assert.equal(await list.locator('.bu-section-head').first().evaluate(e => getComputedStyle(e).position), 'sticky');
      assert.equal(await list.locator('.bu-section-head[data-current] .bu-section-title').evaluate(e => getComputedStyle(e).color), accent);
      // Header actions are muted at rest and take the accent on hover.
      const headAction = list.getByRole('button', { name: 'Add to First' });
      await page.mouse.move(0, 0);
      assert.equal(await headAction.evaluate(e => getComputedStyle(e).color), await role('muted'));
      await headAction.hover();
      assert.equal(await headAction.evaluate(e => getComputedStyle(e).color), accent);
      await page.mouse.move(0, 0);
      await list.evaluate(e => e.scrollTop = 0); await page.waitForTimeout(80);
      assert.equal(await second.getAttribute('data-bu-fade'), null);

      // Top toast region: anchored at --bu-toast-top, centered on --bu-toast-center, sized to its message and capped at 420px or the room.
      await page.getByRole('button', { name: 'Toggle region toast' }).click();
      const region = page.getByTestId('toast-region');
      const measure = () => region.evaluate(e => { const b = e.getBoundingClientRect(); return { top: b.top, center: b.left + b.width / 2, width: b.width }; });
      const box = await measure();
      assert.equal(Math.round(box.top), 60); assert.equal(Math.round(box.center), 300); assert.ok(box.width < 420, 'a short message keeps the toast compact');
      await region.locator('.bu-notice-content .bu-small').evaluate(e => { e.textContent = 'A longer notification that needs more than one line at the capped width of the region toast.'; });
      const long = await measure();
      assert.equal(Math.round(long.width), 420); assert.equal(Math.round(long.center), 300);
      assert.equal(await page.getByTestId('toast-region').locator('.bu-toast').evaluate(e => getComputedStyle(e).position), 'relative');
      await page.getByRole('button', { name: 'Toggle region toast' }).click();
      assert.deepEqual(errors, []);
      await page.close();
    }
    // Touch: tile options reach a full control target even where the host draws them smaller (the contract uses 40px).
    if (engine === chromium) {
      const touch = await browser.newPage({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
      await touch.goto(base + 'contract.html');
      assert.equal(await touch.evaluate(() => matchMedia('(pointer: coarse)').matches), true);
      const hit = await touch.getByTestId('tile-status-contract').locator('.bu-tile-more').first().boundingBox();
      assert.ok(hit.width >= 44 && hit.height >= 44, `coarse tile options are 44px, got ${hit.width}x${hit.height}`);
      await touch.close();
    }
    // Forced colors removes masks and outlines the selected tile.
    const page = await browser.newPage();
    if (engine === chromium) {
      await page.emulateMedia({ forcedColors: 'active' });
      await page.goto(base + 'contract.html');
      assert.equal(await page.getByTestId('rail-contract').evaluate(e => getComputedStyle(e).maskImage), 'none');
      assert.equal(await page.getByTestId('tile-contract').getByRole('button', { name: 'Selected tile' }).evaluate(e => getComputedStyle(e).outlineStyle), 'solid');
      const status = page.getByTestId('tile-status-contract');
      assert.equal(await status.locator('.bu-tile[data-dim]').evaluate(e => getComputedStyle(e).borderTopStyle), 'dashed', 'dimmed state is not opacity-only');
      assert.notEqual(await status.locator('.bu-tile-status').first().evaluate(e => getComputedStyle(e).color), 'rgba(0, 0, 0, 0)');
      const current = await page.getByTestId('sticky-contract').locator('.bu-section-head[data-current] .bu-section-title').evaluate(e => getComputedStyle(e).textDecorationLine);
      assert.equal(current, 'underline', 'current section keeps a non-color cue');
    }
    await page.close();
    console.log(engine.name() + ': tabs, navigation rail, tiles, tile status and options, sticky/edge fades and toast region contract passed');
  } finally { await browser.close(); }
}
