<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'

import {onMounted, ref} from "vue";
import MacWindow from "./components/window/macWindow.vue";
import MagnetView from "./components/magnetView.vue";
import AppleBar from "@/components/appleBar/appleBar.vue";
import {NavItem} from "@/components/appleBar/appleBar.ts";

onMounted(() => {

});

let navItems:NavItem[] = [
  {
    id: 1,
    name: '首页',
    actionCode: 'toHome',
    description: '返回首页',
    icon: 'system',
  },
  {
    id: 1,
    name: '首页',
    actionCode: 'toHome',
    description: '返回首页',
    icon: 'home',
  },
  {
    id: 1,
    name: '首页',
    actionCode: 'toHome',
    description: '返回首页',
    icon: 'setting',
  },
]

const title = ref("fc-ele");

const navAction = (actionCode:string) => {
  console.log(`action: ${actionCode}`);
}
</script>

<template>
  <mac-window :title="title" :icon="'home'">
    <div class="image-bg">
      <img src="./assets/images/bg.jpg" alt="">
    </div>
    <div class="app-bar">
      <apple-bar
          :nav-items="navItems"
          :hide-time="3000"
          @action="navAction"
      ></apple-bar>
    </div>
    <div class="app-content">
      <magnet-view/>
    </div>

  </mac-window>
</template>

<style scoped>

.app-content {
  width: 100%;
  height: 100%;
  background-color: var(--color-background-soft);
  overflow: auto;
}
.app-bar{
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1000;
}

@media screen and (max-width: 768px) {
  .app-content {
    height: calc(100% - 50px);
  }
  .app-bar {
    position: relative;
    bottom: 0;
  }
}

</style>
