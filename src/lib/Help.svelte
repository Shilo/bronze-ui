<script>
  import { onMount, tick } from 'svelte';
  import CircleHelp from '@lucide/svelte/icons/circle-help';
  /** @type {{ label: string, text: string }} */
  let { label, text } = $props();
  const id = $props.id();
  let trigger, tip, open = $state(false), timer;
  function hide() { clearTimeout(timer); open = false; if (tip) { delete tip.dataset.positioned; tip.hidePopover(); } }
  function deferHide() { clearTimeout(timer); timer = setTimeout(hide, 150); }
  function position() {
    if (!open) return;
    const r = trigger.getBoundingClientRect(), t = tip.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) { hide(); return; }
    const left = Math.max(12, Math.min(r.left + r.width / 2 - t.width / 2, innerWidth - t.width - 12));
    const below = innerHeight - r.bottom - 12, above = r.top - 12;
    const side = below >= t.height + 8 || below >= above ? 'bottom' : 'top';
    tip.dataset.side = side;
    tip.style.left = left + 'px';
    tip.style.top = Math.max(12, side === 'bottom' ? r.bottom + 8 : r.top - t.height - 8) + 'px';
    tip.style.setProperty('--bu-arrow-x', Math.max(12, Math.min(t.width - 24, r.left + r.width / 2 - left - 6)) + 'px');
    tip.dataset.positioned = '';
  }
  async function show() { clearTimeout(timer); open = true; tip.showPopover(); await tick(); position(); }
  onMount(() => {
    const key = e => { if (open && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); hide(); } };
    const outside = e => { if (open && !trigger.contains(e.target) && !tip.contains(e.target)) hide(); };
    document.addEventListener('keydown', key, true); document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', position); window.addEventListener('scroll', position, true);
    return () => { clearTimeout(timer); document.removeEventListener('keydown', key, true); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true); };
  });
</script>
<span class="bu-help">
  <button type="button" bind:this={trigger} class="bu-btn" data-icon data-variant="quiet" aria-label={label} aria-describedby={open ? id : undefined} onpointerenter={e => { if (e.pointerType === 'mouse') show(); }} onpointerleave={e => { if (e.pointerType === 'mouse') deferHide(); }} onfocus={() => { if (trigger.matches(':focus-visible')) show(); }} onblur={hide} onclick={show}><CircleHelp /></button>
  <span bind:this={tip} {id} role="tooltip" popover="manual" class="bu-popover-anchor bu-tooltip-anchor" onpointerenter={() => clearTimeout(timer)} onpointerleave={deferHide}><svg class="bu-popover-arrow" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0 12 8 12 12H0V8Z"/><path d="M0 8 6 0 12 8"/></svg><span class="bu-tooltip bu-popover-surface">{text}</span></span>
</span>
