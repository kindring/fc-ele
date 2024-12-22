<script setup lang="ts">
import {defineComponent, onBeforeMount, Ref, ref} from "vue";
import {MusicScanSetting} from "@/types/musicType.ts";
import EmptyView from "@/components/public/emptyView.vue";
import {KuiDialogCmd} from "@/components/public/kui-dialog-cmd.ts";

import addScanDialog from "@/components/music/dialog/addScan.vue"
import message from "@/components/public/kui/message";
import {fetchScanConfig} from "@/apis/musicControl.ts";
import {ErrorCode} from "@/types/apiTypes.ts";

defineComponent({
  name: 'm-setting-scan'
})

const props  = defineProps({
  windowId: {
    type: String,
    default: ''
  }
})

const scanSetting: Ref<MusicScanSetting[]> = ref([]);

function testFn(){
  message.info('test')
}



const kuiDialog = new KuiDialogCmd({
  showContent: addScanDialog,
  mountTarget: props.windowId,
  className: 'dialog',
  on: {
    onSubmit: testFn
  }
});
function openDialog()
{
  if(!kuiDialog.isShow())
  {
    kuiDialog.show();
  } else {
    kuiDialog.hide();
  }
}

async function fetchScanSetting()
{
  let responseData = await fetchScanConfig();
  if (responseData.code === ErrorCode.success)
  {
    scanSetting.value = responseData.data;
  }
  console.log(responseData);
}

onBeforeMount(()=>{
  fetchScanSetting();
})

</script>

<template>
  <div class="full scroll">
    <div class="btn-group">
      <div class="btn" @click="openDialog">创建扫描配置</div>
    </div>
    <div class="scan-view scroll">
      <empty-view v-if="scanSetting.length === 0"/>

      <div class="scan-item" v-for="(item,index) in scanSetting" :key="index">
        <div class="scan-title">
          {{ item.name }}
        </div>
        <div class="scan-content">
          <div class="scan-item-content">{{ item.path }}</div>

        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
.btn-group{
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: flex-start;
}
.btn{
  background-color: var(--color-btn-bg);
  color: var(--color-btn-text);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
.btn:hover{
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: var(--color-btn-bg-hover);
  color: var(--color-btn-text-hover);
}
.btn:active{
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  background-color: var(--color-btn-bg-active);
  color: var(--color-btn-text-active);
}

.scan-view{
  width: 100%;
  height: calc(100% - 60px);
}

.scan-item{
  width: calc(100% - 40px);
  height: 120px;
  border-radius: 1rem;
  margin: 20px auto 0;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: var(--color-background-mute);
}
.scan-item .scan-title{
  width: 100%;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
}


</style>
