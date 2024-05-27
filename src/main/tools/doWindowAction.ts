import AppControl, {winTryConnect} from "../AppControl.ts";
import Logger from "../../util/logger.ts";
import {AppWindow} from "../../types/appConfig.ts";

let logger = Logger.logger('doWindowAction', 'info');

export async function connectedWin(sign: string){
    let winObj = AppControl.findWin(sign);
    if(winObj){
        logger.info(`[窗口挂载] 窗口连接成功:${winObj.title}`);
        winObj.isConnected = true;
    }
}

export async function tryConnectWin(type: string){
    // 寻找窗口
    let winArr = AppControl.findWinByType(type)
    logger.info(`[前端链接窗口] 寻找${type}类型的窗口`);
    if (winArr.length === 0) {
        logger.error(`[前端链接窗口] 未找到${type}类型的窗口,尝试创建 ....`);
        return;
    }
    // 循环修改窗口连接状态
    winArr.forEach(winObj => {
        winObj.isConnected = false;
    });
    winTryConnect();
}


/**
 * 关闭指定窗口
 * @param {String} sign 窗口标记
 */
export function closeWin(sign: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        if(AppControl.isExitAppTask){
            logger.info('退出任务中,不允许关闭窗口');
            return reject(Error(`[关闭窗口] 窗口${sign}不存在`));
        }
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win){
            logger.info(`[关闭窗口] 窗口${sign}不存在`);
            return reject(Error(`[关闭窗口] 窗口${sign}不存在`));
        }
        try {
            if(winObj.isMain){
                return _tryCloseMain(winObj);
            }
            logger.info(`[关闭窗口] 窗口{${sign}} 进入准备移除阶段`);
            // 先隐藏窗口,等待1分钟关闭后再进行删除
            winObj.hide = true;
            winObj.win.hide();
            // 多次点击时可能无法正常清理定时器
            if(winObj.timer) clearTimeout(winObj.timer);
            winObj.timer = setTimeout(
                ()=>{
                    logger.info(`[关闭窗口] 开始移除{${sign}}占用`);
                    if(!winObj || !winObj.win) return logger.warn(`[关闭窗口] 移除窗口{${sign}}时,窗口对象已经被销毁`);
                    logger.info(`[关闭窗口] 移除窗口${sign}监听事件`);
                    // 移除窗口监听事件
                    winObj.win.webContents.removeAllListeners();
                    winObj.win.removeAllListeners();
                    if(winObj.win.isDestroyed()) return ;
                    winObj.win.close();
                    winObj.win.destroy();
                    let flag = AppControl.removeWin(sign);
                    if(!flag){
                        logger.warn(`[关闭窗口] 移除窗口${sign}失败`);
                        return resolve(false);
                    }
                    logger.info(`[关闭窗口] 清理窗口${sign}资源完成`);
                    resolve(true);
                },
                winObj.destroyWait ?? 5 * 1000
            );
        } catch (error) {
            logger.error(error);
            logger.info('关闭窗口失败');
            reject(error);
        }
    });
}

export function minWin(sign: string) {
    return new Promise((resolve, reject) => {
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[最小化窗口] 窗口${sign}不存在`));
        try {
            winObj.win.minimize();
            logger.debug('最小化窗口: ' + winObj.title);
            resolve(true);
        } catch (error) {
            logger.error('最小化窗口失败');
            reject(error);
        }
    });
}

/**
 * 最大化窗口或者恢复窗口
 * @param {String} sign 窗口标记
 *
*/
export function maxWin(sign: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[最大化窗口] 窗口${sign}不存在`));
        try {
            if (!winObj.win.isMaximizable()) {
                let size = winObj.win.getSize();
                // 获取位置
                let pos = winObj.win.getPosition();
                winObj.style.width = size[0];
                winObj.style.height = size[1];
                winObj.style.x = pos[0];
                winObj.style.y = pos[1];
                console.log(winObj.style)
                // 修改窗口状态
                winObj.win.maximize();
                resolve(true)
            } else {
                logger.debug(`窗口${winObj.title}已经最大化`)
                resolve(false)
            }

        } catch (error) {
            reject(error);
        }
    });
}


