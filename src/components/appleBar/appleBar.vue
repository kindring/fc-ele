<script setup lang="ts">
import {ref, onMounted} from 'vue'
import type{PropType} from 'vue'
import type{NavItem} from './appleBar.ts'

let hideTimer:NodeJS.Timeout;

let isHidden = ref(true);



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
  }
});


onMounted(() => {
  startHideTimer();
})




const emits = defineEmits<{
  (e: 'action', actionCode: string): void
}>()

/**
 * 用户交互时，重置隐藏计时器
 */
function barActiveHandle(): void{
  isHidden.value = false;
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
    isHidden.value = true;
  }, props.hideTime);
}


function actionHandle(actionCode: string): void{
  emits('action', actionCode);
}

</script>

<template>
  <div class="appleBarBox" :class="isHidden?'hidden':''">
    <div class="appleBar" @mouseenter="barActiveHandle" @mouseleave="startHideTimer">
      <div class="bgMask"></div>
      <div class="appleItemGroup">
        <div
            :class="`appleItem showCenterTip ${active==item.actionCode?'active':''}`"
             v-for="item in props.navItems"
             :key="item.id"
              @click="actionHandle(item.actionCode)"
        >
          <div class="appleItem-content">
            <div class="showTip">{{item.description}}</div>
            <icon-svg class="icon" :icon-name="item.icon"></icon-svg>
          </div>
        </div>
      </div>
<!--      右键-->
      <div class="appleItem appleUser" @click="actionHandle('user')">
        <div class="appleItem-content">
          <icon-svg class="icon" icon-name="user"></icon-svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.appleBarBox{
  width: 55%;
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.appleItem{
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.8;
}
.appleItemGroup .active{
  color: var(--color-text-show);
}
.appleItem-content{
  width: 45px;
  height: 45px;
  border-radius: 50%;
  box-shadow: 0 0 3px 0 var(--color-text);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.8s;
  background-color: var(--color-background-soft);
}

.appleUser{
  width: 45px;
  height: 45px;
  display: flex;
  flex-shrink: 0;
  position: relative;
}

.appleItem .icon{
  height: 100%;
  font-size: 1.5em;
  color: var(--color-text);
  transition: all 0.8s;
}

.appleItem:hover .appleItem-content, .appleUser:hover .appleItem-content{
  transform: scale(1.3);
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
  color: var(--color-text);
  background-color: var(--color-background-soft);
  transition: all 0.8s;
}


.hidden .appleBar{
  width: 10%;
  height: 10px;
  border-radius: 5px;
  opacity: 0.4;
  margin-bottom: 5px;
  cursor: pointer;
  background-color: var(--color-background);
}

.hidden .appleBar .appleItem{
  display: none;
}



</style>
