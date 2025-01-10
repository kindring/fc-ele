import {App, createApp} from 'vue'
import './style.css'
import AppPage from './App.vue'
import {windowInit} from "./util/pageHandle.ts";
import {bindIconSvg} from "@/components/public/icon/iconSvg.ts";
import magnetInfos from "@/components/magnets/magnetInfo.ts";
import TimeMagnet from "@/components/magnets/timeMagnet.vue";
import tooltipe_directive from "@/components/public/tooltipe_directive.ts";

import kuiMessage from "@/components/public/kui/message"


const app: App = createApp(AppPage)

windowInit(app, "main");
bindIconSvg(app);

kuiMessage.install(app);
app.use(tooltipe_directive);
app.mount('#app');
app.component(magnetInfos.timeMagnetInfo.type, TimeMagnet);


