<script>
import {ChoiceGroup,Dialog,Help,Field,Notice} from '@shilo/bronze-ui/svelte';
let open=$state(false),target=$state(),value=$state(),submits=$state(0);
</script>
<main tabindex="-1" style="color:#121212;background:#ffffff"><div class="bu-stack" hidden data-testid="hidden-contract">Hidden content</div><input type="file" aria-label="Unrelated host file" /><h1>Consumer contract</h1><svg aria-label="Host artwork" width="64" height="64"><rect width="64" height="64" fill="red" /></svg>
<section data-testid="material-contract">
<label>Unrelated host select <select aria-label="Unrelated host select"><option>Host option</option></select></label>
<label>Shared field select <select class="bu-input" aria-label="Shared field select"><option>Walk</option><option>Cross-punch</option><option disabled>Unavailable</option><optgroup label="Missing frames" disabled><option>Run</option></optgroup></select></label>
<label>Compact select <select class="bu-select" aria-label="Compact select"><option>Walk</option><option>Cross-punch</option><option disabled>Unavailable</option><optgroup label="Missing frames" disabled><option>Run</option></optgroup></select></label>
<details class="bu-details" open><summary>Plain container files</summary><div><code class="bu-code">character.json<br />body/walk.png<br />head/helmet.png</code></div></details>
</section>
<form onsubmit={e=>{e.preventDefault();submits++}}>
<ChoiceGroup label="Unselected choices" options={['One','Two','Three']} bind:value />
<ChoiceGroup label="Empty choices" options={[]} />
<Field label="Sample name">{#snippet children(attrs)}<input {...attrs} class="bu-input" />{/snippet}</Field>
<Help label="Form help" text="A help action must not submit its host form." />
<button type="button" class="bu-btn" onclick={e=>{target=e.currentTarget;open=true}}>Open dialog</button>
<Dialog bind:open title="Form dialog" returnTo={target}><p>Reusable dialog inside a host form.</p></Dialog>
<output aria-label="Form submissions">{submits}</output>
<Notice title="Independent component styles">Base resets are not imported here.</Notice>
</form></main>
