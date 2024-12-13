<script setup lang="ts" >
import {computed, onMounted, ref, watch} from "vue";
import VueDrag, {MoveInfo} from "@/components/public/vueDrag.vue";
import MacWindow from "@/components/window/macWindow.vue";

const props = defineProps({
  minWidth: {
    type: Number,
    default: 700
  },
  minHeight: {
    type: Number,
    default: 360
  },
  parentWidth: {
    type: Number,
    default: 700
  },
  parentHeight: {
    type: Number,
    default: 700
  },
  index: {
    type: Number,
    default: 0
  },
  appName: {
    type: String,
    default: 'test'
  },
  appWindowId: {
    type: String,
    default: ''
  },
})

const isFull = ref(false)
const width = ref(props.minWidth)
const height = ref(props.minHeight)
const left = ref(0)
const top = ref(0)

const style = computed(() => {
  return {
    width: width.value + 'px',
    height: height.value + 'px',
    left: left.value + 'px',
    top: top.value + 'px',
    zIndex: props.index
  }
})

// 窗口大小调整 鼠标按下 触发事件
const resizeItems =  [ 'lt', 'rt', 'lb', 'rb', 't', 'r', 'b', 'l']

const windowRef = ref<HTMLElement>()
const allowResize = ref(true)
const emits = defineEmits<{
  (e: 'ding'): void,
  (e: 'min'): void,
  (e: 'max'): void,
  (e: 'close'): void,
  (e: 'focusWindow'): void
}>()

let startLeft = left.value;
let startTop = top.value;
let startWidth = width.value;
let startHeight = height.value;
let startMoveInfo: MoveInfo = {
  x: 0,
  y: 0,
  left: 0,
  top: 0,
}
function resizeStart(moveInfo: MoveInfo) {
  console.log(moveInfo)
  startLeft = left.value;
  startTop = top.value;
  startWidth = width.value;
  startHeight = height.value;
  startMoveInfo = moveInfo
}
function resizeHandle(item: string, moveInfo: MoveInfo) {
  // 计算与开始的位置的差值
  let diffX = 0;
  let diffY = 0;
  let nextTop = startTop;
  let nextLeft = startLeft;
  let nextHeight = startHeight;
  let nextWidth = startWidth;
  switch (item) {
    case 'b':
      diffY = moveInfo.y - startMoveInfo.y;
      break;
    case 't':
      diffY = startMoveInfo.y - moveInfo.y;
      nextTop = startTop - diffY;
      // 如果top 小于0 则不增加 top
      break;
    case 'l':
      diffX = startMoveInfo.x - moveInfo.x;
      nextLeft = startLeft - diffX;
      break;
    case 'r':
      diffX = moveInfo.x - startMoveInfo.x;
      break;
    case 'lt':
      diffX = startMoveInfo.x - moveInfo.x;
      diffY = startMoveInfo.y - moveInfo.y;
      nextTop = startTop - diffY;
      nextLeft = startLeft - diffX;
      break;
    case 'rt':
      diffX = moveInfo.x - startMoveInfo.x;
      diffY = startMoveInfo.y - moveInfo.y;
      nextTop = startTop - diffY;
      break;
    case 'lb':
      diffX = startMoveInfo.x - moveInfo.x;
      diffY = moveInfo.y - startMoveInfo.y;
      nextLeft = startLeft - diffX;
      break;
    case 'rb':
      diffX = moveInfo.x - startMoveInfo.x;
      diffY = moveInfo.y - startMoveInfo.y;
      break;

  }

    // 拉至窗口边缘调节
    nextWidth = diffX + startWidth;
    if (props.minWidth < nextWidth && ( nextLeft > 0 || (startLeft <= 1 && startWidth < nextWidth) )) {
      nextLeft = Math.max(1, nextLeft);
      left.value = nextLeft;
      nextWidth = Math.min(props.parentWidth - nextLeft - 2, nextWidth)
      width.value = nextWidth;
    }

    nextHeight = diffY + startHeight;
    if (props.minHeight < nextHeight && ( nextTop > 0 || (startTop <= 1 && startHeight < nextHeight) )){
      nextTop = Math.max(1, nextTop);
      top.value = nextTop;
      nextHeight = Math.min(props.parentHeight - nextTop - 2, nextHeight)
      height.value = nextHeight;
    }

}

// 剧中窗口
function centerHandle() {
  left.value = (props.parentWidth - width.value) / 2;
  top.value = (props.parentHeight - height.value) / 2;
}

