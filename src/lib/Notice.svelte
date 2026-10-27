<script>
  import Info from '@lucide/svelte/icons/info';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import X from '@lucide/svelte/icons/x';
  /** @type {{ tone?: 'info' | 'warning' | 'success' | 'danger', title?: string, children?: import('svelte').Snippet, live?: boolean, class?: string, ondismiss?: () => void }} */
  let { tone = 'info', title, children, live = false, class: className = '', ondismiss } = $props();
  const Icon = $derived(({info:Info,warning:TriangleAlert,success:CircleCheck,danger:CircleAlert})[tone]);
</script>
<div class={['bu-notice', className]} data-tone={tone} role={live ? tone === 'danger' ? 'alert' : 'status' : undefined}>
  <Icon aria-hidden="true" />
  <div class="bu-notice-content">{#if title}<strong>{title}</strong>{/if}{#if children}<div class="bu-small">{@render children()}</div>{/if}</div>
  {#if ondismiss}<button type="button" class="bu-action bu-notice-dismiss" data-variant="quiet" aria-label="Dismiss notification" onclick={ondismiss}><X aria-hidden="true" /></button>{/if}
</div>
