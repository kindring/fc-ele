<script setup lang="ts">
import {ComponentInternalInstance, getCurrentInstance, Ref, ref, UnwrapRef} from "vue";
import {actionMap, IpcAction, windowAction} from "../../tools/IpcCmd.ts";

import "@/assets/base.css"

const { proxy } = getCurrentInstance() as ComponentInternalInstance
defineProps<{
  title: string,
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
const btnClickHandel = (action: IpcAction) => {
  proxy?.$winHandle(action)
}
</script>

<template>
  <div class="window">
    <div class="top-bar">
      <div class="drag flex items-center" >
<!--        <svg-icon :icon-class="icon"/>-->
        <span class="ml-1.5 ">{{title}}</span>

      </div>

      <div class="control-box">
        <slot name="top"></slot>
        <div :class="`no-drag btn ding ${isDing?'ding-is':''}`"  @click="switchDingHandle">
          <span class="showTip">{{isDing?"取消置顶":"置顶"}}</span>
        </div>
        <div class="no-drag btn min" @click="btnClickHandel(windowAction.min)">
          <span class="showTip">最小化</span>
        </div>
        <div :class="`no-drag btn full ${isFull?'full-is':''}`"  @click="switchFullHandle">
          <span class="showTip">{{isFull?'取消全屏':'全屏'}}</span>
        </div>
        <div class="no-drag btn close"  @click="btnClickHandel(windowAction.close)">
          <span class="showTip">关闭窗口</span>
        </div>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
