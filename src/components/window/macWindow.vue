<script setup lang="ts">

import "@/assets/base.css"

defineProps({
  title: {
    type: String,
    default: "标题"
  },
  icon: {
    type: String,
    default: "icon-app"
  },
  isDing: {
    type: Boolean,
    default: false
  },
  isFull: {
    type: Boolean,
    default: false
  },
  dingShow: {
    type: Boolean,
    default: true
  },
  maxShow: {
    type: Boolean,
    default: true
  },
  // 取消外边距
  disableMargin: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'ding'): void,
  (e: 'min'): void,
  (e: 'max'): void,
  (e: 'close'): void,
}>()

// 定义函数
const switchDingHandle = () => {
  console.log("置顶切换")
  emits('ding')
}
const switchFullHandle = () => {
  console.log("全屏切换")
  emits('max')
}

const minimizeHandle = () => {
  console.log("最小化")
  emits('min')
  // proxy?.$winHandle(windowAction.min)
}

const closeHandle = () => {
  console.log("关闭")
  emits('close')
}
// 给body挂载大小属性




</script>

<template>
  <div :class="[isFull || disableMargin? 'max_window': 'min_window']" ref="mainWindow">
    <div class="window" >
      <div class="top-bar">
        <slot name="top">
          <div class="drag top-title" >
              <icon-svg  :icon-name="icon"/>
              <span class="ml-1.5 ">{{title}}</span>
          </div>
        </slot>

        <div class="control-box">
          <div id="win-btn-ding"
               v-if="dingShow"
               :class="`no-drag showTopTip btn ding ${isDing?'ding-is':''}`"
               @click="switchDingHandle">
            <span class="showTip">{{isDing?"取消置顶":"置顶"}}</span>
          </div>
          <div id="win-btn-min"  class="no-drag showTopTip btn min" @click="minimizeHandle">
            <span class="showTip">最小化</span>
          </div>
          <div id="win-btn-full"
               v-if="maxShow"
               :class="`no-drag showTopTip btn full ${isFull?'full-is':''}`"
               @click="switchFullHandle">
            <span class="showTip">{{isFull?'还原':'最大化'}}</span>
          </div>
          <div id="win-btn-close"  class="no-drag showTopTip btn close"  @click="closeHandle">
            <span class="showTip">关闭窗口</span>
          </div>
        </div>
      </div>
      <div class="window-content" >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>

.min_window{
  width: calc( 100% - 10px);
  height:  calc( 100% - 10px);
  box-sizing: border-box;
  border: 1px solid transparent;
  margin-left: 5px;
  margin-top: 5px;
}


.max_window{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
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
