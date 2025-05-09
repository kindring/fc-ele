<script setup lang="ts">
import {defineComponent, nextTick, onBeforeMount, Reactive, reactive, Ref, ref} from "vue";
import {MusicScanSetting} from "@/types/musicType.ts";
import EmptyView from "@/components/public/emptyView.vue";
import {KuiDialogCmd, showAlert} from "@/components/public/kui-dialog-cmd.ts";

import addScanDialog from "@/components/music/dialog/addScan.vue"
import message from "@/components/public/kui/message";
import {deleteScanConfig, fetchScanConfig} from "@/apis/musicControl.ts";
import {ErrorCode} from "@/types/apiTypes.ts";
import IconSvg from "@/components/public/icon/iconSvg.vue";

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
    onSubmit: testFn,
  },
  onClose: closeScanDialogHandle
});

function closeScanDialogHandle()
{
  fetchScanSetting();
  return true;
}

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
}

onBeforeMount(()=>{
  fetchScanSetting();
})


function editScanHandle(item: MusicScanSetting)
{
  console.log('editScanHandle', item)
  kuiDialog.show({scanSetting: {
    id: item.id,
    name: item.name,
    path: item.path,
    scanSubDir: !!item.scanSubDir,
    isFileRepeat: !!item.isFileRepeat
    }});
}

async function exe_deleteScan(id: number)
{
  let responseData = await deleteScanConfig(id);
  if (responseData.code === ErrorCode.success)
  {
    message.success(`删除成功`);
    await fetchScanSetting();
  } else{
    message.error(responseData.msg);
  }
}

async function deleteScanHandle(id: number)
{
  showAlert({
    title: '删除扫描配置',
    content: `确定要删除该扫描配置? id:${id}`,
    onOk: () => {
      exe_deleteScan(id)
    }
  }, props.windowId);
}

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
          <div class="line-row">{{ item.path }}</div>
          <div class="line-row">
            <span class="label">扫描子目录: </span>
            <span class="value"> {{ item.scanSubDir ? '是' : '否' }}</span>

          </div>
          <div class="line-row">
            <span class="label">是否允许重复文件:</span>
            <span class="value"> {{ item.isFileRepeat ? '是' : '否' }}</span>
          </div>
        </div>
        <div class="edit-btn circle-btn" @click="editScanHandle(item)">
          <icon-svg icon-name="edit"/>
        </div>
        <div class="delete-btn circle-btn" @click="deleteScanHandle(item.id)">
          <icon-svg icon-name="remove"/>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped>
@import "../../../assets/public.css";
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
  height: 140px;
  border-radius: 1rem;
  margin: 20px auto 0;
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: var(--color-background-mute);
  position: relative;
}
.scan-item .scan-title{
  width: 100%;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
}
.line-row {
  height: 30px;
}
.line-row .label{
  width: 9rem;
}
.line-row .value{
  width: calc(100% - 9rem);
}
.edit-btn{
  position: absolute;
  right: 40px;
  top: 5px;
  width: 30px;
  height: 30px;
  font-size: 1.4rem;
}
.edit-btn:hover{
  background-color: var(--color-btn-bg-hover);
  color: var(--color-btn-text-hover);
}
.delete-btn{
  position: absolute;
  right: 5px;
  top: 5px;
  width: 30px;
  height: 30px;
  font-size: 1.4rem;
}
.delete-btn:hover{
  background-color: var(--color-btn-bg-hover);
  color: var(--color-btn-text-hover);
}



</style>
