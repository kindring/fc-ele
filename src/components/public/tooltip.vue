<script>
import {ref, computed} from 'vue'
export default {
  setup(){

    // 显示弹框
    const tooltipShow = ref(false);

    // 提示内容
    const text = ref()

    // 方向
    const placements = ref('left')

    // 显示
    function showTip(){
      tooltipShow.value = true
    }
    function hiddenTip(){
      tooltipShow.value = false
    }

    // 位置
    const tooltipPostiton = ref({
      x: 0,
      y: 0
    })
    const tooltipStyle = computed(()=>{
      return {
        transform: `translate3d(${tooltipPostiton.value.x}px,${tooltipPostiton.value.y}px,0)`
      }
    })

    return {
      tooltipShow,
      showTip,
      hiddenTip,
      tooltipPostiton,
      tooltipStyle,
      text,
      placements,
    }
  }
}
</script>

<template>
  <!-- 指示 -->
  <transition name="tooltip">
    <div class="zc-tooltip" v-show="tooltipShow" :style="tooltipStyle"
    >
      <span class="zc-tooltip-text" v-html="text"></span>
      <div class="zc-tooltip-arrow" :class="[{'left':placements=='left'},
                                            {'bottom':placements=='bottom'},
                                            {'right':placements=='right'},
                                            {'top':placements=='top'}]"></div>
    </div>
  </transition>
</template>


<style  scoped>
.zc-tooltip {
  padding: 10px;
  font-size: 12px;
  line-height: 1.2;
  min-width: 10px;
  word-wrap: break-word;
  position: fixed;
  left: 0;
  top: 0;
  background: #303133;
  color: #fff;
  z-index: 1000;
  display: inline-block;
  border-radius: 8px;
  font-weight: 500;
  pointer-events: none;
}

.zc-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-width: 8px;
  border-style: solid;
}

.zc-tooltip-arrow.left {
  border-color: transparent transparent transparent #303133;
  right: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
}

.zc-tooltip-arrow.bottom {
  top: -15px;
  border-color: transparent transparent #303133 transparent;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

.zc-tooltip-arrow.right {
  left: -15px;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  border-color: transparent #303133 transparent transparent;
}

.zc-tooltip-arrow.top {
  bottom: -15px;
  border-color: #303133 transparent transparent transparent;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
}

/* 动画 */
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transition: opacity .3s ease;
}

.tooltip-leave-from,
.tooltip-enter-to {
  transition: opacity .1s ease;
}

</style>