function moveStart(moveInfo: MoveInfo) {
  console.log(moveInfo)
  startLeft = left.value;
  startTop = top.value;
}
function moveHandle(moveInfo: MoveInfo) {
  console.log(moveInfo)
  let nextLeft = moveInfo.left + startLeft;
  let nextTop = moveInfo.top + startTop;
  if (nextLeft < 0 - width.value + 200) {
    nextLeft = 0 - width.value + 200;
  }else if(nextLeft > props.parentWidth - 200){
    nextLeft = props.parentWidth - 200;
  }
  left.value = nextLeft;
  if(nextTop < 0){
    nextTop = 0;
  }else if(nextTop > props.parentHeight - 35){
    nextTop = props.parentHeight - 35;
  }
  top.value = nextTop;
}

let positionInfo = {
  left: 0,
  top: 0,
  width: 0,
  height: 0
}
function savePositionAndSize() {
  positionInfo = {
    left: left.value,
    top: top.value,
    width: width.value,
    height: height.value
  }
}
function restorePositionAndSize() {
  left.value = positionInfo.left;
  top.value = positionInfo.top;
  width.value = positionInfo.width;
  height.value = positionInfo.height;
}
function minHandle() {
  savePositionAndSize();
  emits('min')
}
function maxWindow(changeSave: boolean = false) {
  if(changeSave){
    savePositionAndSize()
  }
  allowResize.value = false;
  left.value = 0
  top.value = 0
  width.value = props.parentWidth
  height.value = props.parentHeight
  isFull.value = true;
}

function maxHandle() {
    isFull.value = !isFull.value;
    if(isFull.value)
    {
      maxWindow(true)
    }else{
      restorePositionAndSize()
      allowResize.value = true;
    }
}

function closeHandle() {
  emits('close')
}

function focusWindow()
{
  console.log('focusWindow')
  emits('focusWindow');
}

onMounted(()=>{
  windowRef.value?.addEventListener('click', ()=>{
    focusWindow();
  }, false)
  centerHandle();

})

// watch 事件
watch(()=>props.parentWidth, (_newValue, _oldValue)=>{
  console.log('parentWidth', _newValue, _oldValue)
  if(isFull.value)
  {
    maxWindow()
  }
})
</script>

<template>
<!-- windows 窗口组件, 可以调节窗口大小, 被拖拽, 最小化, 最大化, 关闭 -->
<div class="app-window-box"
     :style="style"
     ref="windowRef"
>
<!-- 大小调整拖拽框, 8个方向 -->
  <div class="app-drag-box" v-show="allowResize">
    <vue-drag
        v-for="item in resizeItems"
        :class="item"
        :key="`drag-${item}`"
        :open-drag="true"
        :move-hide="true"
        :x-move-dom="false"
        :y-move-dom="false"
        :x-limit="false"
        :y-limit="false"
        :is-center="true"
        @move-start="resizeStart"
        @move="(moveInfo: MoveInfo)=>{resizeHandle(item, moveInfo)}" >
    </vue-drag>
  </div>
  <div class="app-window-show" >
    <mac-window
        :title="'test212'"
        icon="home"
        :is-full="isFull"
        :disable-margin="true"
        :ding-show="false"
        :app-window-id="appWindowId"
        @min="minHandle"
        @max="maxHandle"
        @close="closeHandle"
    >
      <template #top>
        <vue-drag
            class="app-window-title"
            :open-drag="true"
            :move-hide="false"
            :x-move-dom="false"
            :y-move-dom="false"
            :x-limit="false"
            :y-limit="false"
            @move-start="moveStart"
            @move="moveHandle"
        >
          {{ appName }}
        </vue-drag>
      </template>
      <slot>
      </slot>
    </mac-window>

  </div>


<!--  方框 -->
</div>
</template>

<style scoped>
.app-window-box{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.app-window-show{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.app-window-box .app-drag-box{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.app-full{
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.app-drag-box > *{
  position: absolute;
}
.lt,.rt,.lb,.rb{
  width: 20px;
  height: 20px;
}
.lt{
  left: -5px;
  top: -5px;
  cursor: nw-resize;
}
.rt{
  right: -5px;
  top: -5px;
  cursor: ne-resize;
}
.lb{
  left: -5px;
  bottom: -5px;
  cursor: sw-resize;
}
.rb{
  right: -5px;
  bottom: -5px;
  cursor: se-resize;
}
.t,.b{
  width: calc(100% - 20px);
  height: 5px;
  left: 10px;
  cursor: ns-resize;
}
.r, .l{
  width: 5px;
  height: calc(100% - 20px);
  top: 10px;
  cursor: e-resize;
}
.t{
  top: -3px;
}
.b{
  bottom: -3px;
}
.r{
  right: -3px;
}
.l{
  left: -3px;
}

.app-window-title{
  width: 100%;
  height: 30px;
  padding: 0 5px;
}

</style>
