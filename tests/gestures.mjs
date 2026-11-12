import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, webkit } from '@playwright/test';

const css = await readFile('styles/tokens.css', 'utf8') + await readFile('styles/components.css', 'utf8');
for (const engine of [chromium, webkit]) {
  const browser = await engine.launch();
  try {
    for (const theme of ['dark', 'light']) {
      const page = await browser.newPage();
      await page.setContent(`<style>${css}</style><style>.bu-gesture-track{width:144px;height:144px;border-width:2px}.bu-gesture-thumb{width:48px;height:48px;border-width:2px}</style><div class="bu-gesture-track"><span class="bu-gesture-thumb"></span></div>`);
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
      const measure = () => page.evaluate(() => {
        const track = getComputedStyle(document.querySelector('.bu-gesture-track'));
        const thumb = getComputedStyle(document.querySelector('.bu-gesture-thumb'));
        const resolve = color => {
          const probe = document.createElement('span');
          probe.style.background = color;
          document.body.append(probe);
          const result = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return result;
        };
        return { track: track.backgroundColor, border: track.borderTopColor, borderStyle: track.borderTopStyle,
          radius: track.borderTopLeftRadius, shadow: track.boxShadow, outline: track.outlineStyle,
          thumb: thumb.backgroundColor, thumbBorder: thumb.borderTopColor, thumbRadius: thumb.borderTopLeftRadius,
          thumbShadow: thumb.boxShadow, thumbOutline: thumb.outlineStyle,
          accent: resolve('var(--bu-accent)'), surface: resolve('var(--bu-surface)'),
          translucentTrack: resolve('color-mix(in srgb,var(--bu-accent) 6%,transparent)'),
          translucentBorder: resolve('color-mix(in srgb,var(--bu-accent) 50%,transparent)'),
          translucentThumb: resolve('color-mix(in srgb,var(--bu-accent) 70%,transparent)'),
          canvas: resolve('Canvas'), canvasText: resolve('CanvasText'), highlight: resolve('Highlight') };
      });
      let styles = await measure();
      assert.equal(styles.track, styles.translucentTrack);
      assert.equal(styles.border, styles.translucentBorder);
      assert.equal(styles.borderStyle, 'solid');
      assert.equal(styles.thumb, styles.translucentThumb);
      assert.equal(styles.thumbBorder, styles.accent);
      assert.equal(styles.radius, '50%');
      assert.equal(styles.thumbRadius, '50%');
      for (const property of ['shadow', 'outline', 'thumbShadow', 'thumbOutline']) assert.equal(styles[property], 'none');
      await page.locator('.bu-gesture-track').evaluate(track => { track.dataset.axis = 'x'; });
      assert.equal((await measure()).radius, '999px');
      await page.emulateMedia({ contrast: 'more' });
      styles = await measure();
      assert.equal(styles.track, styles.surface);
      assert.equal(styles.border, styles.accent);
      assert.equal(styles.thumb, styles.accent);
      await page.emulateMedia({ contrast: 'no-preference' });
      if (engine === chromium) {
        const session = await page.context().newCDPSession(page);
        await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
        assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-transparency: reduce)').matches), true);
        styles = await measure();
        assert.equal(styles.track, styles.surface);
        assert.equal(styles.border, styles.accent);
        assert.equal(styles.thumb, styles.accent);
        await session.send('Emulation.setEmulatedMedia', { features: [] });
        await page.emulateMedia({ forcedColors: 'active', colorScheme: theme });
        styles = await measure();
        assert.equal(styles.track, styles.canvas);
        assert.equal(styles.border, styles.canvasText);
        assert.equal(styles.thumb, styles.highlight);
        assert.equal(styles.thumbBorder, styles.highlight);
        assert.equal(styles.thumbOutline, 'none');
      }
      await page.close();
    }
    console.log(`${engine.name()}: single-edge gesture materials passed in dark/light and increased contrast${engine === chromium ? ', reduced transparency and forced colors' : ''}.`);
  } finally {
    await browser.close();
  }
}
