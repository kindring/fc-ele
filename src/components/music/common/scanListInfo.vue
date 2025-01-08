<script setup lang="ts">
import {MusicInfo, MusicScanSetting, param_music_like} from "@/types/musicType.ts";
import {defineEmits, onBeforeMount, PropType, ref, watch} from "vue";
import LickIcon from "@/components/music/common/lickIcon.vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import message from "@/components/public/kui/message";
import {api_likeMusic, fetchScanMusic} from "@/apis/musicControl.ts";
import {ErrorCode} from "@/types/apiTypes.ts";
import {secondToTimeStr} from "@/util/time.ts";
import {music_action_emits, Music_Action_events} from "@/components/music/music_emits.ts";
import HideText from "@/components/public/hideText.vue";

const props = defineProps({
  scanSetting: {
    type: Object as PropType<MusicScanSetting>,
    default: () => ({})
  }
})


let scanSetting_id = ref(0)
const scanCount = ref(0)
const musicList = ref<MusicInfo[]>([])
const search_key = ref("");
const search_page = ref(1);
const page_limit = 10;
const lock_loading = ref(false);
async function loadMusic(scanSetting: MusicScanSetting, page: number, key: string = '')
{
  console.log("loadMusic");
  if (lock_loading.value)
  {
    message.info("正在加载中，请稍后");
    return;
  }
  lock_loading.value = true;
  let res = await fetchScanMusic(scanSetting.id, page, page_limit, key)
  lock_loading.value = false;
  if (res.code === ErrorCode.success)
  {
    if (page === 1)
    {
      scanCount.value = res.data.total?? 0;
    }

    let pageData = res.data.data ;
    for ( let i = 0; i < pageData.length; i++)
    {
      pageData[i].isLike = !!pageData[i].isLike;
      pageData[i].isLocal = !!pageData[i].isLocal;
      musicList.value.push(pageData[i]);
    }
  }
  else {
    message.error(res.msg);
  }
}

watch(()=>props.scanSetting, ()=>{
  if (scanSetting_id.value !== props.scanSetting.id)
  {
    musicList.value = [];
    loadMusic(props.scanSetting, 1, search_key.value);
  }
})

let load_more_repeat = 0;
async function loadMore()
{
  if (musicList.value.length >= scanCount.value)
  {
    load_more_repeat++;
    if (load_more_repeat > 3)
    {
      message.info("没有更多数据了");
      load_more_repeat = 0;
      return;
    }
    return;
  }
  search_page.value++;
  message.info("加载剩余数据");
  await loadMusic(props.scanSetting, search_page.value, search_key.value);
}

onBeforeMount(()=>{
  loadMusic(props.scanSetting, search_page.value, search_key.value);
})
const music_action_emits = defineEmits<{
  (e: Music_Action_events.play_music , music: MusicInfo): void,
}>()

function playMusic(item: MusicInfo) {
  console.log(item);
  message.info(`play ${item.name}`);
  music_action_emits(Music_Action_events.play_music, item);
}

async function likeMusic(item: MusicInfo) {
  // console.log(item);
  // message.info(`like ${item.name}`);
  let nextLike = !item.isLike;
  let param: param_music_like = {
    musicId: item.id,
    isLike: nextLike
  }
  let res = await api_likeMusic(param);
  if (res.code === ErrorCode.success)
  {
    item.isLike = nextLike;
  }
  else {
    message.error(res.msg);
  }
}
function showMore(item: MusicInfo) {
  console.log(item);
  message.info(`show ${item.name}`);
}

// todo 下拉菜单

</script>

<template>
<div class="scan-list-info">
  <div class="info">
    <div class="name">{{scanSetting.name}}</div>
    <div class="path">{{scanSetting.path}}</div>
    <div class="line-row">
      <span class="label">扫描数量</span>
      <span class="value">{{scanCount}}</span>
    </div>

  </div>

  <div class="music-lists">
    <div class="music-list-head">
      <div class="music-list-item">
        <div class="cover">

        </div>
        <div class="item-info">曲名</div>
        <div class="origin">来源</div>
        <div class="duration">时长</div>
        <div class="isLike">操作</div>
      </div>
    </div>
<!--    让下面框在滑动到底部时自动加载下一级数据 -->
    <div class="music-list-con scroll" @scrollend="loadMore()">
      <div v-for="item in musicList"
           class="music-list-item"
           @click="playMusic(item)"
      >
        <div class="cover">
          <img :src="item.cover" alt=""/>
        </div>
        <hide-text class="item-info"
                   :text="item.name"
                   :enable-copy="true"
                   :copy-success="()=>{message.success('复制歌曲名称成功')}"
        >
          <div class="name">{{item.name}}</div>
          <div class="artists">{{item.artists}}</div>
        </hide-text>
        <div class="origin">{{item.origin}}</div>
        <div class="duration">{{ secondToTimeStr(item.duration, "m分s秒" )}}</div>
        <lick-icon class="isLike" :like="item.isLike"
                   @click.stop.capture="likeMusic(item)"/>
        <div class="more">
          <icon-svg icon-name="more" @click.stop.capture="showMore(item)"></icon-svg>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<style scoped>
@import "../../../assets/public.css";
.scan-list-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.info {
  width: calc(100% - 10px);
  height: 120px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin: 5px auto;
  font-size: 1em;
  background-color: var(--color-background-mute);
}
.info .name {
  width: 100%;
  height: 40px;
  font-size: 1.5rem;
}
.path {
  width: 100%;
  height: 30px;
  font-size: 1rem;
  display: flex;
}
.count {
  width: 100%;
  height: 30px;
  font-size: 1rem;
  display: flex;
}

.line-row .label {
  width: auto;
}

.music-lists{
  height: calc(100% - 120px);
}
</style>
