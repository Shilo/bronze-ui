<script>
import {ChoiceGroup,Dialog,Help,Field,Notice} from '@shilo/bronze-ui/svelte';
let busy=$state(false);
let open=$state(false),target=$state(),value=$state(),submits=$state(0);
let surface;
const appearanceVariants = ["primary", "outline", "tile", "field", "row", "direction", "tab"];
</script>
<main tabindex="-1" style="color:#121212;background:#ffffff"><div class="bu-stack" hidden data-testid="hidden-contract">Hidden content</div><input type="file" aria-label="Unrelated host file" /><h1>Consumer contract</h1><svg aria-label="Host artwork" width="64" height="64"><rect width="64" height="64" fill="red" /></svg>
<section data-testid="material-contract">
<label>Unrelated host select <select aria-label="Unrelated host select"><option>Host option</option></select></label>
<label>Shared field select <select class="bu-input" aria-label="Shared field select"><option>Walk</option><option>Cross-punch</option><option disabled>Unavailable</option><optgroup label="Missing frames" disabled><option>Run</option></optgroup></select></label>
<label>Quiet select <select class="bu-select compact-select" data-variant="quiet" aria-label="Quiet select"><option>Walk</option><option>Cross-punch</option><option disabled>Unavailable</option><optgroup label="Missing frames" disabled><option>Run</option></optgroup></select></label>
<label>Compact select <select class="bu-select compact-select" aria-label="Compact select"><option>Walk</option><option>Cross-punch</option><option disabled>Unavailable</option><optgroup label="Missing frames" disabled><option>Run</option></optgroup></select></label>
<details class="bu-details" open><summary>Plain container files</summary><div><code class="bu-code">character.json<br />body/walk.png<br />head/helmet.png</code></div></details>
</section>
<section id="appearance" aria-label="Appearance-only contracts" class="appearance-contract">
<h2>Host-sized appearance recipes</h2>
<div style="color:#121212;background:#fff" data-testid="hostile-foreground">{#each ['outline','tile','field'] as variant}<button type="button" class="bu-action compact-action" data-variant={variant}>Hostile {variant}</button>{/each}</div>
<p>These compact dimensions belong to this fixture, without importing base.css.</p>
{#each appearanceVariants as variant}
<div class="contract-actions" data-testid="variant-{variant}">
<button type="button" class="bu-action compact-action" data-variant={variant}>Normal {variant}</button>
<button type="button" class="bu-action compact-action" data-variant={variant} aria-pressed="true">Pressed {variant}</button>
<button type="button" class="bu-action compact-action" data-variant={variant} disabled>Disabled {variant}</button>
</div>
{/each}
<div class="bu-joined contract-joined" data-stack="small" data-testid="joined-contract"><button type="button" class="bu-action compact-action" data-variant="field">Direction</button><button type="button" class="bu-action compact-action" data-variant="field">Mirror</button></div>
<button type="button" class="bu-swatch-flat contract-swatch" style="--swatch:#428d7a" aria-label="Flat host swatch"></button>
<div class="bu-joined" data-stack="small" data-testid="singleton-contract"><button type="button" class="bu-action compact-action" data-variant="field">Unpaired control</button></div>
<a class="bu-focus" href="#appearance" data-testid="focus-contract">Independent focus recipe</a>
<button type="button" class="bu-action compact-action" data-variant="outline" onclick={() => surface.showModal()}>Opaque review</button>
<dialog class="bu-dialog-surface contract-dialog" bind:this={surface} aria-label="Opaque host dialog"><p>The host owns this dialog's size and padding.</p><button type="button" class="bu-action compact-action" data-variant="outline" onclick={() => surface.close()}>Close review</button></dialog>
</section>
<form onsubmit={e=>{e.preventDefault();submits++}}>
<ChoiceGroup label="Unselected choices" options={['One','Two','Three']} bind:value />
<ChoiceGroup label="Empty choices" options={[]} />
<div style="width:280px;font:18px/1.5 system-ui" data-testid="reset-contract"><Field label="Sample name" error="Enter a name.">{#snippet children(attrs)}<input {...attrs} class="bu-input" />{/snippet}</Field><p class="bu-badge"><svg aria-hidden="true" width="24" height="24"></svg>Badge</p><ol class="bu-steps"><li><svg aria-hidden="true" width="24" height="24"></svg>Step</li></ol></div>
<Help label="Form help" text="A help action must not submit its host form." />
<button type="button" class="bu-btn" onclick={e=>{target=e.currentTarget;open=true}}>Open dialog</button>
<Dialog bind:open {busy} title="Form dialog" returnTo={target}><p>Reusable dialog inside a host form.</p><button type="button" class="bu-btn" onclick={() => busy=!busy}>{busy ? 'Finish sample' : 'Start sample'}</button></Dialog>
<output aria-label="Form submissions">{submits}</output>
<Notice title="Independent component styles">Base resets are not imported here.</Notice>
</form></main>

<style>
.appearance-contract { color:var(--bu-text); background:var(--bu-canvas); padding:16px; font:17px/1.4 system-ui; }
.contract-actions { display:flex; flex-wrap:wrap; gap:12px; margin-block:12px; }
.compact-action { width:160px; height:34px; padding:4px 8px; display:inline-flex; align-items:center; justify-content:center; font-size:17px; line-height:1.2; }
.contract-joined { width:max-content; margin-block:16px; }
.contract-joined .compact-action { width:96px; }
.compact-select { width:132px; height:32px; padding:4px 8px; font:15px/1.2 system-ui; }
.contract-swatch { width:28px; height:28px; border:0; padding:0; }
.contract-dialog { width:260px; padding:12px; }
</style>
