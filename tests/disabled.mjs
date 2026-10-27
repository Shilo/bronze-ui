import { chromium, webkit } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.BRONZE_BASE_URL || 'http://127.0.0.1:5204/bronze-ui/';
const engines = process.argv.includes('--webkit') ? [webkit] : process.argv.includes('--chromium') ? [chromium] : [chromium, webkit];

for (const engine of engines) {
  const browser = await engine.launch();
  try {
    for (const width of [900, 320]) for (const theme of ['dark', 'light']) {
      const page = await browser.newPage({ viewport: { width, height: 700 }, hasTouch: true });
      await page.goto(base + 'contract.html');
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
      const disabled = page.getByTestId('disabled-switch-label');
      const enabled = page.getByTestId('enabled-switch-label');
      const state = locator => locator.evaluate(element => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, border: style.borderColor, cursor: style.cursor, opacity: Number(style.opacity), shadow: style.boxShadow };
      });
      const noFeedback = async locator => {
        await page.mouse.move(0, 0);
        const before = await state(locator);
        await locator.hover();
        const after = await state(locator);
        assert.deepEqual(after, before, 'Disabled control must retain its resting material on hover');
        assert.equal(after.cursor, 'not-allowed');
        return after;
      };

      await page.mouse.move(0, 0);
      const enabledRest = await state(enabled);
      await enabled.hover();
      assert.notEqual((await state(enabled)).background, enabledRest.background, 'Enabled switch keeps hover feedback');
      assert.equal((await state(enabled)).cursor, 'pointer');
      const disabledState = await noFeedback(disabled);
      assert.ok(disabledState.opacity < 1);
      assert.equal(await disabled.locator('input').evaluate(element => getComputedStyle(element).cursor), 'not-allowed');
      assert.equal(await disabled.getAttribute('title'), 'No temporal animation');
      assert.ok(await disabled.evaluate(element => {
        const bounds = element.getBoundingClientRect();
        return document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)?.closest('[data-testid="disabled-switch-label"]') === element;
      }), 'Disabled label remains hoverable for its tooltip');
      const bounds = await disabled.boundingBox();
      await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      await page.mouse.down();
      assert.deepEqual(await state(disabled), disabledState, 'Disabled label has no pressed treatment');
      await page.mouse.up();
      await page.touchscreen.tap(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
      assert.equal(await disabled.locator('input').isChecked(), false);
      assert.deepEqual(await state(disabled), disabledState, 'Touch does not leave disabled hover feedback');
      assert.equal(await disabled.locator('input').evaluate(element => {
        element.focus();
        return document.activeElement === element;
      }), false, 'Disabled switch cannot receive focus');
      await noFeedback(page.getByTestId('disabled-checkbox-label'));
      await noFeedback(page.getByLabel('Unavailable move picker'));
      await noFeedback(page.getByLabel('Unavailable quiet picker'));
      await noFeedback(page.getByRole('button', { name: 'Disabled button' }));
      await noFeedback(page.getByTestId('disabled-affordances').getByRole('button', { name: 'Disabled row' }));
      const ariaDisabled = page.getByRole('button', { name: 'ARIA disabled action' });
      await noFeedback(ariaDisabled);
      await page.keyboard.press('Tab');
      await ariaDisabled.focus();
      assert.equal(await ariaDisabled.evaluate(element => getComputedStyle(element).outlineStyle), 'solid', 'ARIA-disabled control retains visible keyboard focus');
      await enabled.locator('input').check();
      assert.equal(await enabled.locator('input').isChecked(), true);
      await page.close();
    }
    console.log(engine.name() + ': disabled pointer, touch, native field and composite-label states passed');
  } finally {
    await browser.close();
  }
}