export function unMaxWin(sign: string): Promise<boolean> {
    return new Promise((resolve,reject)=>{
        try {
            let winObj = AppControl.findWin(sign);
            if(!winObj || !winObj.win) return reject(Error(`[取消最大化窗口] 窗口${sign}不存在`));
            if(!winObj.style) {
                logger.info(`[取消最大化窗口] 窗口${sign}没有保存窗口大小 使用默认配置`);
                winObj.style = {
                    width: 1000,
                    height: 700,
                    x: 0,
                    y: 0,
                }
            }
            // 如果是未启用无边框窗口则恢复窗口尺寸
            // restoreWin(sign);

            // 如果是启用了 无边框 以及透明窗口则设置窗口尺寸
            winObj.win.setContentSize(winObj.style.width, winObj.style.height);
            winObj.win.setPosition(winObj.style.x, winObj.style.y);
            // winObj.win.center(); // 窗口居中
            resolve(true);
        } catch (error) {
            reject(error);
        }
    })
}

export function restoreWin(sign: string): Promise<boolean> {
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[恢复窗口] 窗口${sign}不存在`));
        try {
            winObj.win.restore();
            logger.debug('恢复窗口: ' + winObj.title);
            resolve(true)
        } catch (error) {
            logger.error('恢复窗口失败')
            reject(error)
        }
    })
}


/** 置顶指定窗口 */
export function topWin(sign: string): Promise<boolean> {
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[置顶窗口] 窗口${sign}不存在`));
        try {
            if (!winObj.win.isAlwaysOnTop()) {
                winObj.win.setAlwaysOnTop(true, 'normal', 1);
                // logger.info('置顶窗口: ' + winObj.title);
                resolve(true);
            } else {
                // logger.info('窗口已经置顶');
                resolve(false);
            }
        } catch (err) {
            let error = err as Error;
            logger.info('置顶窗口失败');
            logger.error(error.message);
            reject(err);
        }
    });
}


export function unTopWin(sign: string): Promise<boolean> {
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[取消置顶窗口] 窗口${sign}不存在`));
        try {
            winObj.win.setAlwaysOnTop(false);
            logger.debug('取消置顶:' + winObj.title);
            resolve(true);
        } catch (err) {
            logger.info('取消置顶窗口失败');
            let error = err as Error;
            // logger.info('置顶窗口失败');
            logger.error(error.message);
            reject(err);
        }
    });
}



export function hideWin(sign: string){
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[隐藏窗口] 窗口${sign}不存在`));
        try {
            winObj.hide = true;
            winObj.win.hide();
            logger.debug('隐藏窗口:' + winObj.title);
            resolve(true);
        } catch (err) {
            logger.debug('隐藏窗口失败');
            let error = err as Error;
            // logger.info('置顶窗口失败');
            logger.error(error.message);
            reject(err);
        }
    });
}

export function showWin(sign: string){
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[显示窗口] 窗口${sign}不存在`));
        try {
            winObj.hide = false;
            winObj.win.show();
            logger.debug('显示窗口:' + winObj.title);
            resolve(true);
        } catch (err) {
            logger.debug('显示窗口失败');
            let error = err as Error;
            // logger.info('置顶窗口失败');
            logger.error(error.message);
            reject(err);
        }
    });
}



export function centerWin(sign: string){
    return new Promise((resolve,reject)=>{
        let winObj = AppControl.findWin(sign);
        if(!winObj || !winObj.win) return reject(Error(`[居中窗口] 窗口${sign}不存在`));
        try {
            winObj.win.center();
            logger.debug('居中显示窗口:' + winObj.title);
            resolve(true);
        } catch (err) {
            logger.debug('居中显示窗口失败');
            let error = err as Error;
            // logger.info('置顶窗口失败');
            logger.error(error.message);
            reject(err);
        }
    });
}



/** 申请退出软件 */
async function _tryCloseMain(mainWinObj: AppWindow) : Promise<[Error | null, boolean]> {
    // let err, res;
    // 判断是隐藏还是退出
    // 判断是否已经在询问是否退出
    // if (mainWinObj.isQueryClose) {
    //     logger.info('已经在询问是否退出了,不多弹窗');
    //     return [null, false];
    // }
    mainWinObj.isQueryClose = true;
    // [err, res] = await openQueryPage(mainWinObj.sign, {
    //     type: 'question',
    //     title: "是否退出应用?",
    //     okText: "退出",
    //     cancelText: "缩小到托盘",
    // });
    // logger.info("询问是否关闭窗口");
    // mainWinObj.isQueryClose = false;
    // if(err){
    //     logger.error(err);
    //     return [null,false];
    // }
    // if(res){
    //     if(res.action === 'ok'){
    //         logger.info('确认关闭窗口');
    //         exit();
    //     }else if(res.action === 'cancel'){
    //         logger.info('隐藏窗口');
    //         // 隐藏窗口
    //         hideWin(mainWinObj.sign);
    //     }else if (res.action === 'close'){
    //         // 毫无作为
    //     }
    // }
    return [null,true];
}



