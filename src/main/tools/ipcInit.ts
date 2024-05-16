import {ipcMain} from "electron";
import {actionMap, IpcAction, windowAction} from "../../tools/IpcCmd.ts";
import hook from "../../util/hook.ts";
import Logger from "../../util/logger.ts";
import {handle} from "../../util/promiseHandle.ts";

let logger = Logger.logger('ipcInit', 'info');
function bindAction(action: IpcAction, bindReplay: boolean = false) {
    let code = bindReplay?action.resCode:action.code;
    logger.info(`绑定ipc事件:${code}-${action.title}`);
    ipcMain.on(code, async (_, arg) => {
        // console.log(event);
        logger.info(`${code}-${action.title},参数:${arg}`);
        let [err,res] = await handle(
            hook.runHook(code,arg)
        );
        if(err){
            logger.error(err);
        }
        logger.debug(`${code}-${action.title},返回:${res}`);
    });
}


export function onceIpcReply(code: string) {
    return new Promise((resolve, _) => {
        ipcMain.once(code, (_, arg) => {
            resolve(arg);
        });
    });
}



export function initIpc() {
    logger.info('初始化ipc事件');
    // 绑定ipc事件
    bindAction(windowAction.bindSignId,true);
    bindAction(windowAction.close);
    bindAction(windowAction.min);
    bindAction(windowAction.max);
    bindAction(windowAction.unMax);
    bindAction(windowAction.ding);
    bindAction(windowAction.unDing);
    bindAction(windowAction.restore);
    bindAction(windowAction.openSetting);
    bindAction(actionMap.exitApp);
}

