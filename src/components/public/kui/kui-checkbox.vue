<script setup lang="ts">
import {computed, defineComponent, Ref, ref} from "vue";

defineComponent({
  name: "kui-checkbox"
})

const props = defineProps({
  id: {
    type: String,
    default: 'kui-checkbox'
  },
  label: {
    type: String,
    default: ''
  }
})

const checked: Ref<boolean> = ref(props.value)

const value = defineModel('value', Boolean)

// const emit = defineEmits<{
//   (e: 'input', val: boolean): void
// }>()

const checkedVal = computed(() => {
  return checked.value
})

function changeHandle() {
  // checked.value = !checked.value
  value.value = !value.value
}

</script>

<template>
  <div class="checkbox">
    <input class="styled-checkbox" :id="id" type="checkbox" :checked="value" @click="changeHandle">
    <label for="styled-checkbox-4" @click="changeHandle">
      <slot></slot>
    </label>
  </div>

</template>

<style scoped>
.checkbox-line {
  width: 100%;
}
.styled-checkbox {
  position: absolute;
  opacity: 0;
}
.styled-checkbox + label {
  position: relative;
  cursor: pointer;
  padding: 0;
  user-select: none;
}
.styled-checkbox + label:before {
  content: "";
  margin-right: 10px;
  display: inline-block;
  vertical-align: text-top;
  width: 20px;
  height: 20px;
  background: white;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.styled-checkbox:hover + label:before {
  background: #f35429;
}
.styled-checkbox:focus + label:before {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}
.styled-checkbox:checked + label:before {
  background: #f35429;
}
.styled-checkbox:disabled + label {
  color: #b8b8b8;
  cursor: auto;
}
.styled-checkbox:disabled + label:before {
  box-shadow: none;
  background: #ddd;
}
.styled-checkbox:checked + label:after {
  content: "";
  position: absolute;
  left: 5px;
  top: 9px;
  background: white;
  width: 2px;
  height: 2px;
  box-shadow: 2px 0 0 white, 4px 0 0 white, 4px -2px 0 white, 4px -4px 0 white, 4px -6px 0 white, 4px -8px 0 white;
  transform: rotate(45deg);
}
</style>
