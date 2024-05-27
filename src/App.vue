<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'

import {onMounted, ref} from "vue";
import MacWindow from "./components/window/macWindow.vue";
import MagnetView from "./components/magnetView.vue";

onMounted(() => {

});


const title = ref("fc-ele");

</script>

<template>
  <mac-window :title="title" :icon="'home'">
    <magnet-view>
    </magnet-view>
  </mac-window>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}


</style>
