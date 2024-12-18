<script setup lang="ts">
import IconSvg from "@/components/public/icon/iconSvg.vue";
import {useTemplateRef, computed, defineComponent, onMounted, ref, nextTick} from "vue";
import net from "net";

defineComponent({
  name: "kui-input"
})

const props = defineProps({
  formId: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  iconPosition: {
    type: String,
    default: 'left'
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const showPasswd = ref(false);
const labelWidth = ref(10);
const labelRef = useTemplateRef<HTMLInputElement>("label")
const value = defineModel('value', String)

const id = computed(
    () => {
      return props.formId + '_' + props.label
    }
)

const emit = defineEmits<{
  (e: 'firstClick', val: string): void
}>()

function getLabelWidth(){
  let el  = labelRef.value
  console.log('labelWidth:  ', el)
  if (el) {
    labelWidth.value = el.offsetWidth ;
    console.log('labelWidth:  ', labelWidth.value)
  }
}

onMounted(()=>{
  nextTick(()=>{
    getLabelWidth()
  })
})

function clickHandle(){
  emit('firstClick', value.value);
}

function changeHandle(e: Event){
  let nextVal = e.target.value
  value.value = nextVal
}

function passwordChangeHandle(){
  showPasswd.value = !showPasswd.value
}



</script>

<template>
  <div class="input-box">

      <input class="basic-slide"
             :id="id"
             :type="showPasswd ? 'text' : type"
             :value="value"
             :disabled="disabled"
             @change="changeHandle"
             :placeholder="placeholder"
             @click="clickHandle"
             :style="`--text-indent-value: ${labelWidth}px;`"
      />

    <label :for="id" ref="label">
      <slot></slot>
      {{ label }}
    </label>
      <div class="icon-box" v-if="type==='password'" @click="passwordChangeHandle">
        <icon-svg :icon-class="showPasswd ? 'eye-open' : 'eye-close'"></icon-svg>
      </div>
  </div>
</template>

<style scoped>
.input-box {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.input-box .icon-box{
  position: absolute;
  right: 5px;
  top: 0;
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.basic-slide {
  --text-indent-value: 0;
  display: inline-block;
  width: 100%;
  padding: 10px 0 10px calc(var(--text-indent-value) + 10px);
  font-family: "Open Sans", sans;
  font-weight: 400;
  color: #377D6A;
  background: #efefef;
  border: 0;
  border-radius: 3px;
  outline: 0;
  transition: all 0.3s ease-in-out;
}
.basic-slide::-webkit-input-placeholder {
  color: #858585;
  text-indent: 0;
  font-weight: 400;
}
.input-box > label {
  display: inline-flex;
  position: absolute;
  top: -1px;
  left: 0;
  height: 100%;
  padding: 0 15px;
  align-items: center;
  text-shadow: 0 1px 0 rgba(19, 74, 70, 0.4);
  background: #7AB893;
  transition: all 0.3s ease-in-out;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.basic-slide:focus, .basic-slide:active {
  color: #377D6A;
  text-indent: 0;
  padding-left: 15px;
  background: #fff;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 0 2px;
}
.basic-slide:focus::-webkit-input-placeholder, .basic-slide:active::-webkit-input-placeholder {
  color: #aaa;
}
.basic-slide:focus + label, .basic-slide:active + label {
  transform: translateX(-100%);
}


</style>
