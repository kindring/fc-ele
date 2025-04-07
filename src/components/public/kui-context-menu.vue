<script setup lang="ts">
import {computed, ref, nextTick, CSSProperties, onUnmounted} from 'vue'
import {KuiMenuItem, KuiPosition} from "@/components/public/kui-dialog-type.ts";

// import KuiContextMenu from "./kui-context-menu.vue"
defineOptions({
  name: 'KuiContextMenu'
})

const props = defineProps<{
  position: KuiPosition
  menuItems: KuiMenuItem[]
  parentElement?: HTMLElement
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const menuRef = ref<HTMLElement>()
const subMenuRefs = ref(new Map<number, HTMLElement>())
const activeSubMenu = ref<number | null>(null)

// 样式计算
const menuStyle = computed<CSSProperties>(() => {
  const style: CSSProperties = {
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    visibility: 'visible'
  }

  nextTick(() => {
    if (!menuRef.value)
    {
      console.log('menuRef is null !!!!!!!!!! ')
      return style
    }

    const rect = menuRef.value.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // 水平调整
    if (rect.right > viewportWidth) {
      style.left = `${viewportWidth - rect.width - 8}px`
    } else if (rect.left < 0) {
      style.left = '8px'
    }

    // 垂直调整
    if (rect.bottom > viewportHeight) {
      if (rect.height > viewportHeight) {
        style.maxHeight = `${viewportHeight - 20}px`
        style.top = '10px'
      } else {
        style.top = `${viewportHeight - rect.height - 8}px`
      }
    } else if (rect.top < 0) {
      style.top = '8px'
    }

    style.visibility = 'visible'
  })

  return style
})

// 子菜单样式计算
const getSubMenuStyle = (index: number): CSSProperties => {
  const parentRect = subMenuRefs.value.get(index)?.getBoundingClientRect()
  if (!parentRect) return { visibility: 'hidden' }

  return {
    left: `${parentRect.right + 4}px`,
    top: `${parentRect.top}px`,
    maxHeight: `${window.innerHeight - parentRect.top - 10}px`
  }
}

const closeMenu = () => {
  emit('close')
}

const handleItemClick = (item: KuiMenuItem) => {
  if (item.disabled) return
  item.action?.()
  closeMenu()
}

const handleSubMenuToggle = (index: number, show: boolean) => {
  activeSubMenu.value = show ? index : null
}

// 点击外部关闭
const clickOutsideHandler = (e: MouseEvent) => {
  if (!menuRef.value?.contains(e.target as Node)) {
    closeMenu()
  }
}

// 键盘事件
const keydownHandler = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeMenu()
}

// 事件监听
nextTick(()=>{
  window.addEventListener('click', clickOutsideHandler, { passive: true, capture: true})
  window.addEventListener('contextmenu', clickOutsideHandler, { passive: true, capture: true })
  window.addEventListener('keydown', keydownHandler, { passive: true, capture: true })
})


// 清理
onUnmounted(() => {
  window.removeEventListener('click', clickOutsideHandler)
  window.removeEventListener('contextmenu', clickOutsideHandler)
  window.removeEventListener('keydown', keydownHandler)
})

</script>

<template>
  <div
      ref="menuRef"
      class="context-menu"
      :style="menuStyle"
  >
    <div
        v-for="(item, index) in menuItems"
        :key="item.label"
        ref="el => subMenuRefs.set(index, el as HTMLElement)"
        class="menu-item"
        :class="{ disabled: item.disabled, 'has-children': item.children }"
        @mouseenter="handleSubMenuToggle(index, true)"
        @mouseleave="handleSubMenuToggle(index, false)"
        @click.stop="handleItemClick(item)"
    >
      <span class="menu-item-content">
        <i v-if="item.icon" :class="item.icon" />
        {{ item.label }}
      </span>
      <i v-if="item.children" class="arrow" />

<!--      <KuiContextMenu-->
<!--          v-if="item.children && activeSubMenu === index"-->
<!--          :menu-items="item.children"-->
<!--          :position="getSubMenuStyle(index)"-->
<!--          class="sub-menu"-->
<!--      />-->
    </div>
  </div>
</template>

<style scoped>
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 9999;
  overflow-y: auto;
}

.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item.disabled {
  color: #999;
  cursor: not-allowed;
}

.arrow {
  border: solid #666;
  border-width: 0 1px 1px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  margin-left: 10px;
}

.sub-menu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 2px;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
