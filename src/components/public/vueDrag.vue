<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {Drag, MouseInfo, ElementInfo} from '@/util/domDrag.ts'

export interface MoveInfo extends MouseInfo{
  left: number,
  top: number,
}
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
  },
  // 是否移动原有dom, 用于在某些场景模拟手势
  xMoveDom: {
    type: Boolean,
    default: true
  },
  yMoveDom: {
    type: Boolean,
    default: true
  },
  // 移动时如果有滚动条是否自动移动
  xScroll: {
    type: Boolean,
    default: false
  },
  yScroll: {
    type: Boolean,
    default: false
  },
  xLimit: {
    type: Boolean,
    default: true
  },
  yLimit: {
    type: Boolean,
    default: true
  },
  isCenter: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits<{
  (e: 'init', drag: Drag ): void,
  (e: 'move-start', moveInfo: MoveInfo ): void,
  (e: 'move', moveInfo: MoveInfo ): void,
  (e: 'move-end', moveInfo: MoveInfo ): void,
}>()

let drag: Drag | null = null

onMounted(()=>{
  if (props.openDrag){
    initDrag()
  }
})
function initDrag() {
  // console.log(` start init drag`)
  let dragEle = dragRef.value
  if (!dragEle) return console.error('dragElement is null !!!!!!!!!! ')
  if(!drag){
    drag = new Drag(dragEle, props.isCenter)
  }
  drag.on(Drag.Event.moveStart, moveStartHandle)
  drag.on(Drag.Event.move, moveHandle)
  drag.on(Drag.Event.moveEnd, moveEndHandle)
  emits('init', drag)
}
function unDrag(){
  if (!drag) return console.error('drag is null !!!!!!!!!! ')
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

let elementOpacityValue = ""
let parentPositionValue = ""
// 直接添加至父元素中的临时拷贝dom
let templateElement: HTMLElement | null  = null;

function _setDomStyle( el: HTMLElement, mouseInfo: MouseInfo, dragInfo: ElementInfo, isEnd: boolean = false,
                      xLimit: boolean = false, yLimit: boolean = false,
                       xScroll: boolean = false, yScroll: boolean = false,
                       isMoveDom_x : boolean = true,
                       isMoveDom_y : boolean = true,
): MoveInfo{

  let elLeft = mouseInfo.x - dragInfo.diffX -  dragInfo.parentLeft;
  let elTop = mouseInfo.y - dragInfo.diffY -  dragInfo.parentTop;

  let parentEl = el.offsetParent as HTMLElement || document.body;

  let parentTotalWidth = parentEl.scrollWidth;
  let parentTotalHeight = parentEl.scrollHeight;
  let parentWidth = parentEl.clientWidth;
  let parentHeight = parentEl.clientHeight;
  let parentScrollTop = parentEl.scrollTop || 0;
  let parentScrollLeft = parentEl.scrollLeft || 0;


  if (xLimit)
  {
    elLeft = Math.max(0, elLeft);
    elLeft = Math.min(elLeft, parentTotalWidth - dragInfo.width);
  }
  if (yLimit)
  {
    elTop = Math.max(0, elTop);
    elTop = Math.min(elTop, parentTotalHeight - dragInfo.height);
  }

  // 移动dom元素


    if(isMoveDom_x)
    {
      if(xScroll){
        if (elLeft + dragInfo.width > parentWidth)
        {
          parentEl.scrollLeft = elLeft + dragInfo.width - parentWidth;
        }if (elLeft < parentScrollLeft)
        {
          parentEl.scrollLeft = elLeft;
        }
      }
      el.style.left = `${elLeft}px`;
    }

    if(isMoveDom_y) {
      el.style.top = `${elTop}px`;
      if (yScroll) {
        if (elTop + dragInfo.height > parentHeight + parentScrollTop) {
          // console.log(` 滚动条更改 ${elTop} ${parentScrollTop}`)
          parentEl.scrollTop = elTop + dragInfo.height - parentHeight;
        }
        if (elTop < parentScrollTop) {
          parentEl.scrollTop = elTop;
        }
      }
    }
    if(isMoveDom_x || isMoveDom_y){
      el.style.position = "absolute";
      if (isEnd)
      {
        el.style.transition = "all 0.3s";
      }else{
        // 移除transition
        el.style.transition = "none";
      }
    }


  let moveInfo = {
    ...mouseInfo,
    left: elLeft,
    top: elTop
  };
  return moveInfo;
}



function moveStartHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  // console.log('开始移动')
  // console.log(mouseInfo)
  // console.log(dragInfo)
  // 存储当前元素的样式
  let el = dragInfo.el;
  if(!el){
    return console.log("未知的dom元素")
  }
  let parentEl = el.offsetParent as HTMLElement;
  if (!parentEl)
  {
    parentEl = document.body;
  }
  templateElement = el.cloneNode(true) as HTMLElement;

  let moveInfo = _setDomStyle(
      templateElement,
      mouseInfo, dragInfo, false,
      props.xLimit, props.yLimit,
      props.xScroll, props.yScroll,
      props.xMoveDom, props.yMoveDom
  );
  emits('move-start', moveInfo)

  // 如果父元素无定位根基属性
  parentPositionValue = parentEl.style.position;
  if(parentPositionValue != "absolute" && parentPositionValue != "relative" && parentPositionValue != "fixed" )
  {
    parentEl.style.position = "relative"
  }
  parentEl.append(templateElement)
  if(props.moveHide){
    elementOpacityValue = el.style.opacity
    // 获取原有的 opacity 和 display 信息
    el.style.opacity = "0"
  }
  return true;
}

function moveHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  // console.log(mouseInfo)
  // console.log(dragInfo)
  if(templateElement == null) return console.error("未知的 drag dom元素")
  // 组件超出限制

  let moveInfo = _setDomStyle(
      templateElement, mouseInfo,
      dragInfo, false,
      props.xLimit, props.yLimit,
      props.xScroll, props.yScroll,
      props.xMoveDom, props.yMoveDom
  );
  emits('move', moveInfo)

}

function moveEndHandle(mouseInfo: MouseInfo, dragInfo: ElementInfo){
  // console.log('结束移动')
  // console.log(mouseInfo)
  // console.log(dragInfo)
  let el = dragInfo.el;
  if(!el){
    return console.error("未知的父级元素")
  }
  let parentEl = el.offsetParent as HTMLElement;
  if (!parentEl)
  {
    parentEl = document.body;
  }

  if(templateElement == null) return console.error("未知的dom元素")
  let element = templateElement;
  // 恢复元素位置
  let moveInfo = _setDomStyle(
      templateElement, mouseInfo,
      dragInfo, true,
      props.xLimit, props.yLimit,
      props.xScroll, props.yScroll,
      props.xMoveDom, props.yMoveDom
  );
  emits('move-end', moveInfo)
  // 添加动画

  setTimeout(() => {
    // 移除临时dom元素
    element.remove()
    moveStyle.value = {}
    if(parentPositionValue != "absolute" && parentPositionValue != "relative" && parentPositionValue != "fixed" )
    {
      parentEl.style.position = parentPositionValue
    }
    if(props.moveHide){
      // 获取原有的 opacity 和 display 信息
      el.style.opacity = elementOpacityValue
      elementOpacityValue = ""
    }
  }, 1000 * 0.3)
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
