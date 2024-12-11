import api from "./baseApi.ts"
import {ResponseData} from "@/types/apiTypes.ts";
import {Magnet} from "@/types/magnetType.ts";
import {Music_Actions} from "@/apis/ApiAction.ts";

export async function fetchPlayList(): Promise< ResponseData<Magnet[]> >
{
    let [_callId, promise] = api.sendQuery(Music_Actions.get_play_list, {});
    let response = await promise;

    return response;
}
