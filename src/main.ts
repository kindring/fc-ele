import {App, createApp} from 'vue'
import './style.css'
import AppPage from './App.vue'
import {windowInit} from "./util/pageHandle.ts";
import {bindIconSvg} from "@/components/public/icon/iconSvg.ts";


const app: App = createApp(AppPage)

windowInit(app);
bindIconSvg(app);

app.mount('#app');
