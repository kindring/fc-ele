<script setup lang="ts">
import {ref, onMounted} from 'vue'
import type{PropType} from 'vue'
import barIconBtn from './barIconBtn.vue'
import type{NavItem} from './appleBar.ts'

let hideTimer:NodeJS.Timeout;

let isHidden = ref(true);

const emits = defineEmits<{
  (e: 'input', isHidden: boolean): void
  (e: 'action', actionCode: string): void
}>()


let props = defineProps({
  //   是否全屏
  isFullScreen: {
    type: Boolean,
    default: false
  },
  //   导航项
  navItems:  {
    type: Array as PropType<NavItem[]>,
    default: ():NavItem[] => []
  },
  hideTime: {
    type: Number,
    default: 3000
  },
  active: {
    type: String,
    default: ''
  },
  // 阻止隐藏
  preventHide: {
    type: Boolean,
    default: false
  }
});


onMounted(() => {
  startHideTimer();
})




/**
 * 用户交互时，重置隐藏计时器
 */
function barActiveHandle(): void{
  isHidden.value = false;
  // console.log('barActiveHandle', props.preventHide)
  emits('input', isHidden.value);
  if(hideTimer){
    clearTimeout(hideTimer);
  }
}


// 倒计时
function startHideTimer(){
  if(hideTimer){
    clearTimeout(hideTimer);
  }
  hideTimer = setTimeout(() => {
    if(!props.preventHide){
      isHidden.value = true;
      emits('input', isHidden.value);
    }
  }, props.hideTime);
}


function actionHandle(actionCode: string): void{
  emits('action', actionCode);
}

</script>

<template>
  <div class="appleBarBox" :class="isHidden?'hidden':''">
    <div class="appleBar"
         @mouseenter="barActiveHandle"
         @mouseover="barActiveHandle"
         @mouseleave="startHideTimer">
      <div class="bgMask"></div>
      <div class="appleItemGroup">
        <slot name="left"></slot>
      </div>
      <div class="appleItemGroup appleBarMoreGroup">
        <bar-icon-btn
            v-for="item in props.navItems"
            :key="item.id"
            :active="active==item.actionCode"
            :description="item.description"
            :icon-name="item.icon"
            @click.native="actionHandle(item.actionCode)"
        ></bar-icon-btn>
      </div>
<!--      右侧-->
      <div class="appleItemGroup">
        <slot></slot>
      </div>

    </div>
  </div>
</template>

<style scoped>
.appleBarBox{
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
}

.appleBar{
  width: 100%;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0 0 10px 0 var(--color-background-mute);
  transition: all 0.8s;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
}
.appleBar .bgMask{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  opacity: 0.6;
  background-color: var(--color-background-soft);
}
.appleItemGroup{
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.appleBarMoreGroup{
  flex: 1;
}

.hidden .appleBar{
  width: 180px;
  height: 12px;
  border-radius: 5px;
  opacity: 0.4;
  margin-bottom: 5px;
  cursor: pointer;
  background-color: var(--color-background);
}

.hidden .appleBar > *{
  display: none;
}



</style>
