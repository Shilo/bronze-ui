<script>
  import { edgeFade, stickyFade } from '@shilo/bronze-ui/svelte';
  let horizontal = $state('One'), filled = $state('Left'), vertical = $state('A'), pressed = $state(0), moreOpen = $state(false);
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
</script>

<section aria-label="Navigation contracts" class="nav-contract">
  <div role="tablist" aria-label="Horizontal contract tabs" class="nav-row">
    {#each ['One', 'Two', 'Three'] as t}<button type="button" class="bu-action" data-variant="tab" role="tab" aria-selected={horizontal === t} tabindex={horizontal === t ? 0 : -1} onclick={() => horizontal = t}>{t}</button>{/each}
    <button type="button" class="bu-action" data-variant="tab" role="tab" aria-selected="false" tabindex="-1" disabled>Off</button>
  </div>
  <div role="tablist" aria-label="Filled contract tabs" class="nav-row nav-fill">
    {#each ['Left', 'Middle', 'Right'] as t}<button type="button" class="bu-action" data-variant="tab" role="tab" aria-selected={filled === t} tabindex={filled === t ? 0 : -1} onclick={() => filled = t}><span class="bu-tab-label">{t}</span></button>{/each}
  </div>
  <nav aria-label="Vertical contract rail" class="nav-rail bu-scroll-hidden bu-edge-fade" data-testid="rail-contract" {@attach edgeFade()}>
    <ul>{#each rows as r}<li><button type="button" class="bu-action" data-variant="rail" aria-current={vertical === r ? 'location' : undefined} data-filled={r === 'B' ? '' : undefined} aria-label="Rail {r}" onclick={() => vertical = r}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" /></svg><span class="bu-rail-label">Rail {r}</span><i class="bu-rail-dot"></i></button></li>{/each}</ul>
  </nav>
  <div class="nav-tiles" data-testid="tile-contract">
    <button type="button" class="bu-tile" data-variant="empty" aria-pressed="false">Empty</button>
    <button type="button" class="bu-tile" aria-pressed="true"><span class="bu-tile-art"></span><span class="bu-tile-check"><svg viewBox="0 0 24 24" aria-hidden="true"></svg></span><span class="bu-tile-label">Selected tile</span></button>
    <button type="button" class="bu-tile" aria-pressed="false"><span class="bu-tile-art"></span><span class="bu-tile-label">Normal tile</span></button>
    <button type="button" class="bu-tile" data-selected aria-pressed="false"><span class="bu-tile-art"></span><span class="bu-tile-label">Viewed tile</span></button>
    <button type="button" class="bu-tile" data-variant="add" onclick={() => pressed++}><span class="bu-tile-label">New</span></button>
    <output data-testid="tile-presses">{pressed}</output>
  </div>
  <div class="nav-tiles" data-testid="tile-status-contract">
    <div class="nav-tile-wrap"><button type="button" class="bu-tile" aria-pressed="false" aria-label="Look tile, needs a look"><span class="bu-tile-art"></span><span class="bu-tile-label">Look tile</span><span class="bu-tile-status" data-tone="warning"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 21h20z" fill="none" stroke="currentColor" /></svg></span></button><button type="button" class="bu-tile-more" aria-haspopup="menu" aria-expanded={moreOpen} aria-label="More options for Look tile" onclick={() => moreOpen = !moreOpen}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="19" r="1.5" fill="currentColor" /></svg></button></div>
    <div class="nav-tile-wrap"><button type="button" class="bu-tile" data-dim aria-pressed="false" aria-label="Dim tile, hidden by another item"><span class="bu-tile-art"></span><span class="bu-tile-label">Dim tile</span><span class="bu-tile-status" data-tone="hidden"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 2 20 20" stroke="currentColor" /></svg></span></button></div>
  </div>
  <div class="nav-list" data-testid="sticky-contract" {@attach stickyFade({ inside: 10, outside: 10 })}>
    {#each ['First', 'Second'] as s}<section><div class="bu-section-head" data-current={s === 'First' ? '' : undefined}><h3 class="bu-section-title">{s}</h3><span class="bu-section-count">3</span><button type="button" class="bu-action" aria-label="Add to {s}">+</button></div><div class="nav-block" data-testid="block-{s}"></div></section>{/each}
    <div style="height:400px"></div>
  </div>
</section>

<style>
  .nav-contract { display:grid; gap:16px; padding:16px; color:var(--bu-text); background:var(--bu-canvas); font:16px/1.4 system-ui; }
  .nav-row { display:flex; gap:16px; }
  .nav-row .bu-action { min-height:44px; padding:8px 0; }
  .nav-fill { gap:0; width:360px; }
  .nav-fill .bu-action { flex:1; justify-content:center; padding:0; }
  .nav-rail { width:64px; height:160px; overflow-y:auto; }
  .nav-rail ul { display:flex; flex-direction:column; gap:2px; margin:0; padding:0; list-style:none; }
  .nav-rail .bu-action { flex:none; width:100%; min-height:52px; padding:6px 2px; }
  .nav-tile-wrap { position:relative; }
  .nav-tile-wrap .bu-tile { width:96px; height:96px; }
  .nav-tile-wrap .bu-tile-more { position:absolute; top:2px; left:2px; width:40px; height:40px; }
  .nav-tile-wrap .bu-tile-status { position:absolute; bottom:30px; left:8px; }
  .nav-tiles { display:flex; gap:8px; }
  .nav-tiles .bu-tile { width:96px; height:96px; }
  .nav-list { height:240px; overflow:auto; width:280px; }
  .nav-block { height:200px; background:var(--bu-accent); }
</style>
