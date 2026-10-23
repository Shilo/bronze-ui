<script>
  import Check from '@lucide/svelte/icons/check';
  /** @type {{ label: string, options?: string[], value?: string }} */
  let { label, options = [], value = $bindable() } = $props();
  let group;
  const selectedIndex = $derived(options.indexOf(value));
  function key(event) {
    const keys=['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'];
    if (!keys.includes(event.key) || !options.length) return;
    event.preventDefault();
    const i=options.indexOf(value), step=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;
    value=options[event.key==='Home'?0:event.key==='End'?options.length-1:i<0?(step>0?0:options.length-1):(i+step+options.length)%options.length];
    group.querySelectorAll('button')[options.indexOf(value)].focus();
  }
</script>
<div bind:this={group} class="bu-choice-group" role="radiogroup" aria-label={label}>{#each options as option, index}<button type="button" class="bu-btn" role="radio" aria-checked={value===option} tabindex={value===option || selectedIndex<0 && index===0?0:-1} onkeydown={key} onclick={() => value=option}>{option}{#if value===option}<Check />{/if}</button>{/each}</div>
