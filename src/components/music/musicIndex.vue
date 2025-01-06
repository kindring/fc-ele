<script setup lang="ts">
import {defineComponent, onBeforeMount, Ref, ref} from "vue";
import IconSvg from "@/components/public/icon/iconSvg.vue";
import {MusicScanSetting, PlayList} from "@/types/musicType.ts";
import PlayListInfo from "./common/playListInfo.vue";
import message from "@/components/public/kui/message";
import MusicSetting from "@/components/music/common/musicSetting.vue";
import {fetchPlayList, fetchScanConfig, musicAppStart} from "@/apis/musicControl.ts";
import {ErrorCode} from "@/types/apiTypes.ts";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/vue";
import ScanListInfo from "@/components/music/common/scanListInfo.vue";

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

const playList: Ref<PlayList[]> = ref<PlayList[]>([])

const selectPlaylistIndex = ref(0);

const showPlayList = "showPlayList";
const showSetting = "showSetting";
const showScanList = "showScanList";



const site_playList = "site-play-list";
const site_scan_list = "site-scan-list";
const site_views = [site_playList, site_scan_list]

const musicViewShow = ref(showPlayList);
const site_view_key = ref(site_views[0]);

function changePlayList(index: number) {
  selectPlaylistIndex.value = index;
  musicViewShow.value = showPlayList;
}

async function loadPlayList()
{
  let responseData = await fetchPlayList();
  if (responseData.code === ErrorCode.success)
  {
    playList.value = responseData.data;
  } else
  {
    message.error(responseData.msg);
  }
}

async function startScan()
{
  let responseData = await musicAppStart();
  if (responseData.code === ErrorCode.success)
  {
    message.success(`扫描成功`);
  } else
  {
    message.error(responseData.msg);
  }
}

onBeforeMount(()=>{
  loadPlayList();
  startScan();
})

function showMusicSetting()
{
  message.info("show music setting");
  musicViewShow.value = showSetting;
  selectPlaylistIndex.value = -1;
}


const siteTab = ref(0)
const scanSettings: Ref<MusicScanSetting[]> = ref<MusicScanSetting[]>([])
async function fetchScanSetting()
{
  let responseData = await fetchScanConfig();
  if (responseData.code === ErrorCode.success)
  {
    scanSettings.value = responseData.data;
  }
}

async function changeTab(index: number) {
  if (site_view_key.value === site_views[index])
  {
    return;
  }
  siteTab.value = index
  site_view_key.value = site_views[index];
  if (site_view_key.value === site_playList)
  {
    await loadPlayList();
    // selectPlaylistIndex.value = 0;
    changePlayList(0);
  } else {
    message.info("show scan list");
    await fetchScanSetting();
    changeScanList(0);
  }

}


const selectScanIndex = ref(0);
function changeScanList(index: number)
{
  let scanSetting = scanSettings.value[index];
  console.log(scanSetting);
  selectScanIndex.value = index;
  musicViewShow.value = showScanList;
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

          <TabGroup as="div" class="site-chunk play-list" :selectedIndex="siteTab" @change="changeTab">
            <TabList as="div" class="tab-head">
              <Tab as="template" v-slot="{ selected }"  >
                <button :class="`tab-head-item ${selected?'head-select':''}`">
                  歌单列表
                </button>
              </Tab>
              <Tab as="template" v-slot="{ selected }"  >
                <button :class="`tab-head-item ${selected?'head-select':''}`">
                  扫描目录
                </button>
              </Tab>
            </TabList>
            <TabPanels as="template">
              <TabPanel as="div"  class="site-chunk site-chunk-content">
                <div
                    v-for="(item, i) in playList"
                    :key="item.id"
                    :class="`list-item ${i == selectPlaylistIndex?'select-item':''}` "
                    @click="changePlayList(i)"
                >
                  <div class="icon">
                    <IconSvg :icon-name="item.icon" />
                  </div>
                  <span>{{item.name}}</span>
                </div>
              </TabPanel>
              <TabPanel as="div"  class="site-chunk site-chunk-content">
                <div
                    v-for="(item, i) in scanSettings"
                    :key="item.id"
                    :class="`list-item ${i == selectScanIndex?'select-item':''}` "
                    @click="changeScanList(i)"
                >
                  <span>{{item.name}}</span>
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>


<!--        设置-->
        <div class="setting-group">
          <icon-svg class="icon" @click.stop.capture="showMusicSetting" icon-name="setting"/>
        </div>
      </div>
      <div class="play-list-info">
        <play-list-info v-if="musicViewShow === showPlayList" :play-list="playList[selectPlaylistIndex]"/>
        <scan-list-info v-if="musicViewShow === showScanList" :scan-setting="scanSettings[selectScanIndex]"/>
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

<style>

.site-chunk {
  width: 100%;
  overflow-y: auto;
  padding-top: 10px;
  position: relative;
}
.site-chunk-content {
  height: calc(100% - 50px);
}
.play-list {
  height: calc(100% - 140px);
}
.site-chunk .title{
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 1.3em;
  padding-left: 0.8em;
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
}
.tab-head
{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid var(--color-border);
  box-sizing: border-box;
  padding-left: 3px
}
.tab-head-item{
  height: 100%;
  padding: 3px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}
.tab-head-item:hover{
  color: var(--color-text-money);
}
.tab-head-item:first-child{
  border-radius: 5px 0 0 0;
}
.tab-head-item:last-child{
  border-radius: 0 5px 0 0;
}
.tab-head-item::selection {
  background: transparent;
}
.tab-head-item.head-select{
  color: var(--color-text-show);
  background-color: var(--color-background-soft);
}
.site-chunk .list-item{
  width: 100%;
  height: 35px;
  line-height: 35px;
  display: flex;
  padding-left: 0.8em;
  box-sizing: border-box;
  position: relative;
  font-size: 0.9em;
}
.site-chunk .list-item:hover , .site-chunk .select-item{
  background-color: var(--color-background-soft);
}
.list-item:hover::before ,.site-chunk .select-item::before{
  content: "";
  width: 5px;
  height: 25px;
  position: absolute;
  left: 0.5em;
  top: 5px;
  background-color: var(--color-text-money);
}
.site-chunk .list-item .icon{
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
.site-chunk .list-item span{
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
</style>
