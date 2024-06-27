<script setup lang="ts">
import {ref} from "vue";
import { computeStyle, getShowMagnetInfo} from "@/components/magnets/magnetInfo.ts";
import {TransitionRoot} from "@headlessui/vue";


const magnetTable = ref()
const showMagnetInfos = getShowMagnetInfo()

console.log(showMagnetInfos)



// a, a , b, b
// c, d, b, b

let isSelect = ref(false)
let setIsSelect = (flag: boolean) => {
  isSelect.value = flag
}
</script>

<template>
  <div class="magnet-table" :ref="magnetTable">
    <div class="scroll">
      <div class="magnets-show">
        <div class="magnet-item-box"
             v-for="(showMagnetInfo, index) in showMagnetInfos"
             :style="computeStyle(showMagnetInfo.size.width, showMagnetInfo.size.height, 0, 0)"
             :key="`magnet-${index}`"
        >
          <component
              :is="showMagnetInfo.component"
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
        测试
        <button class="close-btn" @click="setIsSelect(false)">
          X
        </button>
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
  flex-wrap: wrap;
}
.magnet-item-box{
  position: relative;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid lightskyblue;
}
</style>
