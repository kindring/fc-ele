import {ApiType, ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import {Magnet_Actions, Music_Actions} from "@/apis/ApiAction.ts";
import {c_fetchMagnetList, c_magnet_batch_update, c_magnet_delete} from "@/main/control/magnet/magnet.ts";
import {
    c_fetchPlayList,
    c_fetchPlayList_music,
    c_like_music,
    c_load_scan_music,
    c_music_appStart,
    c_playList_add,
    c_playlist_delete, c_playlist_edit,
    c_scanMusicAdd,
    c_scanMusicDelete,
    c_scanMusicSelect,
    c_scanMusicUpdate,
    c_scanSettings
} from "@/main/control/magnet/music.ts";

export async function apiRouter(requestData: RequestData<any>){
    // 生成callId
    let responseData: ResponseData<any>
    switch (requestData.action)
    {
        case Magnet_Actions.magnet_list:
            responseData = await c_fetchMagnetList(requestData);
            break;
        case Magnet_Actions.magnet_batch_update:
            responseData = await c_magnet_batch_update(requestData);
            break;
        case Magnet_Actions.magnet_delete:
            responseData = await c_magnet_delete(requestData);
            break;
        case Music_Actions.music_app_start:
            responseData = await c_music_appStart(requestData);
            break;
        case Music_Actions.play_list_fetch:
            responseData = await c_fetchPlayList(requestData);
            break;
        case Music_Actions.scan_music_select:
            responseData = await c_scanMusicSelect(requestData);
            break;
        case Music_Actions.scan_music_add:
            responseData = await c_scanMusicAdd(requestData);
            break;
        case Music_Actions.scan_settings:
            responseData = await c_scanSettings(requestData);
            break;
        case Music_Actions.scan_music_update:
            responseData = await c_scanMusicUpdate(requestData);
            break;
        case Music_Actions.scan_music_delete:
            responseData = await c_scanMusicDelete(requestData);
            break;
        case Music_Actions.scan_music_fetch:
            responseData = await c_load_scan_music(requestData);
            break;
        case Music_Actions.like_music:
            responseData = await c_like_music(requestData);
            break;
        case Music_Actions.playlist_music_fetch:
            responseData = await c_fetchPlayList_music(requestData);
            break;
        case Music_Actions.play_list_add:
            responseData = await c_playList_add(requestData);
            break;
        case Music_Actions.play_list_delete:
            responseData = await c_playlist_delete(requestData);
            break;
        case Music_Actions.play_list_update:
            responseData = await c_playlist_edit(requestData);
            break;
        default:
            responseData = {
                type: ApiType.res,
                code: ErrorCode.params,
                callId: requestData.callId,
                action: requestData.action,
                msg: 'action not found',
                data: null,
            }
    }
    return responseData;
}



