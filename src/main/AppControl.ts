import Logger from "../util/logger";
import {BrowserWindow} from "electron";
import {CustomScheme} from "./CustomScheme";
import {getAvailablePort} from "./tools/port.ts";
import {FcServer, startServer} from "./server/httpServer.ts";
import {AppWindow, AppConfig} from "../types/appConfig.ts";
import {randomId} from "../util/random.ts";
import {actionMap} from "../tools/IpcCmd.ts";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import {initIpc} from "./tools/ipcInit.ts";
import {initHook} from "./tools/hookInit.ts";

let logger = Logger.logger('controlWindow', 'info');

let WebPort = 21000;
let BaseUrl = "http://127.0.0.1";

let _app: Electron.App | null = null;
let _webServer: FcServer | null = null;
let _appConfig: AppConfig;
let _winArr: AppWindow[] = [];
let checkTimer: NodeJS.Timeout;
let isExitAppTask = false;// 是否处于退出任务中
function _generate_unique_window_id(){
    let id = randomId();
    let ind = -1;
    let t = 0;
    // eslint-disable-next-line no-constant-condition
    while(true){
        t++;
        id = randomId();
        ind = _winArr.findIndex(value => value.id === id);
        if(ind === -1){
            return id;
        }
        if(t>=10){
            return id + _winArr.length;
        }
    }
}

function findWin(sign: string): AppWindow | null {
    let ind = _winArr.findIndex(value => value.sign === sign);
    if (ind !== -1) {
        return _winArr[ind];
    }
    return null;
}


function removeWin(sign: string){
    let winObj = findWin(sign);
    if(winObj && winObj.win){
        if(winObj.type === 'top'){
            // todo 从topWinArr 中移除窗口对象
            // exitTopWin(winObj);
            logger.info(`窗口${winObj.sign} 已经从topWinArr 中移除`);
        }
        winObj.win.destroy();
        winObj.win = null;
        _winArr.splice(_winArr.indexOf(winObj),1);
        return true;
    }
    return false;
}



/**
 * 遍历绑定窗口的句柄
 */
function winTryConnect(): void {
    if (checkTimer) {
        clearTimeout(checkTimer);
        // 清除计时器
    }

    checkTimer = setTimeout(() => {
        let connectedTotal = 0;
        let i = 0;
        for (let j = 0; j < _winArr.length; j++) {
            let item = _winArr[j];
            i++;
            if (!item.isConnected) {
                // console.log(item);
                logger.info(`正在连接窗口${i}/${_winArr.length}, sign=${item.sign}, connectedTotal=${connectedTotal}`);
                if (item.win) {
                    item.win.webContents.send(actionMap.bindSignId.code, {
                        signId: item.sign,
                        baseUrl: `${BaseUrl}:${WebPort}`,
                        key: _webServer? _webServer.$serverKey : '',
                    });
                } else {
                    logger.error(`窗口 ${item.sign} 的窗口对象不存在`);
                }
            } else {
                connectedTotal++;
            }
        }
        if (connectedTotal === _winArr.length) {
            logger.info("窗口已经全部连接完成");
            clearTimeout(checkTimer);
        } else {
            winTryConnect();
        }
    }, 500);
}


/** 绑定app方便在这里面进行退出操作 */
function registerApp(newApp: Electron.App) {
    _app = newApp;
}

function registerWin(windowConfig: AppWindow): AppWindow{
    let defaultWin : AppWindow = {
        id: '',
        sign: '',
        parentSign: '',
        type: '',
        title: '未知窗口',
        description: '窗口描述文件',
        win: null,
        isMain: false,
        timer: null,// 等待销毁计时器
        hide: false,// 是否隐藏
        isConnected: false,// 是否已经建立连接
        isUsed: false,// 是否被使用中,用于复用窗口
        destroyWait: 30,
        style: {
            width: 0,
            height: 0,
            x: 0,
            y: 0
        }
    }
    let finalWindow = {...defaultWin, ...windowConfig }
    finalWindow.id = _generate_unique_window_id();
    finalWindow.sign = `${finalWindow.type}:${finalWindow.id}`;

    // 窗口挂载
    if (!finalWindow.win || !finalWindow.sign) {
        //窗口挂载成功
        logger.error(`窗口挂载失败,窗口标记:${finalWindow.sign},窗口数量${_winArr.length}`);
    }

    _winArr.push(finalWindow);
    logger.info(`窗口挂载成功,窗口标记:${finalWindow.sign},窗口数量${_winArr.length}`);

    winTryConnect();



    return finalWindow;
}

function _createMainWindow(){
    let MainUrl : string = `app://index.html`
    // let  preloadPath = path.join(__dirname, 'preload.js');
    if (process.argv[2]) {
        console.log(process.argv[2])
        MainUrl = process.argv[2];
    } else {
        CustomScheme.registerScheme();
        MainUrl = `app://index.html`
    }
    let config: BrowserWindowConstructorOptions = {
        width: 1000,
        height: 620,
        frame: false, //任务栏是否显示
        show: true,
        transparent: false, //无边框
        resizable: false,// 禁止 重新设置窗口大小
        maximizable: false, //禁止最大化
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true,
            contextIsolation: false,
            webviewTag: true,
            spellcheck: false,
            disableHtmlFullscreenWindowResize: true,
        },
    };
    let mainWindow = new BrowserWindow(config);
    mainWindow.loadURL(MainUrl);
    mainWindow.webContents.openDevTools();
    return mainWindow;
}
export async function initApp(appConfig: AppConfig, app: Electron.App) : Promise<AppWindow | null>{
    logger.info('start init control window');
    let mainWindow : BrowserWindow = _createMainWindow();
    let err, port: number, server: FcServer | null;
    _appConfig = appConfig;
    [err,port] = await getAvailablePort(WebPort,300);
    if (port === -1){
        logger.error(`[应用初始化] 获取可用端口失败`);
        return null
    }
    WebPort = port;
    logger.info(`get allow webPort: ${WebPort}`);
    // 启动web服务
    [err, server] = await startServer(WebPort, _appConfig.enableIpv6);
    if (err){
        logger.error(`[应用初始化] 启动web服务失败: ${err}`);
        return null
    }
    logger.info(`[应用初始化] 启动web服务成功`);
    _webServer = server;

    // 初始化钩子函数
    initHook();
    // 初始化 Ipc 监听
    initIpc();

    // 创建主窗口
    let mainWin = registerWin({
        type: 'main',
        title: '主进程窗口',
        win: mainWindow,
        isMain: true,
    });

    // 绑定主进程
    registerApp(app)



    return mainWin;
}


async function exit(){
    logger.info(`[应用退出] 应用退出中....`);
    if(!_app){
        logger.error(`[应用退出] 无法找到主应用. 非常离奇的情况, 按理说不应该这样的`);
        return 0;
    }
    isExitAppTask = true;
    // fixme: 修复退出软件时,窗口不会关闭的问题. 以及引用问题
    while(_winArr.length > 0){
        let winObj = _winArr.pop() as AppWindow;
        if(!winObj.win){
            logger.error(`[应用退出] 无法找到窗口对象, 需要修复呢`);
            continue;
        }
        // if(winObj.type === 'top'){
        //     // 从topWinArr 中移除窗口对象
        //     exitTopWin(winObj);
        // }
        // 移除所有win的监听事件
        winObj.win.removeAllListeners();
        winObj.win.close();
        winObj.win.destroy();
        winObj.win = null;
    }
    console.log(`退出软件`);
    // 清理窗口
    _app.quit();
    return 0;
}


export default {
    isExitAppTask,
    findWin,
    removeWin,
    exit
}
