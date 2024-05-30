<script setup lang="ts">
import { shallowRef} from "vue";
import TimeMagnet from "@/components/magnets/timeMagnet.vue";
import vueDrag from "@/components/public/vueDrag.vue";
import {Magnet, MagnetEmit, MagnetSize} from "@/types/magnetType.ts";
import {computeMagnetStyle, initTimeMagnetInfo} from "@/components/magnets/magnetInfo.ts";

import {Calendar} from "@/util/time.ts";

const timeMagnetInfo = initTimeMagnetInfo(TimeMagnet)

interface vueMagnet extends Magnet{
  component: any
}
const magnetItemInfos: vueMagnet[] = [
  {
    id: `1`,
    type: timeMagnetInfo.type,
    x: 0,
    y: 0,
    width: timeMagnetInfo.sizes.medium?.width??0,
    height: timeMagnetInfo.sizes.medium?.height??0,
    size: MagnetSize.medium,
    editMode: false,
    selected: false,
    component: timeMagnetInfo.component
  },
  {
    id: `233`,
    type: timeMagnetInfo.type,
    x: 7,
    y: 10,
    width: timeMagnetInfo.sizes.small?.width??0,
    height: timeMagnetInfo.sizes.small?.height??0,
    size: MagnetSize.small,
    editMode: false,
    selected: false,
    component: timeMagnetInfo.component
  }
];

const magnetItems = shallowRef(magnetItemInfos)

function daySelect(calendar: Calendar){
  console.log(`选择日期 ${calendar.year}年 ${calendar.month}月 ${calendar.day}日`)
}
function eventHandler(magnetEmit: MagnetEmit<any>){
  // 事件处理
  switch (magnetEmit.event){
    case timeMagnetInfo.event:
      daySelect(magnetEmit.data)
    break;
    default:
      console.log('no match event')
      console.log(magnetEmit)
    break;
  }
}

defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})



</script>

<template>
  <!-- 磁帖 布局组件, -->
  <div class="magnet scroll">
    <!--    磁贴组件布局 -->

    <vue-drag class="magnet-item"
       v-for="magnet in magnetItems"
       :key="magnet.id"
       :style="computeMagnetStyle(magnet)"
       :open-drag="editMode"
    >
      <component
          v-show="!editMode"
          :is="magnet.component"
          :size="magnet.size"
          @magnet="eventHandler"
      ></component>
    </vue-drag>
  </div>
</template>

<style scoped>
.magnet {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow-y: auto;
}



.magnet-item {
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 1px 2px #ccc;
  overflow: hidden;
}

.magnet-item > * {
  position: relative;
}

.magnet-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.5;
}

</style>
