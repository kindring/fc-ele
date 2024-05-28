<script setup lang="ts">
import {computed} from 'vue'
// import type {PropType} from 'vue'

let props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  svgHref: {
    type: String,
    default: '',
  },
  svgClass: {
    type: String,
    default: '',
  }
});

let svgClass = computed(() => `svg-icon ${props.svgClass ?? ''}`);
let _iconName = computed(() => `#icon-${props.iconName}`);

</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <image v-if="svgHref" :xlink:href="svgHref" />
    <use v-else :xlink:href="_iconName"/>
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
