
import { app } from "electron";

import Logger from "../util/logger.ts";
import {initData} from "../common/appConfig.ts";
import {initApp} from "./AppControl.ts";
import {AppWindow} from "../types/appConfig.ts";


let mainWindow: AppWindow | null;

const isDevelopment = process.env.NODE_ENV !== 'production'

let logger = Logger.logger('background.js', 'info');
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    logger.info("[fc-ele] 应用已经启动");
    app.quit();
}else {
    let version = app.getVersion();
    logger.info(`[fc-ele] ---------file Control for electron (FC-ELE):${version}---------`);
    // event listen
    app.on('window-all-closed', handle_windowAllClosed);
    app.on('activate', handle_activate)
    app.whenReady().then(handle_ready).catch(
        (e) => {
            logger.error("[fc-ele] app whenReady error", e.toString());
        }
    )
}

function handle_windowAllClosed(){
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
}

function handle_activate(){
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow?.win === null) {
        logger.info("[fc-ele] app activate")
        startApp();
    }
}

function handle_ready(){
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        // try {
        //     await installExtension(VUEJS_DEVTOOLS)
        // } catch (e) {
        //     console.error('Vue Devtools failed to install:', e.toString())
        // }
    }
    logger.info("[fc-ele] app ready")
    setTimeout(() => {
        startApp();
    }, 100);
    // startApp();
}

async function startApp(){
    let appConfig = initData();
    logger.info(`配置文件加载完成,${JSON.stringify(appConfig)}`);
    //
    mainWindow = await initApp(appConfig, app);
    if(!mainWindow || !mainWindow.win){
        app.quit();
        return;
    }
    mainWindow.win.on('closed', () => {
        mainWindow!.win = null
    });
}


//
// app.whenReady().then(() => {
//     let config = {
//         webPreferences: {
//             nodeIntegration: true,
//             webSecurity: false,
//             allowRunningInsecureContent: true,
//             contextIsolation: false,
//             webviewTag: true,
//             spellcheck: false,
//             disableHtmlFullscreenWindowResize: true,
//         },
//     };
//     mainWindow = new BrowserWindow(config);
//     if (process.argv[2]) {
//         console.log(process.argv[2])
//         mainWindow.loadURL(process.argv[2]);
//     } else {
//         CustomScheme.registerScheme();
//         mainWindow.loadURL(`app://index.html`);
//     }
//     // 开启控制台
//     mainWindow.webContents.openDevTools();
// });
