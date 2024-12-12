<script setup lang="ts">

import {defineComponent} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";

defineComponent({
  name: 'LickIcon',
})

defineProps({
  like: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div :class="`icon ${like?'like-icon':''}`">
    <icon-svg :icon-name="like?'heart-fill':'heart'"/>
  </div>
</template>

<style scoped>
.like-icon{
  color: var(--color-text-money)
}
</style>
