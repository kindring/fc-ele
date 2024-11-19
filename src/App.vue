<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'

import {
  ComponentInternalInstance,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import MacWindow from "./components/window/macWindow.vue";
import MagnetView from "./components/magnets/magnetView.vue";
import AppleBar from "@/components/appleBar/appleBar.vue";
import BarIconBtn from "@/components/appleBar/barIconBtn.vue";
import SettingView from "@/components/settingView.vue";
import {NavItem} from "@/components/appleBar/appleBar.ts";
import message from "@/components/public/kui/message";
import ImageControl from "@/components/image/imageControl.vue";
import {ApplicationInfo} from "@/types/application.ts";
import AppList from "@/components/window/app-list.vue";
import AppWindow from "@/components/window/app-window.vue";
import {windowAction} from "@/tools/IpcCmd.ts";
import {Applications, openApp, runNavComputed, runningApplications} from "@/util/AppManag.ts";

const { proxy } = getCurrentInstance() as ComponentInternalInstance
onMounted(() => {

});

let transitionName = ref("slide-right");
const activeIndex = ref(0);
const settingPageKey = 'setting';
const homePageKey = 'home';
const imagePageKey = 'image';
const musicPageKey = 'music';



// 根据runningApplications 动态获取导航项




const title = ref("fc-ele");
const pageKey = ref(homePageKey);
const editMode = ref(false);
const isFull = ref(false);
const isDing = ref(false);
const isBarHidden = ref(false);

const AppContent = ref<HTMLElement | null>(null);
const parentWidth = ref(0);
const parentHeight = ref(0);

function getParentSize() {
  nextTick(()=>{

    const el = AppContent.value;
    if(!el){
      return console.error('windowRef is null !!!!!!!!!! ');
    }
    let parent = el.parentElement;
    if(!parent)
    {
      parent = document.body;
    }
    parentWidth.value = parent.clientWidth;
    parentHeight.value = parent.clientHeight;
    message.log(`parentWidth: ${parentWidth.value} H: ${parentHeight.value}`);
  })

}
onMounted(() => {
  getParentSize();
  // document.addEventListener('resize', getParentSize);
})

const dingHandle = () => {
  proxy?.$winHandle(isDing.value? windowAction.unDing : windowAction.ding)
  isDing.value = !isDing.value
}
const minHandle = () => {
  proxy?.$winHandle(windowAction.min)
}
const maxHandle = async () => {

  let res = await proxy?.$winHandle(isFull.value? windowAction.unMax : windowAction.max)
  if(res){
    message.log('maxHandle success');
  }else{
    message.log('maxHandle fail');
  }
  isFull.value = !isFull.value
  // todo 添加事件监听对应的事件

  setTimeout(()=>{
    getParentSize()
  })
}
const closeHandle = () => {
  proxy?.$winHandle(windowAction.close)
}
function editModeChange() {
  editMode.value = !editMode.value;
  if(!editMode.value){
    // 重新加载磁贴数据
  }
}

const navAction = (actionCode:string) => {
  if(editMode.value){
    return console.log('is edit mode')
  }
  message.info(`navAction: ${actionCode}`);
  // 寻找actionCode对应的 index
  let index = navItems.findIndex((item) => item.actionCode === actionCode);
  if (index === -1) {
    return console.warn(`找不到actionCode: ${actionCode}`);
  }
  // 更改动画
  // message.log(`pageKey: ${pageKey.value}`);
}


// 打开应用中心
const isOpenApplicationCenter = ref(false);
function openApplicationCenter() {
  message.log('打开应用中心');
  if(isOpenApplicationCenter.value){
    return closeApplicationCenter();
  }
  isOpenApplicationCenter.value = true;
  // 设置全局监听事件, 不是当前dom则关闭
}
function closeApplicationCenter() {
  message.log('关闭应用中心');
  isOpenApplicationCenter.value = false;
}

function closeAppHandle(){
  console.log('close app');
}

function openApplication(key: string)
{
  message.log(`open app ${key}`);
  console.log(runNavComputed);
  console.log(runningApplications);
  openApp(key);

}
</script>

<template>
  <mac-window
      :title="title"
      :icon="'home'"
      :is-ding="isDing"
      :is-full="isFull"
      @close="closeHandle"
      @min="minHandle"
      @max="maxHandle"
      @ding="dingHandle"
  >

    <div class="image-bg">
      <img src="./assets/images/bg.jpg" alt="">
    </div>

    <div class="full" id="kui-root" ref="AppContent">
      <Transition :name="transitionName">
        <div class="full" v-if="pageKey === homePageKey">
          <div class="app-content">
            <magnet-view
                :edit-mode="editMode"
                @edit-mode-change="editModeChange"
            />
            <app-window
                :min-height="480"
                :min-width="640"
                :parent-width="parentWidth"
                :parent-height="parentHeight"
                @close="closeAppHandle"
            >
              app
            </app-window>
          </div>
        </div>


        <image-control v-else-if="pageKey === imagePageKey"></image-control>
        <setting-view v-else-if="pageKey === settingPageKey"></setting-view>
      </Transition>
    </div>

    <div :class="`app-bar ${isBarHidden?'app-bar-hidden':''}`">
      <apple-bar
          :nav-items="runNavComputed"
          :active="pageKey"
          :hide-time="3000"
          :prevent-hide="isOpenApplicationCenter"
          @input="(isHidden) => {isBarHidden = isHidden}"
          @action="navAction"
      >
        <template #left>
          <bar-icon-btn
              icon-name="window"
              :active="editMode"
              @click.native="openApplicationCenter"
          >
          </bar-icon-btn>
        </template>

        <bar-icon-btn
            v-if="pageKey === homePageKey"
            icon-name="edit"
            :active="editMode"
            @click.native="editModeChange"
        >
        </bar-icon-btn>
      </apple-bar>
    </div>

    <div class="event-mask"
         v-if="isOpenApplicationCenter"
         @click="closeApplicationCenter">
    </div>
    <div class="start-window" v-show="isOpenApplicationCenter">
      <app-list
          :app-list="Applications"
          @open="openApplication"
      ></app-list>
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
.app-bar-hidden{
  width: auto;
  height: 30px;
  left: 50%;
  transform: translate(-50%, 0);
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

.start-window{
  width: 70%;
  height: 70%;
  position: absolute;
  bottom: 80px;
  left: 5%;
}
.start-window::before{
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--color-background-mute);
  border-radius: 3px;
  box-shadow: 0 0 3px #000;
  opacity: 0.9;
}

</style>
