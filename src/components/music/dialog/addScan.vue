<script setup lang="ts">
import {defineComponent, ref} from "vue";
import KuiInput from "@/components/public/kui/kui-input.vue";
import message from "@/components/public/kui/message";
import {selectScanDir} from "@/apis/musicControl.ts";

defineComponent({
  name: "addScanDialog"
})

const emits = defineEmits<{
    (e: 'close' ): void,
    (e: 'submit'): void
}>()

const dirPath = ref('');

function closeDialog() {
  emits('close');
}

async function selectPathHandle() {
  let responseData = await selectScanDir(dirPath.value);
  // console.log(responseData)
  if (responseData.code === 0) {
    dirPath.value = responseData.data;
    // message.success(`选择目录: ${responseData.data}`);
  } else {
    message.error(responseData.msg);
  }
}

</script>

<template>
  <div class="dialog-content form-dialog">
    <div class="dialog-title">
      添加扫描路径
      <div
          class="close-btn"
          @click="closeDialog()">
        X
      </div>
    </div>

    <div class="dialog-show">
      <div class="form-row" >
        <kui-input label="扫描路径"
                   placeholder="点击选择文件"
                   @firstClick="selectPathHandle"
                   :value="dirPath"
        />
      </div>

    </div>
    <div class="dialog-footer">
      <div class="btn cancel-btn mr-2" @click="closeDialog()">取消</div>
      <div class="btn primary-btn" @click="emits('submit')">确定</div>
    </div>

  </div>
</template>

<style scoped>
.form-row{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
</style>
