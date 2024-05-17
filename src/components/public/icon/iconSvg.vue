<script setup lang="ts">
import {computed} from 'vue'
// import type {PropType} from 'vue'

let props = defineProps({
  iconClass: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: '',
  },
});

let svgClass = computed(() => `svg-icon ${props.className ?? ''}`);

let iconName = computed(() => `#icon-${props.className}`);

</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"/>
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
