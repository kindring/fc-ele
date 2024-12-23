<script setup lang="ts">
import {defineComponent, onMounted, PropType, ref} from "vue";
import KuiInput from "@/components/public/kui/kui-input.vue";
import message from "@/components/public/kui/message";
import {addScanDir, selectScanDir} from "@/apis/musicControl.ts";
import KuiCheckbox from "@/components/public/kui/kui-checkbox.vue";
import {MusicScanSetting} from "@/types/musicType.ts";

defineComponent({
  name: "addScanDialog"
})

const props = defineProps({
  scanSetting: {
    type: Object as PropType<MusicScanSetting>,
    default: () => {
      return {
        id: -1,
        name: '',
        path: '',
        scanSubDir: false,
        isFileRepeat: false
      }
    }
  }
  }
)

const emits = defineEmits<{
    (e: 'close' ): void,
    (e: 'submit'): void
}>()

const isEdit = ref(false);
const name = ref('');
const dirPath = ref('');
const scanSubDir = ref(false);
const isFileRepeat = ref(false);

onMounted(()=>{
  console.log(props.scanSetting);
  if ( props.scanSetting && props.scanSetting.id > 0) {
    isEdit.value = true;
    name.value = props.scanSetting.name;
    dirPath.value = props.scanSetting.path;
    scanSubDir.value = props.scanSetting.scanSubDir;
    isFileRepeat.value = props.scanSetting.isFileRepeat;
  }
})

function closeDialog() {
  emits('close');
}


async function selectPathHandle() {
  let responseData = await selectScanDir(dirPath.value);
  // console.log(responseData)
  if (responseData.code === 0) {

    dirPath.value = responseData.data ? responseData.data : dirPath.value;
    // message.success(`选择目录: ${responseData.data}`);
  } else {
    message.error(responseData.msg);
  }
}

async function submitHandle() {
  let param: MusicScanSetting = {
    id: 0,
    name: name.value,
    path: dirPath.value,
    scanSubDir: scanSubDir.value,
    isFileRepeat: isFileRepeat.value
  }
  if (!param.path)
  {
    message.warning('请选择需要扫描的子目录');
    return;
  }
  if (!param.name)
  {
    param.name = param.path;
  }
  let responseData = await addScanDir(param);
  if (responseData.code === 0) {
    message.success('添加扫描配置成功');
    emits('close');
  } else {
    message.error(responseData.msg);
  }
}

</script>

<template>
  <div class="dialog-content form-dialog">
    <div class="dialog-title">
      {{ isEdit? '编辑扫描路径' : '新增扫描路径' }}
      <div
          class="close-btn"
          @click="closeDialog()">
        X
      </div>
    </div>

    <div class="dialog-show">
      <div class="form-row" >
        <kui-input label="文件名称"
                   placeholder="扫描配置名称"
                   v-model:value="name"
        />
      </div>
      <div class="form-row mt-1" >
        <kui-input label="扫描路径"
                   placeholder="点击选择文件"
                   @firstClick="selectPathHandle"
                   :value="dirPath"
        />
      </div>

      <div class="form-row mt-1">
        <kui-checkbox id="scanSubDir" v-model:value="scanSubDir" >
          扫描子目录
        </kui-checkbox>
      </div>

      <div class="form-row mt-1">
        <kui-checkbox id="isFileRepeat" v-model:value="isFileRepeat" >
          文件是否允许重复
        </kui-checkbox>
      </div>

    </div>
    <div class="dialog-footer">
      <div class="btn cancel-btn mr-2" @click="closeDialog()">取消</div>
      <div class="btn primary-btn" @click="submitHandle">确定</div>
    </div>

  </div>
</template>

<style scoped>
.form-row{
  width: 90%;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 0 auto;
}
</style>
