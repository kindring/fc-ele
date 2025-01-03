<script setup lang="ts">
import {MusicInfo, MusicScanSetting} from "@/types/musicType.ts";
  import {PropType, ref} from "vue";
import LickIcon from "@/components/music/common/lickIcon.vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import message from "@/components/public/kui/message";

const props = defineProps({
  scanSetting: {
    type: Object as PropType<MusicScanSetting>,
    default: () => ({})
  }
})

const scanCount = ref(0)
const musicList = ref<MusicInfo[]>([
  {
    name: "霜雪千年",
    artists: ["1"],
    cover: "1",
    duration: 1,
    filePath: "1",
    id: 1,
    key: "",
    isLike: true,
    isLocal: true,
    lyricPath: "1",
    origin: "1",
    playCount: 1,
    tags: ["1"],
    type: 1,
    album: "1",
    scanId: 1,
  },
])


function playMusic(item: MusicInfo) {
  console.log(item);
  message.info(`play ${item.name}`);
}

function likeMusic(item: MusicInfo) {
  console.log(item);
  message.info(`like ${item.name}`);
}
function showMore(item: MusicInfo) {
  console.log(item);
  message.info(`show ${item.name}`);

}
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
        <div class="name">名称</div>
        <div class="artists">艺术家</div>
        <div class="origin">来源</div>
        <div class="duration">时长</div>
        <div class="isLike">喜欢</div>
      </div>
    </div>
    <div class="music-list-con scroll">
      <div v-for="item in musicList"
           class="music-list-item"
           @click="playMusic(item)"
      >
        <div class="cover">
          <img :src="item.cover" alt=""/>
        </div>
        <div class="name">{{item.name}}</div>
        <div class="artists">{{item.artists}}</div>
        <div class="origin">{{item.origin}}</div>
        <div class="duration">{{item.duration}}</div>
        <lick-icon class="isLike" :like="item.isLike"
                   @click.stop.capture="likeMusic(item)"/>
        <div class="more">
          <icon-svg icon-name="add" @click.stop.capture="showMore(item)"></icon-svg>
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

  background-color: var(--color-background-mute);
}
.name {
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
