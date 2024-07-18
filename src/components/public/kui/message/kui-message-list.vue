<script setup lang="ts">
import {PropType} from "vue";
import {MessageItem} from "@/types/BaseTypes.ts";
import kuiMessage from "./kui-message.vue";

defineProps({
  list: { type: Array as PropType<MessageItem[]>, default: () => [] },
});
const emits = defineEmits<{
  (e: "close", id: string | number): void;
}>();

const onClose = (id: string | number) => emits("close", id);

</script>

<template>
  <TransitionGroup class="kui-message-list" name="fademsg" tag="ul">
    <template v-for="v in list" :key="`${v.id}`">
      <kui-message
          :id="v.id"
          :type="v.type"
          :text="v.content"
          :duration="v.duration"
          :closeable="v.closeable"
          @close="onClose"
      />
    </template>
  </TransitionGroup>
</template>

<style>
.kui-mask-message {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1001;
}
.kui-message-list {
  position: relative;
  top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  font-size: 16px;
}
.kui-message-list .kui-message {
  min-width: 80px;
  width: max-content;
  border-radius: 3px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 5px 8px;
  border: 1px solid #f0f0f0;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  line-height: 1;
  text-align: center;
  list-style: none;
  overflow: hidden;
  -webkit-appearance: none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.kui-message-list .kui-message-icon {
  font-size: 18px;
  margin-right: 6px;
}
.kui-message-list .info {
  color: #626161;
}
.kui-message-list .success {
  color: #52c41a;
}
.kui-message-list .error {
  color: #f5222d;
}
.kui-message-list .warning {
  color: #fa8c16;
}
.kui-message-list .loading {
  display: inline-block;
  color: #1677ff;
  animation: rotating 0.8s linear infinite;
  -webkit-animation: rotating 0.8s linear infinite;
}
.kui-message-list .kui-message-content {
  font-size: 14px;
  font-weight: normal;
  letter-spacing: .2px;
  color: #262626;
}
.kui-message-list .kui-message-close {
  margin-left: 6px;
}
.kui-message-list .kui-message-close .ri-close-line {
  color: #8c8c8c;
  cursor: pointer;
  transition: all 0.2s ease;
}
.kui-message-list .kui-message-close .ri-close-line::before {
  padding: 2px;
  border-radius: 10px;
  transition: all 0.2s ease;
}
.kui-message-list .kui-message-close .ri-close-line:hover {
  color: #595959;
}
.kui-message-list .kui-message-close .ri-close-line:hover::before {
  background-color: #f0f0f0;
  transition: all 0.2s ease;
}
@keyframes rotating {
  from {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
    -webkit-transform: rotate(365deg);
  }
}
.fademsg-move,
.fademsg-enter-active,
.fademsg-leave-active {
  transition: all 0.2s cubic-bezier(0, 0, 1, 1);
}
.fademsg-enter-from,
.fademsg-leave-to {
  opacity: 0;
}
.fademsg-leave-active {
  position: absolute;
}
</style>
