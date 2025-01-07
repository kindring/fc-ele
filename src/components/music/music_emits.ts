import {defineEmits} from "vue";
import {MusicInfo} from "@/types/musicType.ts";

export enum Music_Action_events {
    like_music = 'like_music',
    play_music = 'play_music',
    play_next = 'play_next',
    play_prev = 'play_prev',
    play_pause = 'play_pause',
    play_stop = 'play_stop',
}
export const music_action_emits = defineEmits<{
    (e: Music_Action_events.play_music , music: MusicInfo): void,
}>()
