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
import message from "@/components/public/kui/message";
import {ApplicationInfo, RunApplicationInfo} from "@/types/application.ts";
import AppList from "@/components/window/app-list.vue";
import AppWindow from "@/components/window/app-window.vue";
import {windowAction} from "@/tools/IpcCmd.ts";
import {
  Applications,
  closeApp,
  getAppComponent,
  setAppComponent,
  openApp,
  runNavComputed,
  runningApplications,
  setAppTop, AppListNames, getAppMinSize,
} from "@/util/AppManag.ts";

import musicIndex from "@/components/music/musicIndex.vue"


const { proxy } = getCurrentInstance() as ComponentInternalInstance
onMounted(() => {

});

let transitionName = ref("slide-right");



// 根据runningApplications 动态获取导航项


const title = ref("fc-ele");
const editMode = ref(false);
const isFull = ref(false);
const isDing = ref(false);
const isBarHidden = ref(false);

const AppContent = ref<HTMLElement | null>(null);
const parentWidth = ref(0);
const parentHeight = ref(0);
const appWindowBorderW = 30;
const appWindowBorderH = 40;

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
  setAppComponent(AppListNames.musicIndex, musicIndex);

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
  let runningApp: RunApplicationInfo | undefined = runningApplications.find(item=>item.id === actionCode);
  if(!runningApp)
  {
    return message.error(`${actionCode} is not exist`);
  }
  runningApp.show = true;
  setAppTop(runningApp);

  // top
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

function minAppHandle(runApplication: RunApplicationInfo)
{
  runApplication.show = false;
}

function closeAppHandle(runApplication: RunApplicationInfo){
  console.log('close app');
  closeApp(runApplication);
}

function focusAppHandle(runApplication: RunApplicationInfo){
  setAppTop(runApplication);
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
        <div class="full">
          <div class="app-content">
            <magnet-view
                :edit-mode="editMode"
                @edit-mode-change="editModeChange"
            />

            <app-window
                v-for="item in runningApplications"
                :key="item.id"
                :min-height="getAppMinSize(item, 'height', parentHeight - appWindowBorderH)"
                :min-width="getAppMinSize(item, 'width', parentWidth - appWindowBorderW)"
                :parent-width="parentWidth"
                :parent-height="parentHeight"
                :app-name="item.showTitle"
                :hidden="!item.show"
                :index="item.index"
                :app-window-id="item.id"
                @min="minAppHandle(item)"
                @close="closeAppHandle(item)"
                @focus-window="focusAppHandle(item)"
            >
<!--              切换对应组件, 并且-->
              <component
                  :is="getAppComponent(item.key)"
                  :windowId="item.id"
              >
              </component>
            </app-window>
          </div>
        </div>
      </Transition>
    </div>

    <div :class="`app-bar ${isBarHidden?'app-bar-hidden':''}`">
      <apple-bar
          :nav-items="runNavComputed"
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
