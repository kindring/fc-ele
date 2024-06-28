<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, onMounted, Ref, ref, UnwrapRef} from "vue";
import { IpcAction, windowAction} from "../../tools/IpcCmd.ts";

import "@/assets/base.css"

const { proxy } = getCurrentInstance() as ComponentInternalInstance
defineProps<{
  title: string,
  icon: string,
}>()
const isDing: Ref<UnwrapRef<boolean>> = ref(false)
const isFull: Ref<UnwrapRef<boolean>> = ref(false)

// 定义函数
const switchDingHandle = () => {
  console.log("置顶切换")
  proxy?.$winHandle(isDing.value? windowAction.unDing : windowAction.ding)
  isDing.value = !isDing.value
}
const switchFullHandle = () => {
  console.log("全屏切换")
  proxy?.$winHandle(isFull.value? windowAction.unMax : windowAction.max)
  isFull.value = !isFull.value

}

// 给body挂载大小属性


const btnClickHandel = (action: IpcAction) => {
  proxy?.$winHandle(action)
}

const mainWindow = ref<HTMLDivElement >()
const dragBar = ref<HTMLDivElement >()
onMounted(()=>{
  const el = mainWindow.value as HTMLElement
  const drag = dragBar.value as HTMLElement
  if(!el || !drag){
    console.log("窗口dom未找到")
    return
  }
  el.addEventListener('mouseenter', () => {
    console.log("鼠标进入窗口")
    proxy?.$winHandle(windowAction.disableIgnoreMouse);
  });
  el.addEventListener('mouseleave', (evt: MouseEvent) => {
    // 判断触发的dom
    // tips 判断鼠标是否真的移出了指定的dom窗口, 在内部有元素设置了drag属性的情况下, 鼠标会被视作离开窗口
    // 1. 获取元素的区域位置,
    let { left, top, width, height } = el.getBoundingClientRect();

    if (evt.pageX < left || evt.pageX > left + width || evt.pageY < top || evt.pageY > top + height) {
      console.log("鼠标离开窗口")
      proxy?.$winHandle(windowAction.enableIgnoreMouse);
    }
  });
})


</script>

<template>
  <div :class="[isFull? 'max_window': 'min_window']" ref="mainWindow">
    <div class="window">
      <div class="top-bar">
        <div class="drag top-title" ref="dragBar">
          <slot name="top">
            <icon-svg  :icon-name="icon"/>
            <span class="ml-1.5 ">{{title}}</span>
          </slot>

        </div>

        <div class="control-box">
          <slot name="top"></slot>
          <div id="win-btn-ding" :class="`no-drag showTopTip btn ding ${isDing?'ding-is':''}`"  @click="switchDingHandle">
            <span class="showTip">{{isDing?"取消置顶":"置顶"}}</span>
          </div>
          <div id="win-btn-min"  class="no-drag showTopTip btn min" @click="btnClickHandel(windowAction.min)">
            <span class="showTip">最小化</span>
          </div>
          <div id="win-btn-full"  :class="`no-drag showTopTip btn full ${isFull?'full-is':''}`"  @click="switchFullHandle">
            <span class="showTip">{{isFull?'取消全屏':'全屏'}}</span>
          </div>
          <div id="win-btn-close"  class="no-drag showTopTip btn close"  @click="btnClickHandel(windowAction.close)">
            <span class="showTip">关闭窗口</span>
          </div>
        </div>
      </div>
      <div class="window-content" id="kui-dialog">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
body{
  margin: 0;
  padding: 5px;
  position: relative;
  width: 100vw;
  height: 100vh;
}
.min_window{
  width: calc( 100% - 10px);
  height:  calc( 100% - 10px);
  box-sizing: border-box;
  border: 1px solid transparent;
}

#headlessui-portal-root{
  position: absolute;
  top: 35px;
  left: 0;
  width: calc(100% - 10px);
  height: calc(100% - 35px);
}
.max_window{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.window{
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 3px #000;
  position: relative;
  overflow: hidden;
}


</style>
