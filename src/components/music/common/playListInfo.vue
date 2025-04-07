<script setup lang="ts">
import {defineComponent, onBeforeMount, PropType, ref, watch} from "vue";
import {MusicInfo, param_music_like, PlayList} from "@/types/musicType.ts";
import LickIcon from "@/components/music/common/lickIcon.vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import message from "@/components/public/kui/message";
import {api_fetchMusic, api_likeMusic} from "@/apis/musicControl.ts";
import {ErrorCode} from "@/types/apiTypes.ts";
import {secondToTimeStr} from "../../../util/time.ts";
import HideText from "@/components/public/hideText.vue";
import {KuiDialogCmd} from "@/components/public/kui-dialog-cmd.ts";
import addPlayList from "@/components/music/dialog/addPlayList.vue";

defineComponent({name: "play-list-info"});

const props = defineProps({
  playList: {
    type: Object as PropType<PlayList>,
    default: () => ({})
  },
  windowId: {
    type: String,
    default: ""
  }
})

const musicList = ref<MusicInfo[]>([])

let playlist_id = ref(0)
const lock_loading = ref(false);
const scanCount = ref(0)
const search_key = ref("");
const search_page = ref(1);

const page_limit = 10;

const emits =  defineEmits<{
  (e: 'reload'): void
}>()

async function loadPlayListMusic(playList: PlayList, page: number, key: string){
  if (lock_loading.value)
  {
    message.info("正在加载中，请稍后");
    return;
  }
  lock_loading.value = true;
  let res = await api_fetchMusic(playList.id, page, page_limit, key)
  lock_loading.value = false;
  if (res.code === ErrorCode.success)
  {
    if (page === 1)
    {
      scanCount.value = res.data.total?? 0;
    }
    let pageData = res.data.data;
    for ( let i = 0; i < pageData.length; i++)
    {
      pageData[i].isLike = !!pageData[i].isLike;
      pageData[i].isLocal = !!pageData[i].isLocal;
      musicList.value.push(pageData[i]);
    }
  } else {
    message.error(res.msg);
  }

}

onBeforeMount(()=>{
  if (props.playList && props.playList.id)
  {
    loadPlayListMusic(props.playList, search_page.value, search_key.value);
  }
})

watch(()=>props.playList, ()=>{
  if (playlist_id.value !== props.playList.id)
  {
    musicList.value = [];
    loadPlayListMusic(props.playList, 1, search_key.value);
  }
})

function playMusic(item: MusicInfo) {
  console.log(item);
  message.info(`play ${item.name}`);
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
    if ( props.playList.isLike )
    {
      // 移除该项
      musicList.value = musicList.value.filter(item => item.id !== param.musicId);
    }
  }
  else {
    message.error(res.msg);
  }
}

function showMore(item: MusicInfo) {
  console.log(item);
  message.info(`show ${item.name}`);
}

let load_more_repeat = 0;
async function loadMore()
{
  if (musicList.value.length >= scanCount.value)
  {
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
  await loadPlayListMusic(props.playList, search_page.value, search_key.value);
}


const playlist_dialog = new KuiDialogCmd({
  showContent: addPlayList,
  mountTarget: props.windowId,
  className: 'dialog',
  on: { },
  onClose: closeDialogHandle
});

function closeDialogHandle()
{
  console.log("close dialog");
  emits('reload');
}

function editBtnClickHandle()
{
  // message.info("edit btn click");
  playlist_dialog.show({
    playlist: props.playList
  })
}

function deleteBtnClickHandle()
{
  message.info("delete btn click");

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
      <div
          v-if="!playList.isLike"
          class="edit-btn"
          @click="editBtnClickHandle">
        <icon-svg icon-name="edit"/>
      </div>
      <div v-if="!playList.isLike"
           class="delete-btn"
           @click="deleteBtnClickHandle"
      >
        <icon-svg icon-name="remove"/>
      </div>
    </div>
    <div class="music-lists">
      <div class="music-list-head">
        <div class="music-list-item">
          <div class="cover">

          </div>
          <div class="item-info">名称</div>
          <div class="origin">来源</div>
          <div class="duration">时长</div>
          <div class="isLike">喜欢</div>
        </div>
      </div>
      <div class="music-list-con scroll" @scrollend="loadMore()">
        <div v-for="item in musicList"
             class="music-list-item"
             @click="playMusic(item)"
        >
          <div class="cover">
            <img :src="item.cover" alt=""/>
          </div>
          <hide-text class="item-info" :text="item.name"
                     :enable-copy="true"
                     :copy-success="()=>{message.success('复制歌曲名称成功')}">
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
.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.delete-btn {
  position: absolute;
  top: 10px;
  right: 50px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-background);
  color: var(--color-text-money);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

</style>
