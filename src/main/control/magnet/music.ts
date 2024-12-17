import {dialog} from "electron"
import {ApiType, ErrorCode, RequestData, ResponseData} from "@/types/apiTypes.ts";
import Logger from "@/util/logger.ts";
let logger = Logger.logger('music', 'info');

export async function c_fetchPlayList(requestData: RequestData)
{
    let responseData: ResponseData<any>
    responseData = {
        type: ApiType.res,
        code: ErrorCode.success,
        callId: requestData.callId,
        action: requestData.action,
        msg: '暂无歌单',
        data: [],
    }
    return responseData;
}


export async function c_scanMusicSelect(requestData: RequestData): Promise<ResponseData<string>>
{
    let defaultPath = requestData.data;
    let responseData: ResponseData<any>
    logger.info(`select scan dir`);
    let result = await dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openDirectory'],
        multiSelections: false,
        title: '请选择扫描目录'
    })
    console.log(result)
    logger.info(`scan dir ${result.filePaths[0]}`);

    responseData = {
        type: ApiType.res,
        code: ErrorCode.success,
        callId: requestData.callId,
        action: requestData.action,
        msg: '',
        data: result.filePaths[0],
    }

    return responseData;
}
