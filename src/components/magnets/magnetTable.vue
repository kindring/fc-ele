<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {
  computeStyle,
  getComponent,
  getShowMagnetInfo,
  initTypeComponent,
  timeMagnetInfo
} from "@/components/magnets/magnetInfo.ts";
import {Tab, TabGroup, TabList, TabPanel, TabPanels, TransitionRoot} from "@headlessui/vue";
import {AddMagnetInfo, MagnetSize, ShowMagnetInfo} from "@/types/magnetType.ts";

import TimeManger from "@/components/magnets/timeMagnet.vue"
import VueDrag, {MoveInfo} from "@/components/public/vueDrag.vue";
import {Drag} from "@/util/domDrag.ts";

initComponents()
function initComponents() {
  initTypeComponent(timeMagnetInfo.type, TimeManger)
}
const magnetTable = ref()
const showMagnetInfos = getShowMagnetInfo()


const emit = defineEmits<{
  (e: 'addMagnet', addMagnetInfo: AddMagnetInfo): void
}>()


// a, a , b, b
// c, d, b, b

let isSelect = ref(false)
let setIsSelect = (flag: boolean) => {
  isSelect.value = flag
}

const selectMagnetInfo = ref<ShowMagnetInfo>(showMagnetInfos[0])
function selectMagnetHandle(showMagnetInfo:  ShowMagnetInfo)
{
  selectMagnetInfo.value = showMagnetInfo;
  setIsSelect(true);
  changeTab(0)
}

const selectedTab = ref(0)
function changeTab(index: number) {
  selectedTab.value = index
}

function addMagnetHandle(){
  // 获取磁贴类型和磁贴大小
  let type = selectMagnetInfo.value.type
  let sizeKeys = Object.keys(selectMagnetInfo.value.sizes)
  let sizeKey = sizeKeys[selectedTab.value] as MagnetSize
  let addMagnetInfo = {
    type: type,
    size: sizeKey
  }
  emit('addMagnet', addMagnetInfo)
  // 传递选择事件给父组件
}

const sideWidth = ref(0)
let moveTimer: null | NodeJS.Timeout = null;
let moveWait = 500;
function moveInitHandle(drag: Drag)
{
  // 获取父元素的最大可用宽度
  console.log(`moveInitHandle ---`)
  sideWidth.value = drag.parent.width
}


function moveHandle( _moveInfo: MoveInfo) {
  // 判断鼠标在元素的左半边还是右半边. 移动至边缘35%时触发
  if (moveTimer) {
    clearTimeout(moveTimer)
    moveTimer = null;
  }
  moveTimer = setTimeout(()=>{
    moveTimer = null;
    let nextSelectTab = selectedTab.value;
    let sizeKeys = Object.keys(selectMagnetInfo.value.sizes)
    if (Math.abs(_moveInfo.left) > sideWidth.value * 0.10) {
      // 移动至边缘35%时触发
      console.log(`moveHandle --- 触发`)
      // 移动至边缘35%时触发
      if(_moveInfo.left < 0){
        console.log(`左移`)
        nextSelectTab++;
      }else{
        console.log(`右移`)
        nextSelectTab--;
      }
      nextSelectTab = Math.min(Math.max(nextSelectTab, 0), sizeKeys.length - 1)
      changeTab(nextSelectTab)
    }
    // 移动至边缘35%时触发
  }, moveWait)

}



const isDrag = ref(false)
onMounted(()=>{
  isDrag.value = false
  nextTick(()=>{
    isDrag.value = true
  })
})

</script>

<template>
  <div class="magnet-table" :ref="magnetTable">
    <div class="scroll">
      <div class="magnets-show">
        <div class="magnet-item-box"
             v-for="(showMagnetInfo, index) in showMagnetInfos"
             :style="computeStyle(showMagnetInfo.size.width, showMagnetInfo.size.height, 0, 0)"
             :key="`magnet-${index}`"
             @click="selectMagnetHandle(showMagnetInfo)"
        >

          <component
              :is="getComponent(showMagnetInfo.type)"
              :size="showMagnetInfo.defaultSize"
          ></component>
          <div class="event-mask"></div>

        </div>
      </div>
    </div>


<!--    侧边栏 -->
    <TransitionRoot
        class="site"
        :show="isSelect"
        enter="transition ease-in-out duration-700 transform"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transition ease-in-out duration-700 transform"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
    >
      <div className="site-content-bottom">
        <div class="dialog-title">
          {{ selectMagnetInfo?selectMagnetInfo.title:'' }}
          <button class="close-btn" @click="setIsSelect(false)">
            X
          </button>
        </div>

        <TabGroup class="tabs-w"
                  :selectedIndex="selectedTab"
                  @change="changeTab"
                  as="div"
        >


          <TabPanels class="tabs-list">
            <TabPanel v-for="(size, key) in selectMagnetInfo.sizes"
                      :key="`com-${size?.title}-${key}`"
                      class="item"
                      as="div"
            >
              <vue-drag
                  class="vue-drag"
                  :open-drag="isDrag"
                  :move-hide="true"
                  :y-move-dom="false"
                  :x-limit="false"
                  :is-center="true"
                  @init="moveInitHandle"
                  @move="moveHandle"
              >
                <component
                    :is="getComponent(selectMagnetInfo.type)"
                    :size="key"
                ></component>
              </vue-drag>
            </TabPanel>

          </TabPanels>
          <TabList class="tabs-control">
            <Tab v-for="(size, _key, i) in selectMagnetInfo.sizes"
                 :key="size?.title"
                 :class="`item ${i === selectedTab ? 'active' : ''}`"
                 as="div"
            ></Tab>
          </TabList>
        </TabGroup>

        <div class="btn-group ">
          <div class="btn bg-red-500 text-white" @click="addMagnetHandle">
            添加组件
          </div>
        </div>
      </div>
    </TransitionRoot >
  </div>
</template>

<style scoped>
.magnet-table{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.magnets-show{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.magnet-item-box{
  position: relative;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid lightskyblue;
}
</style>
