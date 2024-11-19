<script setup lang="ts">
import {ApplicationInfo} from "@/types/application.ts";
import {computed, PropType, ref} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";

const props = defineProps({
  appList: {
    type: Array as PropType<ApplicationInfo[]>,
    default: ():ApplicationInfo[] => []
  }
})

const searchKey = ref("")

const showAppList = computed(() => {
  if (searchKey.value === "") return props.appList
  return props.appList.filter(item => {
    return item.en.includes(searchKey.value) ||
    item.name.includes(searchKey.value) ||
    item.pinyin.includes(searchKey.value)
  })
})

const emits = defineEmits<{
  (e: "open", id: string): void
}>()

function openApp(key: string) {
  // emit
  emits("open", key)
}

</script>

<template>
<div class="full">
  <div class="list-content">
    <div class="app-list-item"
         v-for="item in showAppList"
         :key="item.key"
         @click="openApp(item.key)"
    >
      <div class="list-item-icon">
        <icon-svg :icon-name="item.icon" />
      </div>
      <div class="list-item-name">
        {{item.name}}
      </div>
    </div>
  </div>
  <div class="list-search">
    <input type="text" v-model="searchKey" placeholder="搜索应用" />
    <IconSvg icon-name="search" svg-class="icon-search" />
  </div>
</div>
</template>

<style scoped>
.full{
  position: relative;
}
.list-content{
  width: 100%;
  height: calc(100% - 40px);
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 5px;
  overflow-y: auto;
}
.list-search{
  width: 50%;
  height: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.app-list-item{
  width: 80px;
  height: 100px;
  cursor: pointer;
  margin: 0 10px;
}
.app-list-item:hover{
  color: #1b88de;
}
.list-item-icon{
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
}
.list-item-name{
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
}
.list-search input{
  display: inline-block;
  width: 100%;
  height: 30px;
  border: none;
  outline: none;
  background-color: var(--color-background-mute);
  padding: 0 5px 0 35px;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 0 3px #9b9b9b;
}

.list-search input::placeholder{
}
.list-search input:focus{
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-background);
  color: var(--color-text-show);
}
.list-search .icon-search{
  width: 20px;
  height: 20px;
  margin-right: 5px;
  fill: var(--color-text-money);
  position: absolute;
  /* top: -1px; */
  left: 5px;
  font-size: 0.8em;
  color: #1a1a1a;
}
</style>
