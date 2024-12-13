<script setup lang="ts">
import {defineComponent, Ref, ref} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import {PlayList} from "@/types/musicType.ts";
import PlayListInfo from "./common/playListInfo.vue";
import message from "@/components/public/kui/message";
import MusicSetting from "@/components/music/common/musicSetting.vue";

defineComponent({
  name: "musicIndex"
})

defineProps({
  windowId: {
    type: String,
    default: ''
  }
})

const searchText = ref('');

const playList: Ref<PlayList[]> = ref<PlayList[]>([
    {
    id: 'default',
    name: "喜爱的歌曲",
    cover: "bg.jpg",
    icon: "music",
    description: "默认收藏夹",
    createTime: 0,
    lastPlayTime: 0,
    playCount: 0,
    trackCount: 0,
    isPublic: true,
    isSync: true,
    isTagSearch: false,
    isLike: false
  },
  {
    id: 'history',
    name: "最近播放",
    cover: "bg.jpg",
    icon: "music",
    description: "默认收藏夹2",
    createTime: 0,
    lastPlayTime: 0,
    playCount: 0,
    trackCount: 0,
    isPublic: true,
    isSync: true,
    isTagSearch: false,
    isLike: false
  },
  {
    id: 'local',
    name: "本地目录",
    cover: "bg.jpg",
    icon: "music",
    description: "默认收藏夹3",
    createTime: 0,
    lastPlayTime: 0,
    playCount: 0,
    trackCount: 0,
    isPublic: true,
    isSync: true,
    isTagSearch: false,
    isLike: false
  },
])

const selectIndex = ref(0);

const showPlayList = "showPlayList";
const showSetting = "showSetting";
const musicViewShow = ref(showPlayList);

function changePlayList(index: number) {
  selectIndex.value = index;
  musicViewShow.value = showPlayList;
}

function showMusicSetting()
{
  message.info("show music setting");
  musicViewShow.value = showSetting;
  selectIndex.value = -1;
}
</script>

<template>
  <div class="fc-app-window" >
    <div class="music-content">
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
        <div class="play-list">
          <div class="title">播放列表</div>
          <div
              v-for="(item, i) in playList"
              :key="item.id"
              :class="`list-item ${i == selectIndex?'select-item':''}` "
              @click="changePlayList(i)"
          >
            <div class="icon">
              <IconSvg :icon-name="item.icon" />
            </div>
            <span>{{item.name}}</span>
          </div>
        </div>

<!--        设置-->
        <div class="setting-group">
          <icon-svg class="icon" @click.stop.capture="showMusicSetting" icon-name="setting"/>
        </div>
      </div>
      <div class="play-list-info">
        <play-list-info v-if="musicViewShow === showPlayList" :play-list="playList[selectIndex]"/>
        <music-setting v-if="musicViewShow === showSetting"
                       :window-id="windowId"/>
      </div>

    </div>

    <div class="music-control">

    </div>
  </div>
</template>

<style scoped>
@import "../../assets/public.css";
.music-content{
  width: 100%;
  height: calc(100% - 50px);
  display: flex;
}
.side-bar
{
  width: 210px;
  height: 100%;
  box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.music-view{
  width: calc(100% - 210px);
  height: 100%;
}
.play-list-info{
  width: 100%;
  height: 100%;
}
.music-control{
  width: 100%;
  height: 50px;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
}

.side-bar .side-title{
  width: 100%;
  height: 50px;
  display: block;
  padding-left: 0.4rem;
  font-size: 1.8rem;
  font-weight: bold;

  color: var(--color-text-show);
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


.play-list {
  width: 100%;
  height: calc(100% - 140px);
  overflow-y: auto;
  padding-top: 10px;
}
.play-list .title{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 1.3em;
  padding-left: 0.8em;
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
}
.play-list .list-item{
  width: 100%;
  height: 35px;
  line-height: 35px;
  display: flex;
  padding-left: 0.8em;
  box-sizing: border-box;
  position: relative;
  font-size: 0.9em;
}
.play-list .list-item:hover , .play-list .select-item{
  background-color: var(--color-background-soft);
}
.list-item:hover::before ,.play-list .select-item::before{
  content: "";
  width: 5px;
  height: 25px;
  position: absolute;
  left: 0.5em;
  top: 5px;
  background-color: var(--color-text-money);
}
.play-list .list-item .icon{
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-text);
  flex-shrink: 0;
  font-size: 1.2em;
}
.play-list .list-item span{
  width: calc(100% - 40px);
  margin-left: 10px;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  color: var(--color-text);
  flex-shrink: 0;
}

.setting-group{
  width: calc(100% - 20px);
  height: 40px;
  display: flex;
  justify-content: right;
  align-items: center;
  font-size: 1.5em;
}
.setting-group .icon:hover{
  cursor: pointer;
  color: var(--color-text-money);
}

</style>
