<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "addScanDialog"
})

const emits = defineEmits<{
    (e: 'close' ): void,
    (e: 'submit'): void
}>()

function closeDialog() {
  emits('close');
}

</script>

<template>
  <div class="dialog-content">
    <div class="dialog-title">
      添加扫描路径
      <div
          class="close-btn"
          @click="closeDialog()">
        X
      </div>
    </div>

    <div class="dialog-show">

    </div>

  </div>
</template>

<style scoped>

</style>
