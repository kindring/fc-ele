import {App} from "vue";

import {ipcRenderer} from "electron";
import {actionMap, IpcAction, windowAction} from "../tools/IpcCmd.ts";
import {registerWindowData} from "../types/appConfig.ts";
import baseApi from "@/apis/baseApi.ts";
import {NotifyData, ResponseData} from "@/types/apiTypes.ts";

// 判断是否为 webMode

// const ipcRenderer = {
//     on: (code: string, _: Function)=>{
//         console.log(code)
//     },
//     send: (code: string, data: any)=>{
//         console.log(code, data)
//     },
// };

function winHandle(ipc: Electron.IpcRenderer, windowName: string, action: IpcAction): Promise<boolean>{
    return new Promise((resolve, _)=>{
        let sendCode = action.code;
        try {
            ipc.send(sendCode, windowName);
            ipc.on(sendCode, (_, res)=>{
                resolve(res);
            })
        }catch (e){
            console.error(e)
            resolve(false)
        }
    })
}

function registerWinHandle(ipc: Electron.IpcRenderer, windowName: string): (action: IpcAction) => Promise<any>
{
    windowName = windowName.toString();
    return winHandle.bind(null, ipc, windowName);
}


function tryBindWindow(ipc: Electron.IpcRenderer, type: string): (action: IpcAction)=>Promise<boolean>
{

    return (_action): Promise<boolean> =>{
        return new Promise((resolve, _)=>{
            console.log(`未绑定窗口, 等待绑定`);
            ipc.send(windowAction.bindSignId.code, type)
            resolve(true)
        })
    }

}


/**
 * 初始化页面 挂载$winHandle为全局函数. 操作窗口
 * @param app
 * @param type 窗口类型 用于前端反向绑定主进程
 */
export function windowInit(app: App, type: string){
    // 先将验证窗口绑定到全局, 接收到 绑定消息后再进行绑定
    app.config.globalProperties.$winHandle = tryBindWindow(ipcRenderer, type)
    // 初始化api调用函数. 用于统一调用


    ipcRenderer.on(
    windowAction.bindSignId.code,
    (_: Electron.IpcRendererEvent , data: registerWindowData)=>
    {
        console.log(`获取到窗口id${data.signId}`);
        if(type !== data.type){
            console.warn(`未知的窗口绑定 ${data.type}`);
            return;
        }
        ipcRenderer.on(actionMap.apiControl.resCode, (_: Electron.IpcRendererEvent, apiData: ResponseData<any> | NotifyData)=>{
            baseApi.apiControllerHandler(_ , apiData)
        })
        baseApi.init(type,
            ipcRenderer.send,
            ipcRenderer.on,
            actionMap.apiControl.code,
            actionMap.apiControl.resCode,
            data.signId
        );

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
