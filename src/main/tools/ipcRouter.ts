import {apiRouter} from "@/main/control/api_router.ts";
import {NotifyData, RequestData, ResponseData} from "@/types/apiTypes.ts";
import AppControl from "@/main/AppControl.ts";
import Logger from "@/util/logger.ts";
import {actionMap} from "@/tools/IpcCmd.ts";

let logger = Logger.logger('ipcRouter', 'info');
function sendDataByType(type: string,  data: ResponseData<any> | NotifyData): boolean
{
    // 还需要知道往哪个窗口发送数据
    let winArr = AppControl.findWinByType(type)
    logger.info(`[发送数据至前端] 寻找${type}类型的窗口`);
    if (winArr.length === 0) {
        logger.error(`[发送数据] 未找到${type}类型的窗口`);
        return false;
    }
    winArr.forEach(winObj => {
        winObj.win?.webContents.send(actionMap.apiControl.resCode, data)
    });
    return true;
}

function sendDataBySign(signId: string, data: ResponseData<any> | NotifyData): boolean {
    let appWindow = AppControl.findWin(signId)
    if (!appWindow) {
        logger.error(`[发送数据] 未找到id为${signId}的窗口`);
        return false;
    }
    logger.info(`[发送数据至前端] 寻找id为${signId}的窗口 ${actionMap.apiControl.resCode}`);
    logger.info(`[发送数据至前端] ${JSON.stringify(data)}`);
    let win = appWindow?.win
    if (!win)
    {
        logger.error(`[发送数据] id为${signId}的窗口 未初始化`);
        return false;
    }
    win.webContents.send(actionMap.apiControl.resCode, data)
    return true;
}
const sendToMain = sendDataByType.bind(null, 'main')


/**
 * 处理窗口发来的api请求
 * @param requestData
 */
export async function ipcRouter(requestData: RequestData): Promise<boolean>
{
    let signId = requestData.signId;
    let responseData: ResponseData<any> = await apiRouter(requestData)
    if(signId){
        return sendDataBySign(signId, responseData)
    }else
    {
        console.log(`[返回数据] 前端未配置窗口id, 尝试返回给main窗口`)
        return sendToMain(responseData)
    }
}

