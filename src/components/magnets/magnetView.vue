<script setup lang="ts">
import {nextTick, onBeforeMount, reactive, ref, watch} from "vue";
// import { Dialog, DialogPanel, DialogTitle, TransitionRoot  } from '@headlessui/vue'
import vueDrag, {MoveInfo} from "@/components/public/vueDrag.vue";
import {AddMagnetInfo, Magnet, MagnetEmit} from "@/types/magnetType.ts";
import {
  comMaxWidth,
  computeMagnetStyle,
  comXY, findEmptyPosition, findMagnetInfo, getComponent, initTypeComponent,
  timeMagnetInfo,
} from "@/components/magnets/magnetInfo.ts";

import {Calendar} from "@/util/time.ts";
import {CollisionDirection, CollisionResult, detectCollisionDirection, Drag, Rect} from "@/util/domDrag.ts";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import {changeMagnets, deleteMagnet, fetchMagnetList} from "@/apis/magnetControl.ts";
import {ErrorCode, ResponseData} from "@/types/apiTypes.ts";
import MagnetTable from "@/components/magnets/magnetTable.vue";
import KuiDialog from "@/components/public/kui-dialog.vue";

import TimeManger from "@/components/magnets/timeMagnet.vue"

import kuiMessage from "@/components/public/kui/message"

initComponents()
function initComponents() {
  initTypeComponent(timeMagnetInfo.type, TimeManger)
}


let magnetItems = reactive([]) as Magnet[]
const magnetEl = ref();
let maxWidth = 10;


async function loadMagnetList() {
  let response: ResponseData<Magnet[]> = await fetchMagnetList()
  if (response.code !== ErrorCode.success) {
    console.log(response.msg)
    return;
  }
  let _MagnetItems = response.data;
  magnetItems.splice(0, magnetItems.length, ..._MagnetItems)
}

onBeforeMount(() => {
  loadMagnetList()
})

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
      kuiMessage.warning('no match event')
      console.warn(magnetEmit)
    break;
  }
}

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['editModeChange'])

const myEditMode = ref(props.editMode)
// 转换为坐标值

const moveTipStyle = ref()


// 定时器
let collidingTimer: NodeJS.Timeout | null = null;
let collidingWaitTime = 300


