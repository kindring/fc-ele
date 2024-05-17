import {BrowserWindow} from "electron";

export interface HotKeyConfig {
    show: string;
    min: string;
}
export interface AppConfig {
    dbPath: string;
    exitQuestion: boolean;
    exitMode: string;
    hotKey: HotKeyConfig;
    saveWinSize: number;
    enableIpv6: boolean;
}

// let defaultWin = {
//     sign: null,
//     parentSign: null,
//     type: '',
//     title: '未知窗口',
//     descript: '窗口描述文件',
//     win: null,
//     isMain: false,
//     timer: null,// 等待销毁计时器
//     hide: false,// 是否隐藏
//     isConnected: false,// 是否已经建立连接
//     isUsed: false,// 是否被使用中,用于复用窗口
//     destroyWait: 30,
//     style: {
//         width: 0,
//         height: 0,
//         x: 0,
//         y: 0
//     }
// }

export interface AppWindow {
    isMain: boolean;
    win: BrowserWindow | null;
    type: string;
    title: string;
    id?: string;
    sign?: string;
    parentSign?: string;
    description?: string;
    timer?: NodeJS.Timeout | null;// 等待销毁计时器
    hide?: boolean;// 是否隐藏
    isConnected?: boolean;// 是否已经建立连接
    isUsed?: boolean;// 是否被使用中,用于复用窗口
    destroyWait?: number;
    isQueryClose?: boolean;// 窗口是否在询问关闭中
    tray?: Electron.Tray | null;
    style: {
        width: number;
        height: number;
        x: number;
        y: number;
    }
}



export interface registerWindowData {
    signId: string;
    baseUrl: string;
    key: string;
}

