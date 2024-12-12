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
    id: "1",
    isLike: true,
    isLocal: true,
    lyricPath: "1",
    origin: "1",
    playCount: 1,
    tags: ["1"],
    type: 1,
    album: "1"
  },
  {
    name: "2",
    artists: ["2"],
    cover: "2",
    duration: 2,
    filePath: "2",
    id: "2",
    isLike: false,
    isLocal: true,
    lyricPath: "2",
    origin: "2",
    playCount: 2,
    tags: ["2"],
    type: 1,
    album: "2"
  },
    {
      name: "3",
      artists: ["3"],
      cover: "3",
      duration: 3,
      filePath: "3",
      id: "3",
      isLike: false,
      isLocal: true,
      lyricPath: "3",
      origin: "3",
      playCount: 3,
      tags: ["3"],
      type: 1,
      album: "3"
    },
    {
      name: "4",
      artists: ["4"],
      cover: "4",
      duration: 4,
      filePath: "4",
      id: "4",
      isLike: false,
      isLocal: true,
      lyricPath: "4",
      origin: "4",
      playCount: 4,
      tags: ["4"],
      type: 1,
      album: "4"
    },
    {
      name: "5",
      artists: ["5"],
      cover: "5",
      duration: 5,
      filePath: "5",
      id: "5",
      isLike: false,
      isLocal: true,
      lyricPath: "5",
      origin: "5",
      playCount: 5,
      tags: ["5"],
      type: 1,
      album: "5"
    },
    {
      name: "6",
      artists: ["6"],
      cover: "6",
      duration: 6,
      filePath: "6",
      id: "6",
      isLike: false,
      isLocal: true,
      lyricPath: "6",
      origin: "6",
      playCount: 6,
      tags: ["6"],
      type: 1,
      album: "6"
    },
    {
      name: "7",
      artists: ["7"],
      cover: "7",
      duration: 7,
      filePath: "7",
      id: "7",
      isLike: false,
      isLocal: true,
      lyricPath: "7",
      origin: "7",
      playCount: 7,
      tags: ["7"],
      type: 1,
      album: "7"
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
    <div class="lists">
      <div class="list-head">
        <div class="list-item">
          <div class="cover">

          </div>
          <div class="name">名称</div>
          <div class="artists">艺术家</div>
          <div class="origin">来源</div>
          <div class="duration">时长</div>
          <div class="isLike">喜欢</div>
        </div>
      </div>
      <div class="list-con scroll">
        <div v-for="item in musicList"
             class="list-item"
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

.lists {
  width: 100%;
  height: calc(100% - 160px);
  overflow: hidden;
}
.list-head{
  width: calc(100% - 30px);
  height: 50px;
  box-sizing: border-box;
  flex-shrink: 0;
}
.list-con{
  width: 100%;
  height: calc(100% - 51px);
  overflow-x: hidden;
  overflow-y: auto;
}
.list-item {
  border-bottom: 1px solid #ccc; /* 可选：增加底部边框，分隔各行 */
  position: relative;
  display: grid; /* 使用 Grid 布局 */
  grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr; /* 设置列的布局 */
  gap: 10px; /* 列之间的间距 */
  width: 100%;
  height: 50px;
}


.cover {
  width: 50px; /* 封面图片固定宽度 */
  height: 50px; /* 和高度保持一致 */
  overflow: hidden; /* 隐藏超出部分 */
}

.cover img {
  width: 100%; /* 图片宽度100% */
  height: auto; /* 高度自适应 */
}

.list-item > * {
  text-align: left; /* 文本左对齐 */
  height: 100%; /* 所有列的最小高度一致 */
  display: flex;
  align-items: center;
}
.more{
  color: var(--color-text-pirmary);
  position: absolute;
  right: 0.5rem;
}
.list-con .isLike , .list-con .more{
  width: 30px;
  display: flex;
  font-size: 2rem;
  cursor: pointer;
}

.list-con .list-item:hover{
  background-color: var(--color-background-soft);
}

</style>
