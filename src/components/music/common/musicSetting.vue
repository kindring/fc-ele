<script setup lang="ts">
import {defineComponent, ref} from "vue";
import MSettingScan from "@/components/music/common/mSettingScan.vue";
import MSettingCould from "@/components/music/common/mSettingCould.vue";

defineComponent({
  name: 'musicSetting',
})

defineProps({
  windowId: {
    type: String,
    default: ''
  }
})

interface TabItem {
  name: string;
  key: string;
}
const keyScan = 'keyScanSetting'
const keyCloud = 'keyCloudSetting'
const showTabKey = ref(keyScan)
const tabList: TabItem[] = [
  {
    name: '扫描配置',
    key: keyScan
  },
  {
    name: '云同步配置',
    key: keyCloud
  }
]
function changeTabHandle (item: TabItem)
{
  showTabKey.value = item.key
}




</script>

<template>
  <div class="musicSetting">
    <div class="title">音乐设置{{windowId}}</div>
    <div class="head">
      <div v-for="(item, index) in tabList"
           :key="index"
           :class="`tab ${item.key === showTabKey?'tab-select':''}`"
           @click="changeTabHandle(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="view-con">
      <m-setting-scan v-if="showTabKey === keyScan" :window-id="windowId"/>
      <m-setting-could v-else-if="showTabKey === keyCloud"/>
    </div>


  </div>
</template>

<style scoped>

.musicSetting{
  width: 100%;
  height: 100%;
}
.title{
  font-size: 1.6rem;
  height: 70px;
  line-height: 70px;
  padding: 0 20px;
  color: var(--color-text-show);
}
.head{
  display: flex;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #ccc;
}
.tab{
  padding: 0 20px;
  font-size: 1.2rem;
}
.tab:active, .tab-select{
  color: var(--color-text-show);
  border-bottom: 2px solid var(--color-text-show);
}
.view-con{
  width: 100%;
  height: calc(100% - 108px);
}
</style>
