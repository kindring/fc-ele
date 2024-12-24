<script setup lang="ts">

defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  okText: {
    type: String,
    default: '确定'
  },
  showCancel: {
    type: Boolean,
    default: true
  }
});


const emits = defineEmits<{
  (e: 'cancel' ): void,
  (e: 'ok'): void
}>()

const closeHandle = () => {
  emits('cancel')
}
const submitHandle = () => {
  emits('ok')
}
</script>

<template>
  <div class="alert-dialog">
    <div class="alert-title">
      <span class="title-text">{{title}}</span>
    </div>
    <div class="alert-content">
      {{content}}
    </div>
    <div class="alert-footer">
      <div v-if="showCancel" class="btn" @click.prevent="closeHandle">{{ cancelText }}</div>
      <div class="btn btn-primary" @click.prevent="submitHandle" >{{ okText }}</div>
    </div>
  </div>
</template>

<style scoped>
.alert-dialog
{
  width: 270px;
  height: auto;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.alert-dialog .alert-title
{
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px;
  font-size: 1.3em;
}
.alert-content
{
  width: 100%;
  height: auto;
  padding: 8px 10px;
  text-wrap: avoid;
  box-sizing: border-box;
  overflow: auto;
  max-height: 300px;
}
.alert-footer
{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.alert-footer .btn
{
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #f5f5f5;
  color: #333;
}
.alert-footer .btn:hover
{
  background-color: #e6e6e6;
  color: #666;
}
.alert-footer .btn-primary
{
  background-color: #409eff;
  color: #fff;
}
</style>
