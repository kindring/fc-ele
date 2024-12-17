<script >
import IconSvg from "@/components/public/icon/iconSvg.vue";

export default {
  name: "kui-input",
  components: {IconSvg},
  props: {
    formId: {
      type: String,
      default: ''
    },
    value: {
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

  },
  data() {
    return {
      inputValue: this.value,
      showPassword: false,
      labelWidth: 10
    }
  },
  computed: {
    id(){
      // 随机字符加上指定的id
      return this.formId + '_' + this.label
    }
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal
    }
  },
  mounted() {
    this.labelWidth = this.comIndent()
  },
  methods: {
    clickHandle(){
      this.$emit('firstClick', this.inputValue);
    },
    changeHandle(e){
      let nextVal = e.target.value
      this.inputValue = nextVal
      this.$emit('input', this.inputValue)
    },
    passwordChangeHandle(){
      this.showPassword = !this.showPassword
    },
    comIndent() {
      // 获取label的长度, 计算input的缩进长度
      let labelWidth = this.$refs.label.offsetWidth
      return labelWidth
    }
  }
}
</script>

<template>
  <div class="input-box">

      <input class="basic-slide"
             :id="id"
             :type="showPassword ? 'text' : type"
             :value="inputValue"
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
        <icon-svg :icon-class="showPassword ? 'eye-open' : 'eye-close'"></icon-svg>
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
  padding: 10px 0 10px 15px;
  font-family: "Open Sans", sans;
  font-weight: 400;
  color: #377D6A;
  background: #efefef;
  border: 0;
  border-radius: 3px;
  outline: 0;
  text-indent: var(--text-indent-value);
  transition: all 0.3s ease-in-out;
}
.basic-slide::-webkit-input-placeholder {
  color: #efefef;
  text-indent: 0;
  font-weight: 300;
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
