<script setup lang="ts">
import { ref} from "vue";
import {Magnet, MagnetSize} from "@/types/magnetType.ts";
import {computeMagnetStyle, initTimeMagnetInfo} from "@/components/magnets/magnetInfo.ts";

import TimeMagnet from "@/components/magnets/timeMagnet.vue";

const timeMagnetInfo = initTimeMagnetInfo(TimeMagnet)

interface vueMagnet extends Magnet{
  component: any
}
const magnetItemInfos: vueMagnet[] = [
  {
    id: `1`,
    type: 'TimeMagnet',
    x: 0,
    y: 0,
    width: timeMagnetInfo.sizes.medium?.width??0,
    height: timeMagnetInfo.sizes.medium?.height??0,
    size: MagnetSize.medium,
    editMode: false,
    selected: false,
    component: timeMagnetInfo.component
  },
  {
    id: `233`,
    type: timeMagnetInfo.type,
    x: 6,
    y: 6,
    width: timeMagnetInfo.sizes.medium?.width??0,
    height: timeMagnetInfo.sizes.medium?.height??0,
    size: MagnetSize.medium,
    editMode: false,
    selected: false,
    component: timeMagnetInfo.component
  }
];



const magnetItems = ref(magnetItemInfos)





</script>

<template>
<!-- 磁帖 布局组件, -->
<div class="magnet">

  <!--    磁贴组件布局 -->
  <div class="magnet-item"
       v-for="magnet in magnetItems"
       :key="magnet.id"
       :style="computeMagnetStyle(magnet)"
  >
    <component :is="magnet.component" v-bind:size="magnet.size"></component>
  </div>

</div>
</template>

<style scoped>
.magnet {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}

.magnet-item {
  position: absolute;
  border-radius: 10px;
  box-shadow: 0px 1px 2px #ccc;
}

</style>
