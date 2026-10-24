<script>
  /** @type {{ open?: boolean, title: string, children: import('svelte').Snippet, footer?: import('svelte').Snippet, busy?: boolean, returnTo?: HTMLElement }} */
  let { open = $bindable(false), title, children, footer, busy = false, returnTo } = $props();
  const id = $props.id();
  let dialog, opener;
  $effect(() => {
    if (open && !dialog.open) {
      // WebKit does not necessarily focus a button on pointer activation.
      opener = returnTo ?? document.activeElement;
      const popover = opener?.closest('[popover]');
      if (popover?.id) opener = document.querySelector(`[aria-controls="${CSS.escape(popover.id)}"], [popovertarget="${CSS.escape(popover.id)}"]`) ?? opener;
      dialog.showModal();
    }
    else if (!open && dialog.open) { dialog.close(); (opener?.isConnected ? opener : document.querySelector('main'))?.focus(); }
  });
  function close() { if (!busy) open = false; }
</script>
<dialog bind:this={dialog} class="bu-dialog" aria-labelledby={id} onkeydown={e => { if (busy && e.key === 'Escape') e.preventDefault(); }} oncancel={e => { e.preventDefault(); close(); }} onclose={() => { open = false; }}>
  <header class="bu-dialog-head"><h2 {id}>{title}</h2><button type="button" class="bu-btn" data-variant="quiet" onclick={close} disabled={busy}>Close</button></header>
  <div class="bu-dialog-body">{@render children()}</div>
  {#if footer}<footer class="bu-dialog-foot">{@render footer()}</footer>{/if}
</dialog>
