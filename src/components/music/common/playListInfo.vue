<script setup lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {MusicInfo, PlayList} from "@/types/musicType.ts";
import LickIcon from "@/components/music/common/lickIcon.vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import message from "@/components/public/kui/message";

defineComponent({name: "play-list-info"});

const props = defineProps({
  playList: {
    type: Object as PropType<PlayList>,
    default: () => ({})
  }
})

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
  <div class="play-list-info">
    <div class="info">
      <div class="cover">
        <img :src="playList.cover" alt="">
      </div>
      <div class="info-content">
        <div class="name">{{playList.name}}</div>
        <div class="desc">{{playList.description}}</div>
        <div class="time">创建时间: {{playList.createTime}}</div>
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
.play-list-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.info {
  display: flex;
  width: 100%;
  height: 160px;
  padding: 10px;
  box-sizing: border-box;
}

.info .cover {
  width: 130px;
  height: 130px;
  background-color: #ccc;
  overflow: hidden;
  margin-left: 15px;
  margin-top: 5px;
}

.info-content {
  width: calc(100% - 130px);
  height: 100%;
  padding-left: 30px;
  font-size: 1em;
}

.info-content .name {
  font-size: 1.6rem;
  font-weight: bold;
}
.info-content .desc {
  font-size: 1rem;
  color: var(--color-text-subtitle);
}
.info-content .time {
  font-size: 0.8rem;
  margin-top: 10px;
  color: #999;
}

</style>
