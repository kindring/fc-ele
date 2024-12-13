<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  },
  // 挂载目标
  mountTarget: {
    type: String,
    default: '#kui-root'
  }
})
defineEmits(['close'])

// function closeHandle() {
//   emit('closeEvent');
//   console.log('closeHandle')
// }
// function findDom (t = 0 ){
//   let dom = document.getElementById('#kui-dialog')
//   if(!dom && t < 10)
//   {
//     setTimeout(() => {
//       return findDom(t++)
//     }, 1000)
//   }
//   // 尝试获取body
//   dom = document.body
//   return dom
// }
//
// function eventBind(){
//   window.addEventListener('click', (e) => {
//   console.log(e.target)
//   let parentDom = findDom();
//   if (e.target != parentDom){
//     e.preventDefault()
//     e.stopPropagation()
//   }
//   }, true)
// }
// 给插入位置的dom组件添加事件, 屏蔽所有事件

</script>

<template>
  <Teleport :defer="true" :to="mountTarget" >
    <div v-if="show" :class="className">
      <slot></slot>
    </div>
  </Teleport>
</template>

<style scoped>

</style>
