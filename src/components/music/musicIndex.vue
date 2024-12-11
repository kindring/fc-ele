<script setup lang="ts">
import {defineComponent, ref} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import {PlayList} from "@/types/musicType.ts";

defineComponent({
  name: "musicIndex"
})

const searchText = ref('');

const playList: PlayList = ref([
  {
    id: 0,

  }
])

</script>

<template>
  <div class="fc-app-window flex">
    <div class="side-bar">
      <div class="side-title">
        FC-MUSIC
      </div>

<!--      侧边栏 -->
      <div class="search-input">
        <input type="text" v-model="searchText" placeholder="搜索"/>
        <div class="icon-search">
          <IconSvg icon-name="search" />
        </div>
      </div>

<!--       主歌单 -->

    </div>
  </div>
</template>

<style scoped>
@import "../../assets/public.css";
.side-bar
{
  width: 210px;
  height: 100%;
  border-right: 1px solid var(--color-border);
}

.side-bar .side-title{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: larger;
  display: block;
  padding-left: 0.8em;
}

.search-input{
  width: calc( 100% - 20px);
  height: 40px;
  line-height: 40px;
  margin: 0 10px;
  border-radius: 0.5em;
  background-color: var(--color-background-soft);
  box-shadow: 1px 0 5px 0 var(--color-border);
  display: flex;
  position: relative;
}
.search-input input{
  width: 100%;
  height: 40px;
  line-height: 40px;
  border: none;
  background-color: transparent;
  padding-left: 10px;
  padding-right: 50px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.search-input .icon-search{
  width: 50px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-text);
  flex-shrink: 0;
  font-size: 1.5em;
  position: absolute;
  right: 0;
}

.search-input .icon-search:hover{
  color: var(--color-text-show);
  cursor: pointer;
}
.search-input .icon-search:active{
  color: var(--color-text-money);
}

</style>
