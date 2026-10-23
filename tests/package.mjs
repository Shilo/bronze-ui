import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile,mkdtemp} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createRequire} from 'node:module';import path from 'node:path';import os from 'node:os';
const root=process.cwd(),npm=process.env.npm_execpath;assert.ok(npm,'Run with npm test');
await mkdir('.evidence',{recursive:true});const run=(args,cwd=root)=>execFileSync(process.execPath,[npm,...args],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']});
const [pack]=JSON.parse(run(['pack','--json','--ignore-scripts','--pack-destination','.evidence']));
assert.ok(pack.files.some(f=>f.path==='LICENSE'));assert.ok(pack.files.some(f=>f.path==='dist/Field.svelte.d.ts'));
assert.ok(pack.files.every(f=>!/(^showcase|^tests|^node_modules|\.env|^site|^docs)/.test(f.path)));
const consumer=await mkdtemp(path.join(os.tmpdir(),'bronze-ui-consumer-'));await writeFile(path.join(consumer,'package.json'),JSON.stringify({name:'bronze-css-consumer',version:'1.0.0',private:true}));
run(['install','--ignore-scripts','--package-lock=false','--no-audit','--no-fund',path.join(root,'.evidence',pack.filename)],consumer);
const require=createRequire(path.join(consumer,'package.json'));for(const name of ['tokens.css','components.css','base.css','style.css'])assert.ok(require.resolve('@shilo/bronze-ui/'+name));
const installed=JSON.parse(await readFile(require.resolve('@shilo/bronze-ui/package.json'),'utf8'));assert.equal(installed.version,JSON.parse(await readFile('package.json','utf8')).version);assert.equal(installed.license,'MIT');assert.equal(installed.dependencies,undefined);assert.ok(installed.peerDependenciesMeta.svelte.optional);
for(const name of ['ChoiceGroup','Dialog','Help']){const code=await readFile(path.join(root,'dist',name+'.svelte'),'utf8');assert.ok(!/<button(?![^>]*type="button")[^>]*>/.test(code),name+' form-safe buttons');}
const css=await readFile('styles/components.css','utf8');assert.ok(!/^body\s*\{|^svg\s*\{|^h1[,\s{]/m.test(css),'No document resets in component entry');
console.log('Package archive and clean CSS-only consumer passed: '+pack.size+' bytes, '+pack.files.length+' files.');

// Compile a genuine isolated tarball consumer with both explicitly installed Svelte peers.
run(['install','--ignore-scripts','--no-audit','--no-fund','svelte@5.57.2','@lucide/svelte@1.61.0','vite@8.3.4','@sveltejs/vite-plugin-svelte@7.3.1','svelte-check@4.7.7','typescript@6.0.3'],consumer);
const cp=JSON.parse(await readFile(path.join(consumer,'package.json'),'utf8'));cp.type='module';await writeFile(path.join(consumer,'package.json'),JSON.stringify(cp));
await writeFile(path.join(consumer,'tsconfig.json'),JSON.stringify({compilerOptions:{strict:true,target:'ES2023',module:'ESNext',moduleResolution:'bundler',noEmit:true,skipLibCheck:true},include:['*.svelte','*.ts']}));
await writeFile(path.join(consumer,'App.svelte'),`<script lang="ts">import {ChoiceGroup,Field,Help,Notice,Dialog} from '@shilo/bronze-ui/svelte';let value=$state<string>();let open=$state(false);</script><ChoiceGroup label="Choices" options={['One','Two']} bind:value/><Field label="Name">{#snippet children(attrs)}<input {...attrs}/>{/snippet}</Field><Help label="Help" text="Details"/><Notice title="Ready"/><Dialog bind:open title="Review"><p>Review</p></Dialog>`);
await writeFile(path.join(consumer,'main.ts'),"import {mount} from 'svelte';import App from './App.svelte';import '@shilo/bronze-ui/style.css';mount(App,{target:document.body});");
await writeFile(path.join(consumer,'index.html'),'<script type="module" src="/main.ts"></script>');
await writeFile(path.join(consumer,'vite.config.mjs'),"import {svelte} from '@sveltejs/vite-plugin-svelte';export default {plugins:[svelte({configFile:false})]};");
run(['exec','--','svelte-check','--tsconfig','./tsconfig.json'],consumer);run(['exec','--','vite','build'],consumer);
console.log('Isolated packed Svelte + strict TypeScript consumer compiled successfully.');
