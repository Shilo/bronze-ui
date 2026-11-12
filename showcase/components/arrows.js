// Showcase-only arrow keys for a tablist or a navigation list: arrows (by orientation, mirrored in
// right-to-left text), Home and End move focus to the next enabled visible button and click it, so
// the sample's own click handler stays the only selection path. Bronze leaves this to hosts.
/**
 * @param {{ orientation?: 'horizontal' | 'vertical', selector?: string }} [options]
 * @returns {(node: HTMLElement) => () => void}
 */
export function arrows({ orientation = 'horizontal', selector = 'button' } = {}) {
  return (node) => {
    /** @param {KeyboardEvent} event */
    const key = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const rtl = orientation === 'horizontal' && getComputedStyle(node).direction === 'rtl';
      const next = orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight',
        prev = orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
      if (![next, prev, 'Home', 'End'].includes(event.key)) return;
      const items = /** @type {HTMLElement[]} */ ([...node.querySelectorAll(selector)]).filter(
        (t) => !t.matches(':disabled,[aria-disabled=true]') && t.getClientRects().length
      );
      const i = items.indexOf(/** @type {HTMLElement} */ (document.activeElement));
      if (i < 0) return;
      event.preventDefault();
      const target =
        event.key === 'Home' ? items[0]
        : event.key === 'End' ? items[items.length - 1]
        : items[(i + (event.key === next ? 1 : -1) + items.length) % items.length];
      target.focus();
      target.click();
    };
    node.addEventListener('keydown', key);
    return () => node.removeEventListener('keydown', key);
  };
}
