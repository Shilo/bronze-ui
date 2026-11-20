<script>
  import Check from '@lucide/svelte/icons/check';
  /** @type {{ label: string, options: readonly { value: string, label: string }[], value: string, onchange: (value: string) => void }} */
  let { label, options, value, onchange } = $props();
  const name = $props.id();
</script>

<div class="bu-segmented" role="radiogroup" aria-label={label}>
  {#each options as option (option.value)}
    <label class="bu-segment">
      <input type="radio" {name} value={option.value} checked={value === option.value}
        onchange={() => onchange(option.value)} />
      <span class="bu-segment-face">
        <Check size={14} aria-hidden="true" />
        <span>{option.label}</span>
      </span>
    </label>
  {/each}
</div>
