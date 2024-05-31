<script setup lang="ts">
import {reactive, ref} from "vue";
import TimeMagnet from "@/components/magnets/timeMagnet.vue";
import vueDrag, {MoveInfo} from "@/components/public/vueDrag.vue";
import {Magnet, MagnetEmit, MagnetSize} from "@/types/magnetType.ts";
import {comMaxWidth, computeMagnetStyle, comXY, initTimeMagnetInfo} from "@/components/magnets/magnetInfo.ts";

import {Calendar} from "@/util/time.ts";
import {CollisionDirection, CollisionResult, detectCollisionDirection, Drag, Rect} from "@/util/domDrag.ts";

const timeMagnetInfo = initTimeMagnetInfo(TimeMagnet)

interface vueMagnet extends Magnet{
}
const typeComponent = {
  [timeMagnetInfo.type]: timeMagnetInfo.component
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
  }
];

const magnetItems = reactive(magnetItemInfos)
const magnetEl = ref();
let maxWidth = 10;

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


// 定时器
let collidingTimer: NodeJS.Timeout | null = null;
let collidingWaitTime = 300


// 计算其他元素的位置
function comMagnets(changeMagnet: vueMagnet){
  // 挤开当前元素所在位置
  let collisionMagnets: {
    magnet: vueMagnet,
    direction: CollisionDirection
  }[] = findCollisionMagnet(changeMagnet)
  // 获取父元素的最大可用宽度
  let result = [];
  for (let i = 0; i < collisionMagnets.length; i++)
  {
    let item = collisionMagnets[i]
    squeezeMagnet(changeMagnet, item.magnet , item.direction, maxWidth)
    // 递归计算该元素的新位置
    let children = comMagnets(item.magnet)
    // 子元素移动完成
    children.forEach(child => {
      result.push(child)
    })
    result.push(item.magnet)
  }
  return result
  // 重新渲染界面
}

// 寻找已经碰撞的组件
function findCollisionMagnet(changeMagnet: vueMagnet){
  let changeMagnetRect: Rect = {
    ...changeMagnet
  }
  let collisionMagnets: {
    magnet: vueMagnet,
    direction: CollisionDirection
  }[] = []
  for (let i = 0; i < magnetItems.length; i++)
  {
    let magnet = magnetItems[i]
    if(magnet.id === changeMagnet.id) continue
    // 判断当前元素是否被其他元素占用了
    // 转换为 rect
    let magnetRect: Rect  = {
      ...magnet
    }
    let collisionResult: CollisionResult = detectCollisionDirection(changeMagnetRect, magnetRect)
    if(collisionResult.colliding)
    {
      collisionMagnets.push({
        magnet,
        direction: collisionResult.direction
      })
    }
  }
  return collisionMagnets
}

function squeezeMagnet(checkMagnet: vueMagnet, moveMagnet: vueMagnet,  direction: CollisionDirection, _maxWidth: number){
  let newVal = 0
  // 移动受阻碍则尝试向下移动
  if(direction === CollisionDirection.Right )
  {
    newVal = checkMagnet.x - moveMagnet.width
    if(newVal < 0) {
      return squeezeMagnet(checkMagnet, moveMagnet, CollisionDirection.Down, _maxWidth)
    }
    moveMagnet.x = newVal
  }
  else if(direction === CollisionDirection.Left)
  {
    newVal = checkMagnet.width + checkMagnet.x
    if(newVal + moveMagnet.width > _maxWidth) {
      return squeezeMagnet(checkMagnet, moveMagnet, CollisionDirection.Down, _maxWidth)
    }
    moveMagnet.x = newVal
  }
  else if(direction === CollisionDirection.Down)
  {
    newVal = checkMagnet.y - moveMagnet.height
    if(newVal < 0) {
      return squeezeMagnet(checkMagnet, moveMagnet, CollisionDirection.Top, _maxWidth)
    }
    moveMagnet.y = newVal
  }
  else if(direction === CollisionDirection.Top)
  {
    newVal = checkMagnet.y + checkMagnet.height
    moveMagnet.y = newVal
  }
}

function moveInitHandle(drag: Drag)
{
  // 获取父元素的最大可用宽度
  maxWidth = comMaxWidth(drag.parent.width) || 10
  console.log(`maxWidth ${maxWidth}`)
}

function moveHandle(magnet: vueMagnet, moveInfo: MoveInfo){
  // 计算新位置相对于多少值
  let {x, y} = comXY(moveInfo.left, moveInfo.top)
  let magnetInfo: vueMagnet = {
    ...magnet,
    x: x,
    y: y
  }
  magnet.x = magnetInfo.x
  magnet.y = magnetInfo.y
  let moveStyle = computeMagnetStyle(magnetInfo)
  moveTipStyle.value = {
    ...moveStyle,
    opacity: `1`
  }
  // 判断当前元素是否占用到对应元素
  // 移动占位元素
  // console.log(magnetInfo)

  if(collidingTimer) {
    clearTimeout(collidingTimer);
  }
  collidingTimer = setTimeout(()=>{
    let changeMagnets = comMagnets(magnetInfo)
    console.log(`更改的元素: ${changeMagnets.length}`)
    collidingTimer = null

    // 元素全部移动完成
  }, collidingWaitTime)
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
  <div class="magnet scroll" :ref="magnetEl">
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
              :hide-move="true"
       @init="moveInitHandle"
       @move="(moveInfo)=>{moveHandle(magnet, moveInfo)}"
       @move-end="(moveInfo)=>{moveEndHandle(magnet, moveInfo)}"
    >
<!--      组件遮罩-->
      <component
          v-show="!editMode"
          :is="typeComponent[magnet.type]"
          :size="magnet.size"
          @magnet="eventHandler"
      ></component>
    </vue-drag>

<!--    编辑模式下的按钮控件 -->
    <div class="edit-control">

    </div>
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
  transition: all 0.3s;
}

.magnet-item > * {
  position: relative;
}
.magnet-item .magnet-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  opacity: 0.5;
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
