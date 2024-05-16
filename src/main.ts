import {App, createApp} from 'vue'
import './style.css'
import AppPage from './App.vue'
import {windowInit} from "./util/pageHandle.ts";


const app: App = createApp(AppPage)

windowInit(app);

app.mount('#app');
