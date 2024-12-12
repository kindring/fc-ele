<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "emptyView"
})
</script>

<template>
<div class="empty-view">
  <div class="empty-view-content">
      <div class="empty-view-content-title-text">
        <div class="empty-view-content-title-text-title">
          暂无数据
        </div>
        <div class="empty-view-content-title-text-subtitle"></div>
      </div>
  </div>
</div>
</template>

<style scoped>
.empty-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>