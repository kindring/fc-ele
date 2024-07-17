import {addMagnet, changeMagnets, getMagnetList} from "@/common/db/magnetDb.ts";
import {ApiType, ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import {ChangeSaveMagnet, SavedMagnet} from "@/types/magnetType.ts";
import {handle} from "@/util/promiseHandle.ts";
import Logger from "@/util/logger.ts";

let logger = Logger.logger('magnet_control', 'info');

export async function c_fetchMagnetList(requestData: RequestData){
    let [err, result] = await handle(getMagnetList());
    let responseData: ResponseData<any>
    if (err) {
        err = err as Error;
        responseData = {
            type: ApiType.res,
            code: ErrorCode.db,
            callId: requestData.callId,
            action: requestData.action,
            msg: err.message,
            data: null,
        }
        return responseData;
    }
    responseData = {
        type: ApiType.res,
        code: ErrorCode.success,
        callId: requestData.callId,
        action: requestData.action,
        msg: '',
        data: result,
    }
    return responseData;
}


export async function c_magnet_batch_update(requestData: RequestData){
    let responseData: ResponseData<any>
    // 区分出新增的项和原本就有的项
    let saveMagnets: ChangeSaveMagnet[] = requestData.data as ChangeSaveMagnet[];
    // 分类
    let addMagnets: SavedMagnet[] = []
    let updateMagnets: SavedMagnet[] = []
    for (let i = 0; i < saveMagnets.length; i++) {
        let magnet = saveMagnets[i];
        if (magnet.isAdd) {
            let addMagnet: SavedMagnet = {
                id: "",
                size: magnet.size,
                type: magnet.type,
                x: magnet.x,
                y: magnet.y,
            }
            addMagnets.push(addMagnet);
        }else{
            updateMagnets.push(magnet);
        }
    }
    let changePromise = changeMagnets(updateMagnets)
    let addPromises = addMagnets.map(magnet => addMagnet(magnet))
    let [err, _result] = await handle(Promise.all([changePromise, ...addPromises]))
    if (err) {
        err = err as Error;
        logger.error(`[更新数据失败] ${err.message}`)
        responseData = {
            type: ApiType.res,
            code: ErrorCode.db,
            callId: requestData.callId,
            action: requestData.action,
            msg: err.message,
            data: null
        }
        return responseData;
    }
    responseData = {
        type: ApiType.res,
        code: ErrorCode.success,
        callId: requestData.callId,
        action: requestData.action,
        msg: '',
        data: null,
    }
    return responseData;
}
