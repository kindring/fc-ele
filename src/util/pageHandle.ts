import {App} from "vue";

import {ipcRenderer} from "electron";
import {IpcAction, windowAction} from "../tools/IpcCmd.ts";
import {registerWindowData} from "../types/appConfig.ts";

function winHandle(ipc: Electron.IpcRenderer, windowName: string, action: IpcAction){
    let sendCode = action.code;
    ipc.send(sendCode, windowName);
}

function registerWinHandle(ipc: Electron.IpcRenderer, windowName: string): (action: IpcAction)=>void
{
    windowName = windowName.toString();
    return winHandle.bind(null, ipc, windowName);
}

/**
 * 初始化页面 挂载$winHandle为全局函数. 操作窗口
 * @param app
 *
 */
export function windowInit(app: App){
    ipcRenderer.on(
        windowAction.bindSignId.code,
        (_: Electron.IpcRendererEvent , data: registerWindowData)=>
        {
            console.log(`获取到窗口id${data.signId}`);
            app.config.globalProperties.$winHandle = registerWinHandle(ipcRenderer, data.signId);
            console.log(   `窗口绑定:${windowAction.bindSignId.resCode}` );
            ipcRenderer.send(windowAction.bindSignId.resCode, data.signId);
        });
    // todo 初始化axios
    // if(axios){
    //     axios.initAxios(
    //         data.baseUrl,
    //         1000,
    //         data.key
    //     );
    // }
}
