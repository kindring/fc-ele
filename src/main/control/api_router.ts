import {ApiType, ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import {Magnet_Actions} from "@/apis/ApiAction.ts";
import {c_fetchMagnetList, c_magnet_batch_update, c_magnet_delete} from "@/main/control/magnet/magnet.ts";

export async function apiRouter(requestData: RequestData){
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



