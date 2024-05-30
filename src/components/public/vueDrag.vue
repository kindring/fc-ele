<script setup lang="ts">
import {ref, watch} from 'vue'
import {Drag, MouseInfo, ElementInfo} from '@/util/domDrag.ts'
const dragRef = ref<HTMLElement>()
// init drag

const props = defineProps({
  openDrag: {
    type: Boolean,
    default: false
  },
  // 移动时隐藏原有dom
  moveHide: {
    type: Boolean,
    default: false
  }
})
let drag: Drag | null = null

function initDrag() {
  console.log(` start init drag`)
  let dragEle = dragRef.value
  if (!dragEle) return console.error('dragElement is null !!!!!!!!!! ')
  if(!drag){
    drag = new Drag(dragEle)
  }
  drag.on(Drag.Event.moveStart, moveStartHandle)
  drag.on(Drag.Event.move, moveHandle)
  drag.on(Drag.Event.moveEnd, moveEndHandle)
}
function unDrag(){
  if (!drag) return console.error('dragElement is null !!!!!!!!!! ')
  drag.off(Drag.Event.moveStart)
  drag.off(Drag.Event.move)
  drag.off(Drag.Event.moveEnd)
}

let moveStyle = ref({})
moveStyle.value = {
  position: "absolute",
  left: `100px` ,
  top: `10px`
}

let elementDisplayValue = ""
let parentPositionValue = ""
// 直接添加至父元素中的临时拷贝dom
let templateElement = null;

function moveStartHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  console.log('开始移动')
  console.log(mouseInfo)
  console.log(dragInfo)
  // 存储当前元素的样式
  let el = dragInfo.el;
  if(!el){
    return console.log("未知的dom元素")
  }
  let parentEl = el.offsetParent;
  templateElement = el.cloneNode(true);
  // 移除克隆的dom元素的所有事件
  templateElement.style.position = "absolute";
  templateElement.style.left = `${mouseInfo.x - dragInfo.diffX -  dragInfo.parentLeft}px`;
  templateElement.style.top = `${mouseInfo.y - dragInfo.diffY -  dragInfo.parentTop}px`;
  // 如果父元素无定位根基属性
  parentPositionValue = parentEl.style.position;
  if(parentPositionValue != "absolute" && parentPositionValue != "relative" && parentPositionValue != "fixed" )
  {
    parentEl.style.position = "relative"
  }
  parentEl.append(templateElement)
  if(props.moveHide){
    elementDisplayValue = el.style.display
    // 获取原有的 opacity 和 display 信息
    el.style.display = "none"
  }
  return true;
}

function moveHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  console.log('move')
  console.log(mouseInfo)
  console.log(dragInfo)
  templateElement.style.position = "absolute";
  templateElement.style.left = `${mouseInfo.x - dragInfo.diffX - dragInfo.parentLeft}px`;
  templateElement.style.top = `${mouseInfo.y - dragInfo.diffY - dragInfo.parentTop}px`;
}

function moveEndHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  console.log('结束移动')
  console.log(mouseInfo)
  console.log(dragInfo)
  let el = dragInfo.el;
  if(!el){
    return console.log("未知的dom元素")
  }
  let parentEl = el.offsetParent;
  if(props.moveHide){
    // 获取原有的 opacity 和 display 信息
    el.style.display = elementDisplayValue
    elementDisplayValue = ""
  }
  // 移除临时dom元素
  templateElement.remove()
  moveStyle.value = {}
  if(parentPositionValue != "absolute" && parentPositionValue != "relative" && parentPositionValue != "fixed" )
  {
    parentEl.style.position = parentPositionValue
  }
}


// watch openDrag
watch(()=>props.openDrag, (val) => {
  if (val){
    initDrag()
  }else {
    unDrag()
  }

})




</script>

<template>
  <div class="drag-box" ref="dragRef" >
    <slot></slot>
  </div>

</template>

<style scoped>
</style>
