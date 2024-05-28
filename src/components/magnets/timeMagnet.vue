<script setup lang="ts">
import {defineComponent, ref} from "vue";
// import {MagnetSize} from "@/types/magnetType.ts";
import {Calendar, getCalendar, getCalendarByWeek, LUNAR_INFO, timeFormat} from "@/util/time.ts";
import {computeStyle, timeMagnetInfo} from "@/components/magnets/magnetInfo.ts";
import {MagnetEmit, MagnetSize} from "@/types/magnetType.ts";

defineComponent({
  name: "timeMagnet"
})

const emit = defineEmits<{
  (e: 'magnet', magnetEmit: MagnetEmit<Calendar>): void
}>()

let props = defineProps({
  size: {
    default: timeMagnetInfo.defaultSize
  }
})

let _size = props.size;
let sizeItem = timeMagnetInfo.sizes[_size];
// 监听 size 值的变化
if (!sizeItem){
  // size 属性值不存在，则使用默认值
  _size = timeMagnetInfo.defaultSize;
  sizeItem = timeMagnetInfo.sizes[_size];
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

const weekDays = LUNAR_INFO.WEEK_DAY_SHORT;


const calendar = ref(getCalendar(new Date()))
const calendarIndex = ref(-1);
// 生成日历
if (props.size === MagnetSize.small){
  // 获取 7 天的日历
  calendar.value = getCalendarByWeek(new Date())
}



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


function selectDay(calendarItem:  Calendar, index: number){
  calendarIndex.value = index;
  const magnetEmit = {
    event: timeMagnetInfo.event,
    data: calendarItem,
  }
  emit('magnet', magnetEmit)
}
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
    <div class="date-box">
<!--      星期 -->
      <div class="week">
        <div class="week-item"
             v-for="week in weekDays"
             :key="week"
        >
          <span>{{ week }}</span>
        </div>
      </div>
      <div class="calendar">
        <div
             v-for="(item, i) in calendar"
             :key="item.year + item.month + item.day"
             :class="`calendar-item
             ${item.isToday?'today':''}
             ${item.isLast||item.isNext?'last':''}
             ${calendarIndex === i?'selected':''}
             `"
             @click="selectDay(item, i)"
        >
          <span class="calendar-day">{{ item.day }}</span>
<!--          最大四字 -->
<!--          <span class="calendar-info">节日|节气|农历日</span>-->
        </div>
      </div>
    </div>
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
.now-info {
  width: 100%;
  height: 80px;
}
.now-info .hour {
  font-size: 30px;
}
.now-info .year {
  margin-top: 5px;
  font-size: 16px;
}

.week{
  width: 100%;
  height: 40px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-content: space-around;
  align-items: center;
}
.week-item{
  width: 50px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: default;
}
.calendar{
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 100%;
  height: 150px;
}
.calendar-item{
  width: 50px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: default;
  border-radius: 5px;
  font-size: 16px;
  transition: all .3s;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;

}
.calendar-item:hover{
  border: 2px solid #42a4f1;
}
.selected{
  border: 2px solid #5cb7fd;
}
.today{
  background: #5cb7fd;
  color: #ff3a3a;
}
.last{
  color: #545454;
  font-weight: normal;
  font-size: 14px;
}
.calendar-day{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 20px;
}
.calendar-info{
  display: flex;
  justify-content: center;
  width: 50px;
  height: 20px;
  font-size: 12px;
}

</style>
