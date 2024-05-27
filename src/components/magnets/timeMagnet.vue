<script setup lang="ts">
import {defineComponent, ref} from "vue";
// import {MagnetSize} from "@/types/magnetType.ts";
import {timeFormat} from "@/util/time.ts";
import magnetInfos, { computeStyle} from "@/components/magnets/magnetInfo.ts";

defineComponent({
  name: "timeMagnet"
})
let props = defineProps({
  size: {
    default: magnetInfos.timeMagnetInfo.defaultSize
  }
})

let _size = props.size;
let sizeItem = magnetInfos.timeMagnetInfo.sizes[_size];
// 监听 size 值的变化
if (!sizeItem){
  // size 属性值不存在，则使用默认值
  _size = magnetInfos.timeMagnetInfo.defaultSize;
  sizeItem = magnetInfos.timeMagnetInfo.sizes[_size];
  // 获取默认值
  if(!sizeItem){
    throw new Error('size 属性值不存在');
  }
}

// 计算样式
const itemStyle = computeStyle(sizeItem.width, sizeItem.height, 0, 0, true);

const hourFormat = 'HH:mm:ss'
const yearFormat = 'yyyy年M月dd日'
// 获取 时分秒 16:53:46
const hourStr = ref(timeFormat(new Date(), hourFormat));
// 获取 年月日 2021-08-31
const yearStr = ref(timeFormat(new Date(), yearFormat));

// 定时器
function updateTime(){
  setTimeout(()=>{
    let newDate = new Date()
    hourStr.value = timeFormat(newDate, hourFormat)
    yearStr.value = timeFormat(newDate, yearFormat)
    updateTime()
  }, 500)
}
updateTime()
</script>

<template>
  <div :class="`time-box sty-${_size}`" :style="itemStyle">
    <div class="now-info">
<!--      时 -->
      <div class="hour">
        <span>{{hourStr}}</span>
      </div>
<!--        年月日 -->
      <div class="year">
        <span>{{yearStr}}</span>
      </div>
    </div>
<!--    当前日程 -->

  </div>
</template>

<style scoped>
.time-box {
  border-radius: 5px;
  box-sizing: border-box;
  padding: 5px;
}
.now-info {
  border-bottom: 1px solid #eee;
}
.sty-medium .now-info {
  width: 100%;
  height: 80px;
}
.sty-medium .now-info .hour {
  font-size: 30px;
}
.sty-medium .now-info .year {
  margin-top: 5px;
  font-size: 16px;
}

</style>
