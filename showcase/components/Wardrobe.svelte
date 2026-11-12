<script>
  import Crown from '@lucide/svelte/icons/crown';
  import Scissors from '@lucide/svelte/icons/scissors';
  import Glasses from '@lucide/svelte/icons/glasses';
  import Shirt from '@lucide/svelte/icons/shirt';
  import Footprints from '@lucide/svelte/icons/footprints';
  import Backpack from '@lucide/svelte/icons/backpack';
  import Sword from '@lucide/svelte/icons/sword';
  import Shield from '@lucide/svelte/icons/shield';
  import Shuffle from '@lucide/svelte/icons/shuffle';
  import Plus from '@lucide/svelte/icons/plus';
  import Ban from '@lucide/svelte/icons/ban';
  import Check from '@lucide/svelte/icons/check';
  import EllipsisVertical from '@lucide/svelte/icons/ellipsis-vertical';
  import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
  import { edgeFade, stickyFade, scrollToTop } from '@shilo/bronze-ui/svelte';
  import { arrows } from './arrows.js';
  /** @type {{ items?: {id:string,name:string,thumb:string}[], onnotify?: (text:string)=>void }} */
  let { items = [], onnotify } = $props();
  const modes = ['Wardrobe', 'Colors', 'Outfits'];
  let mode = $state('Wardrobe');
  const slots = $derived([
    { id: 'head', label: 'Head', icon: Crown, items },
    { id: 'hair', label: 'Hair', icon: Scissors, items: [] },
    { id: 'face', label: 'Face', icon: Glasses, items: [] },
    { id: 'chest', label: 'Chest', icon: Shirt, items: [] },
    { id: 'feet', label: 'Feet', icon: Footprints, items: [] },
    { id: 'back', label: 'Back', icon: Backpack, items: [] },
    { id: 'main', label: 'Main hand', icon: Sword, items: [] },
    { id: 'off', label: 'Off hand', icon: Shield, items: [] }
  ]);
  /** @type {Record<string,string>} */
  let worn = $state({});
  $effect(() => { if (items[0] && worn.head === undefined) worn.head = items[0].id; });
  let current = $state('head'), list = $state(), spyLocked = false;
  function spy() {
    if (spyLocked || !list) return;
    const top = list.getBoundingClientRect().top + 44;
    let id = slots[0].id;
    for (const section of list.querySelectorAll('section')) if (section.getBoundingClientRect().top <= top) id = section.dataset.slot;
    current = id;
  }
  async function go(id) {
    current = id;
    spyLocked = true;
    try { await scrollToTop(list, list.querySelector(`[data-slot="${id}"]`)); } finally { spyLocked = false; }
    // A scroll that happened while the jump was running is reflected once it settles.
    spy();
  }
  function random(slot) {
    const options = slot.items.filter(i => i.id !== worn[slot.id]);
    if (!options.length) return;
    worn[slot.id] = options[Math.floor(Math.random() * options.length)].id;
  }
</script>

