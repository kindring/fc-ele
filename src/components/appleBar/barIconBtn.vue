<script setup lang="ts">
defineProps({
  iconName: {
    type: String,
  },
  description: {
    type: String,
    default: '',
  },
  active: {
    type: Boolean,
    default: false,
  }
})
</script>

<template>
  <div class="appleItem" >
    <div :class="`appleItem showCenterTip ${active?'active':''}`">
      <div class="appleItem-content">
        <div v-if="description" class="showTip">{{description}}</div>
        <icon-svg class="icon" :icon-name="iconName"></icon-svg>
      </div>
    </div>
  </div>
</template>

<style scoped>

.appleItem{
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  font-size: 20px;
  font-weight: bold;
  color: var(--color-text);
  cursor: pointer;
  opacity: 0.8;
}
.appleItemGroup .active{
  color: var(--color-text-show);
  transform: scale(1.25);;
}
.appleItem-content{
  width: 45px;
  height: 45px;
  border-radius: 50%;
  box-shadow: 0 0 3px 0 var(--color-text);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.8s;
  background-color: var(--color-background-soft);
}

.appleItem .icon{
  height: 100%;
  font-size: 1.5em;
  color: var(--color-text);
  transition: all 0.8s;
}
.appleItemGroup .active .icon{
  color: var(--color-text-show);
}

.appleItem:hover .appleItem-content, .appleUser:hover .appleItem-content{
  transform: scale(1.35);
  box-shadow: 0 0 10px 0 rgba(0,0,0,0.2);
  color: var(--color-text);
  background-color: var(--color-background-soft);
  transition: all 0.8s;
}


</style>
