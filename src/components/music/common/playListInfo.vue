<script setup lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {MusicInfo, PlayList} from "@/types/musicType.ts";

defineComponent({name: "play-list-info"});

const props = defineProps({
  playList: {
    type: Object as PropType<PlayList>,
    default: () => ({})
  }
})

const musicList = ref<MusicInfo[]>([
  {
    name: "生如繁花",
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
    type: 1
  },
  {
    name: "2",
    artists: ["2"],
    cover: "2",
    duration: 2,
    filePath: "2",
    id: "2",
    isLike: true,
    isLocal: true,
    lyricPath: "2",
    origin: "2",
    playCount: 2,
    tags: ["2"],
    type: 1
  },
])


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
        <div class="tags">
          <span v-for="tag in playList.tags">{{tag}}</span>
        </div>
        <div class="time">创建时间: {{playList.createTime}}</div>
      </div>
    </div>
    <div class="lists">
      <div class="list-item">
        <div class="cover">

        </div>
        <div class="name">名称</div>
        <div class="artists">艺术家</div>
        <div class="origin">来源</div>
        <div class="duration">时长</div>
        <div class="isLike">是否喜欢</div>
      </div>
      <div v-for="item in musicList"
           class="list-item">
        <div class="cover">
          <img :src="item.cover" alt=""/>
        </div>
        <div class="name">{{item.name}}</div>
        <div class="artists">{{item.artists}}</div>
        <div class="origin">{{item.origin}}</div>
        <div class="duration">{{item.duration}}</div>
        <div class="isLike">{{item.isLike}}</div>
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
}

.info-content .name {
  font-size: 30px;
  font-weight: bold;
}
.info-content .desc {
  font-size: 20px;
  color: #999;
}
.info-content .tags {
  font-size: 20px;
  color: #999;
}

.lists {
  display: grid; /* 使用 Grid 布局 */
  grid-template-columns: auto 1fr 1fr 1fr 1fr 1fr; /* 设置列的布局 */
  gap: 10px; /* 列之间的间距 */
}

.list-item {
  display: contents; /* 使各个子元素直接成为 Grid 容器的子元素 */
  padding: 10px; /* 少许内边距 */
  border-bottom: 1px solid #ccc; /* 可选：增加底部边框，分隔各行 */
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

.name, .artists, .origin, .duration, .isLike {
  text-align: left; /* 文本左对齐 */
  min-height: 50px; /* 所有列的最小高度一致 */
}




</style>