// 计算其他元素的位置
function comMagnets(changeMagnet: Magnet){
  // 挤开当前元素所在位置
  let collisionMagnets: {
    magnet: Magnet,
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
function findCollisionMagnet(changeMagnet: Magnet){
  let changeMagnetRect: Rect = {
    ...changeMagnet
  }
  let collisionMagnets: {
    magnet: Magnet,
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

function squeezeMagnet(checkMagnet: Magnet, moveMagnet: Magnet,  direction: CollisionDirection, _maxWidth: number){
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
}

function moveHandle(magnet: Magnet, moveInfo: MoveInfo){
  // 计算新位置相对于多少值
  let {x, y} = comXY(moveInfo.left, moveInfo.top)
  let magnetInfo: Magnet = {
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
    console.log(`挤开的元素: ${changeMagnets.length}`)
    collidingTimer = null
    // 元素全部移动完成
  }, collidingWaitTime)
}

function moveStartHandle(magnet: Magnet)
{
  magnet.selected = true
}

function moveEndHandle(magnet: Magnet, moveInfo: MoveInfo)
{
  console.log(magnet, moveInfo)
  moveTipStyle.value = {
    opacity: `0`
  }
  magnet.selected = false
  magnet.changed = true
}

watch(()=>props.editMode, (val)=>{
  myEditMode.value = val
  if(!val){
    saveMagnet()
  }
})
// 存储元素信息
async function saveMagnet(){
  let result = await changeMagnets(magnetItems);
  if(result.code !== ErrorCode.success){
    kuiMessage.error(`保存磁贴失败 ${result.msg}`)
    return
  }
  kuiMessage.success('保存磁贴成功')
}


async function deleteMagnetHandle(magnet: Magnet) {
  console.log(`移除磁贴 ${magnet.id}`)
  let result: ResponseData<boolean> = await deleteMagnet(magnet.id);
  if( result.code !== ErrorCode.success){
    kuiMessage.log(result.msg)
    return
  }
  // 移除元素
  let idx = magnetItems.findIndex(item => item.id === magnet.id)
  if (idx < 0)
  {
    kuiMessage.error(`no match magnet ${magnet.id}`)
    return
  }
  magnetItems.splice(idx, 1)
  kuiMessage.success(`移除磁贴成功`);
  // magnetItems.
}



const isOpen = ref(false)
function setIsOpen(value: boolean = false) {
  isOpen.value = value
  if (value)
  {
    setIsSite(false)
  }
}

const isSite = ref(false)
function setIsSite(value: boolean = false) {
  isSite.value = value
}

async function addMagnetHandle(addMagnetInfo: AddMagnetInfo)
{
  // console.log(`add magnet type:${addMagnetInfo.type} size:${addMagnetInfo.size}`)
  setIsSite(false)
  setIsOpen(false)
  // 生成新的组件
  let magnetInfo = findMagnetInfo(addMagnetInfo.type)
  if (!magnetInfo){
    return console.error(`no match type ${addMagnetInfo.type}`)
  }
  let size = magnetInfo.sizes[addMagnetInfo.size]
  if (!size){
    return console.error(`no match size ${addMagnetInfo.size}`)
  }
  // 暂时接管编辑模式
  myEditMode.value = false;
  let {x, y} = findEmptyPosition(magnetItems, size.width, size.height, maxWidth)
  let magnet: Magnet = {
    id: `tmpId-${magnetItems.length}`,
    type: addMagnetInfo.type,
    size: addMagnetInfo.size,
    event: magnetInfo.event,
    x: x,
    y: y,
    width: size.width,
    height: size.height,
    selected: false,
    changed: false,
    isAdd: true,
  }
  magnetItems.push(magnet);
  // 等待渲染完成, 再次开启编辑模式
  await nextTick()
  myEditMode.value = true;
}


async function saveMagnetHandle(){
  // 添加防抖
  emit('editModeChange')
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
       :open-drag="myEditMode"
       :move-hide="true"
       :y-limit="false"
       @init="moveInitHandle"
       @move-start="(_moveInfo)=>{moveStartHandle(magnet)}"
       @move="(moveInfo)=>{moveHandle(magnet, moveInfo)}"
       @move-end="(moveInfo)=>{moveEndHandle(magnet, moveInfo)}"
    >
      <div class="drag-content" >
        <component
            :is="getComponent(magnet.type)"
            :size="magnet.size"
            @magnet="eventHandler"
        ></component>
        <div class="magnet-mask" v-show="editMode"></div>
      </div>

      <div class="magnet-remove apple-btn" v-show="editMode" @click.stop="deleteMagnetHandle(magnet)" @mousedown.stop="deleteMagnetHandle(magnet)">
        <icon-svg icon-name="remove"></icon-svg>
      </div>

    </vue-drag>

<!--    编辑模式下的按钮控件 -->
    <div class="edit-control" v-if="editMode">
      <div class="apple-btn mx-0.5" @click="setIsOpen(true)">
        <icon-svg icon-name="add"></icon-svg>
      </div>
      <div class="apple-btn mx-0.5" @click="()=>{saveMagnetHandle()}"> 完成</div>
    </div>


    <kui-dialog
        :show="isOpen"
        class-name="dialog dialog-mask"
    >

      <div class="dialog-content">

        <div class="dialog-title">
          <div class="dialog-title-text">
            添加磁贴
          </div>
          <div
              class="close-btn"
              @click="setIsOpen(false)">
            X
          </div>
        </div>

        <div class="dialog-show">
          <!--          磁贴组件选择列表-->
          <magnet-table @add-magnet="addMagnetHandle" />
        </div>

      </div>
    </kui-dialog>
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
  transition: all 0.3s;
}

.magnet-item .drag-content > * {
  position: relative;
}
.magnet-item .drag-content  {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  box-shadow: 0 1px 2px #ccc;
}
.magnet-item .magnet-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  border-radius: 6px;
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


.magnet-remove {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  opacity: 0.7;
}
.edit-control {
  position: sticky;
  top: 15px;
  right: 10px;
  display: flex;
  width: auto;
  height: 40px;
  align-items: center;
}



</style>
