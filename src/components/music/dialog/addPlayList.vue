<script setup lang="ts">
import {defineComponent, onMounted, PropType, ref} from "vue";
import {PlayList} from "@/types/musicType.ts";
import KuiInput from "@/components/public/kui/kui-input.vue";
import KuiCheckbox from "@/components/public/kui/kui-checkbox.vue";
import message from "@/components/public/kui/message";
import {ErrorCode} from "@/types/apiTypes.ts";
import {api_playlist_add, api_playlist_update} from "@/apis/musicControl.ts";

defineComponent({
  name: "addPlayList"
})

const props = defineProps({
  playlist: {
    type: Object as PropType<PlayList>,
    default: (): PlayList => {
      return {
        id: -1,
        name: '',
        icon: '',
        cover: '',
        description: '',
        playCount: 0,
        trackCount: 0,
        createTime: 0,
        lastPlayTime: 0,
        isTagSearch: false,
        isSync: false,
        isPublic: false,
        isLike: false
      }
    }
  }
})

const emits = defineEmits<{
  (e: 'close' ): void,
  (e: 'submit'): void
}>()

const isEdit = ref(false);
// 歌单名称
const playlistName = ref('');
// 歌单描述
const description = ref('');
// 歌单封面
const cover = ref('');
const isLike = ref(false);
const isPublic = ref(false);


onMounted(()=>{
  if (props.playlist && props.playlist.id > -1)
  {
    console.log(props.playlist);
    isEdit.value = true;
    playlistName.value = props.playlist.name;
    description.value = props.playlist.description;
    cover.value = props.playlist.cover;
    console.log(cover.value);
    isLike.value = !!props.playlist.isLike;
    isPublic.value = !!props.playlist.isPublic;
  }else {
    isEdit.value = false;
  }
})


function closeDialog() {
  emits('close');
}

async function submitHandle() {
  console.log('submit');
  // 创建歌单
  let param: Partial<PlayList> = {
    name: playlistName.value,
    description: description.value,
    cover: cover.value,
    isPublic: isPublic.value,
    isLike: isLike.value
  }
  if (!param.name)
  {
    message.error('歌单名称不能为空');
    return;
  }
  if (isEdit.value)
  {
    // 编辑歌单
    param.id = props.playlist.id;
    let res = await api_playlist_update(param);
    if (res.code === ErrorCode.success)
    {
      message.success('编辑成功');
      emits('close');
    }
    else {
      message.error(res.msg);
    }
  }
  else {
    // 创建歌单
    let res = await api_playlist_add(param);
    if (res.code === ErrorCode.success)
    {
      message.success('创建成功');
      emits('close');
    }
    else {
      message.error(res.msg);
    }
  }
}

</script>

<template>
  <div class="dialog-content form-dialog">
    <div class="dialog-title">
      {{ isEdit? '编辑歌单' : '创建歌单' }}
      <div
          class="close-btn"
          @click="closeDialog()">
        X
      </div>

    </div>
    <div class="dialog-show">
      <div class="form-row" >
        <kui-input label="歌单名称"
                   placeholder="歌单的名称"
                   v-model:value="playlistName"
        />
      </div>

      <div class="form-row mt-4"
           v-if="isLike"
      >
        <kui-input
            label="歌单描述"
            placeholder="歌单的描述"
            v-model:value="description"
        />
      </div>

      <div class="form-row mt-4">
        <kui-checkbox id="isPublicPlaylist" v-model:value="isPublic" >
          是否公开
        </kui-checkbox>
      </div>


    </div>
    <div class="dialog-footer">
      <div class="btn cancel-btn mr-2" @click="closeDialog()">取消</div>
      <div class="btn primary-btn" @click="submitHandle">确定</div>
    </div>
  </div>
</template>

<style scoped>
.form-row{
  width: 90%;
  height: 40px;
  display: flex;
  align-items: center;
  margin: 1rem auto;
}
</style>
