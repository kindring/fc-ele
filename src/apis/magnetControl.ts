import api from "./baseApi.ts"
import {Magnet_Actions} from "./ApiAction.ts";
import {ErrorCode, ResponseData} from "@/types/apiTypes.ts";
import {Magnet, SavedMagnet} from "@/types/magnetType.ts";
import {savedMagnets2Magnets} from "@/components/magnets/magnetInfo.ts";

function _magnet2savedMagnet(magnet: Magnet): SavedMagnet {
   return {
      id: magnet.id,
      type: magnet.type,
      size: magnet.size,
      x: magnet.x,
      y: magnet.y,
   }
}



/**
 * 获取磁贴信息
 * @returns {Promise<ResponseData<SavedMagnet[]> | ResponseData<null>>}
  */
export async function fetchMagnetList(): Promise< ResponseData<Magnet[]> >
{
   let [_callId, promise] = api.sendQuery(Magnet_Actions.magnet_list, {});
   let response = await promise;
   if (response.code === ErrorCode.success) {
      let arr = response.data as SavedMagnet[];
      response.data = savedMagnets2Magnets(arr)
      return response;
   }
   response.data = [];
   return response;
}

/**
 * 更新磁贴信息
 * @param {Magnet[]} magnetList
 */
export async function changeMagnets(magnetList: Magnet[])
{
   let savedMagnets: SavedMagnet[] = magnetList.map(_magnet2savedMagnet);
   let [_callId, promise] = api.sendQuery(Magnet_Actions.magnet_batch_update, {
      magnetList: savedMagnets
   });
   return await promise;
}

/**
 * 删除磁贴信息
 * @param magnetId
 */
export async function deleteMagnet(magnetId: string)
{
   let [_callId, promise] = api.sendQuery(Magnet_Actions.magnet_delete, {
      magnetId: magnetId
   });
   return await promise;
}
