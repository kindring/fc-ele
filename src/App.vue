<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'

import {onMounted, ref} from "vue";
import MacWindow from "./components/window/macWindow.vue";
import MagnetView from "./components/magnets/magnetView.vue";
import AppleBar from "@/components/appleBar/appleBar.vue";
import BarIconBtn from "@/components/appleBar/barIconBtn.vue";
import SettingView from "@/components/settingView.vue";
import {NavItem} from "@/components/appleBar/appleBar.ts";

onMounted(() => {

});

let transitionName = ref("slide-right");
const settingPageKey = 'setting';
const activeIndex = ref(0);
const homePageKey = 'home';
let navItems:NavItem[] = [

  {
    id: 1,
    name: '首页',
    actionCode: homePageKey,
    description: '返回首页',
    icon: 'home',
  },
  {
    id: 2,
    name: '设置',
    actionCode: settingPageKey,
    description: '软件设置',
    icon: 'setting',
  },
]


const title = ref("fc-ele");
const pageKey = ref(homePageKey);
const editMode = ref(false);
function editModeChange() {
  editMode.value = !editMode.value;
}

const navAction = (actionCode:string) => {
  if(editMode){
    return console.log('is edit mode')
  }
  console.log(`action: ${actionCode}`);
  // 寻找actionCode对应的 index
  let index = navItems.findIndex((item) => item.actionCode === actionCode);
  if (index === -1) {
    return console.warn(`找不到actionCode: ${actionCode}`);
  }
  // 更改动画
  if (index < activeIndex.value) {
    transitionName.value = 'slide-left';
  }else{
    transitionName.value = 'slide-right';
  }
  activeIndex.value = index;
  pageKey.value = navItems[index].actionCode;
  switch (actionCode) {
    case settingPageKey:
      title.value = navItems[index].name;
      break;
    default:
      pageKey.value = homePageKey;
      title.value = 'fc-ele';
      break;
  }
  console.log(`pageKey: ${pageKey.value}`);
}

</script>

<template>
  <mac-window :title="title" :icon="'home'">

    <div class="image-bg">
      <img src="./assets/images/bg.jpg" alt="">
    </div>
    <Transition :name="transitionName">
      <div class="full" v-if="pageKey === homePageKey">
        <div class="app-content">
          <magnet-view
              :edit-mode="editMode"
              @edit-mode-change="editModeChange"
          />
        </div>
      </div>
      <setting-view v-else-if="pageKey === settingPageKey"></setting-view>
    </Transition>

    <div class="app-bar">
      <apple-bar
          :nav-items="navItems"
          :active="pageKey"
          :hide-time="3000"
          @action="navAction"
      >
        <bar-icon-btn
            icon-name="edit"
            :active="editMode"
            @click.native="editModeChange"
        >
        </bar-icon-btn>
      </apple-bar>
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