<div class="wardrobe-sample">
  <div class="sample-tabs" role="tablist" aria-label="Sample panels" {@attach arrows({ selector: '[role=tab]' })}>
    {#each modes as m}<button type="button" class="bu-action" data-variant="tab" role="tab" id="sample-tab-{m}" aria-controls="sample-panel" aria-selected={mode === m} tabindex={mode === m ? 0 : -1} onclick={() => mode = m}>{m}</button>{/each}
  </div>
  <div class="sample-body" id="sample-panel" role="tabpanel" aria-labelledby="sample-tab-{mode}">
    {#if mode === 'Wardrobe'}
      <!-- A scrolling region stays keyboard-reachable so its content can be scrolled without a pointer. -->
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div class="sample-list" bind:this={list} onscroll={spy} {@attach stickyFade({ inside: 10, outside: 10 })} role="region" tabindex="0" aria-label="Equipment">
        {#each slots as slot (slot.id)}
          {@const Icon = slot.icon}
          <section data-slot={slot.id} aria-labelledby="sample-head-{slot.id}">
            <div class="bu-section-head" data-current={current === slot.id ? '' : undefined}>
              <Icon aria-hidden="true" /><h3 class="bu-section-title" id="sample-head-{slot.id}">{slot.label}</h3>
              <span class="bu-section-count" aria-label="{slot.items.length} items">{slot.items.length}</span>
              <button type="button" class="bu-action sample-icon" data-variant="quiet" aria-label="Random {slot.label.toLowerCase()} item" title="Random {slot.label.toLowerCase()} item" disabled={slot.items.filter(i => i.id !== worn[slot.id]).length === 0} onclick={() => random(slot)}><Shuffle aria-hidden="true" /></button>
              <button type="button" class="bu-action sample-icon" data-variant="quiet" aria-label="New {slot.label.toLowerCase()} item" title="New {slot.label.toLowerCase()} item" onclick={() => onnotify?.(`New ${slot.label.toLowerCase()} item is a local sample. No request sent.`)}><Plus aria-hidden="true" /></button>
            </div>
            <div class="sample-tiles">
              <button type="button" class="bu-tile" data-variant="empty" aria-pressed={!worn[slot.id]} aria-label="Empty: remove {slot.label.toLowerCase()} item" onclick={() => worn[slot.id] = ''}><span class="bu-tile-art"><Ban aria-hidden="true" /></span><span class="bu-tile-label">Empty</span></button>
              {#each slot.items as item, i (item.id)}<div class="sample-tile"><button type="button" class="bu-tile" aria-pressed={worn[slot.id] === item.id} aria-label="{item.name}{i === 1 ? ', needs a look' : ''}{worn[slot.id] === item.id ? ', worn' : ''}" onclick={() => worn[slot.id] = item.id}><span class="bu-tile-art"><img src={item.thumb} alt="" /></span>{#if worn[slot.id] === item.id}<span class="bu-tile-check"><Check aria-hidden="true" /></span>{/if}<span class="bu-tile-label">{item.name}</span>{#if i === 1}<span class="bu-tile-status" data-tone="warning" title="Needs a look"><TriangleAlert aria-hidden="true" /></span>{/if}</button><button type="button" class="bu-tile-more" aria-haspopup="menu" aria-label="More options for {item.name}" title="Options" onclick={() => onnotify?.(`Options for ${item.name} are a local sample.`)}><EllipsisVertical aria-hidden="true" /></button></div>
              {:else}<button type="button" class="bu-tile" data-variant="add" onclick={() => onnotify?.(`New ${slot.label.toLowerCase()} item is a local sample. No request sent.`)}><span class="bu-tile-art"><Plus aria-hidden="true" /></span><span class="bu-tile-label">New</span></button>{/each}
            </div>
          </section>
        {/each}
        <div class="sample-spacer" aria-hidden="true"></div>
      </div>
      <!-- The rail is navigation over the visible sections, not tabs: a labelled list marking the current section. -->
      <nav class="sample-rail bu-scroll-hidden bu-edge-fade" aria-label="Equipment slots" {@attach edgeFade()}>
        <ul {@attach arrows({ orientation: 'vertical' })}>
          {#each slots as slot (slot.id)}
            {@const Icon = slot.icon}
            <li><button type="button" class="bu-action" data-variant="rail" aria-current={current === slot.id ? 'location' : undefined} tabindex={current === slot.id ? 0 : -1} data-filled={worn[slot.id] ? '' : undefined} aria-label="{slot.label}{worn[slot.id] ? ', equipped' : ''}" onclick={() => go(slot.id)}><Icon aria-hidden="true" /><span class="bu-rail-label">{slot.label}</span><i class="bu-rail-dot"></i></button></li>
          {/each}
        </ul>
      </nav>
    {:else}
      <p class="bu-muted bu-small">{mode} sample panel. Arrow keys move between tabs.</p>
    {/if}
  </div>
</div>

<style>
  .wardrobe-sample { display:flex; flex-direction:column; gap:12px; min-width:0; }
  .sample-tabs { display:flex; justify-content:space-between; }
  .sample-tabs .bu-action { min-height:44px; padding:8px 0; }
  .sample-body { display:flex; gap:12px; height:420px; min-height:0; }
  .sample-list { flex:1; min-width:0; overflow:auto; padding-right:4px; }
  .sample-list section { padding-bottom:16px; }
  .sample-icon { display:grid; place-items:center; width:36px; height:36px; margin:-4px -4px; }
  .sample-icon :global(svg) { width:16px; height:16px; }
  .sample-tiles { display:grid; grid-template-columns:repeat(auto-fill,minmax(88px,1fr)); gap:8px; }
  .sample-tiles .bu-tile { height:104px; }
  .sample-tile { position:relative; display:grid; }
  .sample-tile .bu-tile-more { position:absolute; top:2px; left:2px; width:44px; height:44px; }
  .sample-tile .bu-tile-status { position:absolute; bottom:30px; left:8px; }
  .sample-tiles img { width:52px; height:52px; object-fit:contain; }
  .sample-tiles :global(.bu-tile-art > svg) { width:26px; height:26px; stroke-width:1.5; }
  .sample-spacer { height:calc(100% - 120px); }
  .sample-rail { flex:none; width:64px; overflow-y:auto; }
  .sample-rail ul { display:flex; flex-direction:column; gap:2px; margin:0; padding:0; list-style:none; }
  .sample-rail .bu-action { flex:none; width:100%; min-height:52px; padding:7px 2px 6px; }
  .sample-rail .bu-rail-label { max-width:60px; }
  @media (max-width:600px) { .sample-body { height:360px; } .sample-rail { width:56px; } }
</style>
