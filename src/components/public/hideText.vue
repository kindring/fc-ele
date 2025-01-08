<script setup lang="ts">
import {copyText} from "@/util/copy.ts";

const props = defineProps(
    {
      text: {
        type: String,
        default: ""
      },
      enableCopy: {
        type: Boolean,
        default: false
      },
      copySuccess: {
        type: Function,
        default: () => {}
      }
    }
);

async function copyClickHandle() {
  if (props.enableCopy) {
     let bool = await copyText(props.text);
     if (bool && props.copySuccess) {
       props.copySuccess();
     }
  }
}
</script>

<template>
<div class="text-view showCenterTip" @click="copyClickHandle">
  <div class="showTip">{{text}}</div>
  <div class="text-con">
    <slot>{{text}}</slot>
  </div>
</div>
</template>

<style scoped>
.text-view {
  width: 100%;
  height: 100%;
  position: relative;
}
.text-con{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.showTip{
  position: absolute;
  top: -60px;
  left: 0;
  right: unset;
  width: auto;
  padding: 0 15px;
}

</style>
