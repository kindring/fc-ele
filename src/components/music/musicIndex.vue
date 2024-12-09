<script setup lang="ts">
import {defineComponent} from "vue";

defineComponent({
  name: "musicIndex"
})
</script>

<template>
  <div class="fc-app-window flex">
    <div class="side-bar">
      <div class="side-title">
        FC-MUSIC
      </div>

<!--      侧边栏 -->
      <div class="search-input">

      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/public.css";
.side-bar
{
  width: 210px;
  height: 100%;
  border-right: 1px solid var(--color-border);
}

.side-bar .side-title{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: larger;
  display: block;
  padding-left: 0.8em;
}

</style>
