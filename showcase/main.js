import { mount } from 'svelte';
import App from './App.svelte';
import '@shilo/bronze-ui/style.css';
import './showcase.css';
mount(App,{target:document.getElementById('app')});
