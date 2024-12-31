import api from "./baseApi.ts"
import {Order, Page, ResponseData} from "@/types/apiTypes.ts";
import {Music_Actions} from "@/apis/ApiAction.ts";
import {MusicInfo, MusicScanSetting, PlayList} from "@/types/musicType.ts";

export async function fetchPlayList(): Promise< ResponseData<PlayList[]> >
{
    let [_callId, promise] = api.sendQuery(Music_Actions.play_list_fetch, {});
    let response = await promise;

    return response;
}


export async function selectScanDir(defaultPath: string): Promise< ResponseData<string> >
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_music_select, defaultPath, -1, true);
    return await promise;
}

export async function addScanDir(scanSetting: MusicScanSetting)
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_music_add, scanSetting);
    return await promise;
}

export async function updateScanConfig(scanConfig: MusicScanSetting)
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_music_update, scanConfig);
    return await promise;
}

export async function fetchScanConfig() : Promise<ResponseData<MusicScanSetting[]>>
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_settings, {});
    return await promise;
}

export async function deleteScanConfig(id: number) : Promise<ResponseData<boolean>>
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_music_delete, id);
    return await promise;
}

export async function fetchScanMusic(scanId: number, page: number = 1, size: number = 10, 
                                     orderBy: string = 'id', 
                                     order: Order = Order.desc): Promise<ResponseData<Page<MusicInfo[]>>>
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_music_fetch, {scanId, page, size, orderBy, order});
    return await promise as ResponseData<Page<MusicInfo[]>>;
}