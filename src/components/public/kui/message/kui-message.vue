<script setup lang="ts">

import {NotifyType} from "@/types/BaseTypes.ts";
import {nextTick, onMounted, onUnmounted, PropType, ref} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";

const props = defineProps({
  id: {type: [String, Number], default: ""},
  type: {
    type: String as PropType<NotifyType>,
    default: NotifyType.info
  },
  text: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 2000
  },
  // 是否可关闭
  closeable: {
    type: Boolean,
    default: false
  },
})
const emits = defineEmits<{
  close: [id: string | number];
}>();

const timer = ref(0);
const init = () => {
  if (props.duration > 0 && props.type !== NotifyType.Loading) {
    console.log("timer", props.duration)
    timer.value = window.setTimeout(handleClose, props.duration);
  }
};
const clearTimer = () => {
  if (timer) {
    window.clearTimeout(timer.value);
    timer.value = 0;
  }
};

const handleClose = () => {
  emits("close", props.id);
};

onMounted(() => {
  nextTick(() => init());
});

onUnmounted(() => {
  clearTimer();
});


</script>

<template>
    <li class="kui-message" >
      <icon-svg :class="`kui-message-icon ${type}`" :icon-name="type"></icon-svg>
      <span>{{text}}</span>
      <span v-if="closeable" class="kui-message-close" @click="handleClose">
        <icon-svg icon-name="close"></icon-svg>
      </span>
    </li>
</template>

<style scoped>
</style>
