<script>
  /** @type {{ label: string, hint?: string, error?: string, children: import('svelte').Snippet<[Record<string, string | undefined>]> }} */
  let { label, hint = '', error = '', children } = $props();
  const id = $props.id();
  const attrs = $derived({ id, 'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined, 'aria-invalid': error ? 'true' : undefined });
</script>
<div class="bu-field">
  <label for={id}>{label}</label>
  {@render children(attrs)}
  {#if error}<p class="bu-error" id="{id}-error">{error}</p>{:else if hint}<p class="bu-small bu-muted" id="{id}-hint">{hint}</p>{/if}
</div>
