<script setup lang="ts">
import {ref, shallowRef} from "vue";
import TimeMagnet from "@/components/magnets/timeMagnet.vue";
import vueDrag, {MoveInfo} from "@/components/public/vueDrag.vue";
import {Magnet, MagnetEmit, MagnetSize} from "@/types/magnetType.ts";
import {computeMagnetStyle, comXY, initTimeMagnetInfo} from "@/components/magnets/magnetInfo.ts";

import {Calendar} from "@/util/time.ts";
import {CollisionResult, detectCollisionDirection, Rect} from "@/util/domDrag.ts";

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
  },
  {
    id: `2323`,
    type: timeMagnetInfo.type,
    x: 5,
    y: 20,
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

// 转换为坐标值

const moveTipStyle = ref()

function moveHandle(magnet: vueMagnet, moveInfo: MoveInfo){
  // 计算新位置相对于多少值
  let {x, y} = comXY(moveInfo.left, moveInfo.top)
  let magnetInfo: vueMagnet = {
    ...magnet,
    x: x,
    y: y
  }
  let moveStyle = computeMagnetStyle(magnetInfo)
  moveTipStyle.value = {
    ...moveStyle,
    opacity: `1`
  }
  // 判断当前元素是否占用到对应元素
  // 移动占位元素
  // console.log(magnetInfo)
  comMagnets(magnetInfo)
}

// 计算其他元素的位置
function comMagnets(changeMagnet: vueMagnet){
  let changeMagnetRect: Rect = {
    ...changeMagnet
  }
  // 挤开当前元素所在位置
  for (let i = 0; i < magnetItems.value.length; i++)
  {
    let magnet = magnetItems.value[i]
    if(magnet.id === changeMagnet.id) continue
    // 判断当前元素是否被其他元素占用了
    // 转换为 rect
    let magnetRect: Rect  = {
      ...magnet
    }
    let collisionResult: CollisionResult = detectCollisionDirection(changeMagnetRect, magnetRect)
    if(collisionResult.colliding)
    {
      console.log(`改位置已经有元素 方向${collisionResult.direction}`);
      // console.log(magnet)
    }
  }
}

function moveEndHandle(magnet: vueMagnet, moveInfo: MoveInfo)
{
  console.log(magnet, moveInfo)
  moveTipStyle.value = {
    opacity: `0`
  }
}

</script>

<template>
  <!-- 磁帖 布局组件, -->
  <div class="magnet scroll">
    <!--    磁贴组件布局 -->
    <div class="magnet-move"
         v-show="editMode"
         :style="moveTipStyle"
    ></div>
    <vue-drag class="magnet-item"
       v-for="magnet in magnetItems"
       :key="magnet.id"
       :style="computeMagnetStyle(magnet)"
       :open-drag="editMode"
       :move-hide="true"
       :y-limit="false"
       @move="(moveInfo)=>{moveHandle(magnet, moveInfo)}"
       @move-end="(moveInfo)=>{moveEndHandle(magnet, moveInfo)}"
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

.magnet-move{
  position: absolute;
  border-radius: 6px;
  box-shadow: 0 1px 2px #18d8ea;
  border: 1px solid #18d8ea;
  overflow: hidden;
  opacity: 0;
}
.magnet-move::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  opacity: 0.3;
}


</style>
