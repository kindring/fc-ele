<script setup lang="ts">
import { ref} from "vue";
import {Magnet, MagnetSize} from "@/types/magnetType.ts";
import magnetInfos, {computeMagnetStyle} from "@/components/magnets/magnetInfo.ts";

// import TimeMagnet from "@/components/magnets/timeMagnet.vue";

const magnetItemInfos: Magnet[] = [
  {
    id: `1`,
    type: 'timeMagnet',
    x: 0,
    y: 0,
    width: magnetInfos.timeMagnetInfo.sizes.medium?.width??0,
    height: magnetInfos.timeMagnetInfo.sizes.medium?.height??0,
    size: MagnetSize.medium,
    editMode: false,
    selected: false
  },
  {
    id: `233`,
    type: magnetInfos.timeMagnetInfo.type,
    x: 6,
    y: 6,
    width: magnetInfos.timeMagnetInfo.sizes.medium?.width??0,
    height: magnetInfos.timeMagnetInfo.sizes.medium?.height??0,
    size: MagnetSize.medium,
    editMode: false,
    selected: false
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
    <component :is="magnet.type" v-bind:size="magnet.size"></component>
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
