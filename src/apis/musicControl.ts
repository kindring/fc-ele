import api from "./baseApi.ts"
import {ResponseData} from "@/types/apiTypes.ts";
import {Magnet} from "@/types/magnetType.ts";
import {Music_Actions} from "@/apis/ApiAction.ts";
import {MusicScanSetting} from "@/types/musicType.ts";

export async function fetchPlayList(): Promise< ResponseData<Magnet[]> >
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

export async function fetchScanConfig() : Promise<ResponseData<MusicScanSetting[]>>
{
    let [_callId, promise] = api.sendQuery(Music_Actions.scan_settings, {});
    return await promise;
}