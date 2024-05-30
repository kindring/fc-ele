<script setup lang="ts">
import {ref, watch} from 'vue'
import {Drag, MouseInfo, ElementInfo} from '@/util/domDrag.ts'
const dragRef = ref<HTMLElement>()
// init drag

const props = defineProps({
  openDrag: {
    type: Boolean,
    default: false
  }
})
let drag: Drag | null = null
function initDrag() {
  console.log(` start init drag`)
  let dragEle = dragRef.value
  if (!dragEle) return console.error('dragElement is null !!!!!!!!!! ')
  drag = new Drag(dragEle)
  drag.on(Drag.Event.moveStart, moveStartHandle)
  drag.on(Drag.Event.move, moveHandle)
  drag.on(Drag.Event.moveEnd, moveEndHandle)
}
function moveStartHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  console.log('开始移动')
  console.log(mouseInfo)
  console.log(dragInfo)
}

function moveHandle(mouseInfo: MouseInfo, _: ElementInfo){
  console.log('move')
  console.log(mouseInfo)
}

function moveEndHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  console.log('结束移动')
  console.log(mouseInfo)
  console.log(dragInfo)
}


// watch openDrag
watch(()=>props.openDrag, (_) => {
  initDrag()
})




</script>

<template>
  <div class="drag-box" ref="dragRef">
    <slot></slot>
  </div>
</template>

<style scoped>
.drag-box{
  position: absolute;
}
</style>
