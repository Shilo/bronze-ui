import {defineConfig} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
export default defineConfig({root:'showcase',base:'/bronze-ui/',plugins:[svelte({configFile:false})],build:{outDir:'../site',emptyOutDir:true,rollupOptions:{input:['showcase/index.html','showcase/contract.html']}},server:{host:'127.0.0.1',fs:{allow:['.']}}});
