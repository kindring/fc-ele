import {IpcAction, actionMap} from "../../tools/IpcCmd.ts";
import hook, {HookFn} from "../../util/hook.ts";
import {
    closeWin,
    connectedWin, disableIgnoreMouse, enableIgnoreMouse,
    hideWin,
    maxWin,
    minWin,
    restoreWin,
    showWin, topWin, tryConnectWin,
    unMaxWin,
    unTopWin
} from "./doWindowAction.ts";
import appControl from "../AppControl.ts";
import Logger from "../../util/logger.ts";

let logger = Logger.logger('ipcInit', 'info');

/**
 * 绑定钩子
 * @param action 要触发的 action 值
 * @param fn 触发的函数
 * @param bindReplay 是否绑定回复
 */
function hookBind(action: IpcAction, fn: HookFn<any>, bindReplay = false){
    if(bindReplay){
        hook.addHook(action.resCode, fn, `reply_${action.title}`);
    }else{
        hook.addHook(action.code, fn, action.title);
    }
}


// hookBind(windowAction.openSetting, win.openSettingPage);


export function initHook(){
    logger.info('initHook');
    hookBind(actionMap.bindSignId, connectedWin,true);
    // 前端发给主进程的指令, 尝试绑定窗口
    hookBind(actionMap.bindSignId, tryConnectWin);
    hookBind(actionMap.close, closeWin);
    hookBind(actionMap.min, minWin);
    hookBind(actionMap.max, maxWin);
    hookBind(actionMap.unMax, unMaxWin);
    hookBind(actionMap.ding, topWin);
    hookBind(actionMap.unDing, unTopWin);
    hookBind(actionMap.restore, restoreWin);
    hookBind(actionMap.hide, hideWin);
    hookBind(actionMap.show, showWin);
    hookBind(actionMap.exitApp, appControl.exit);
    hookBind(actionMap.enableIgnoreMouse, enableIgnoreMouse);
    hookBind(actionMap.disableIgnoreMouse, disableIgnoreMouse);
}
