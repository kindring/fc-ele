/*
 * @Description: 日志工具函数
 * @Autor: kindring
 * @Date: 2021-12-14 14:07:17
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-14 14:46:16
 * @LastDescript:
 */
import Path from 'path';
import log4js from 'log4js';
// import {app} from "electron";
import path from "path";
import os from "os";

let levels: { [key: string]: log4js.Level } = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL,
}

const logFileName = 'fcE.log';
let userPath = path.join(os.homedir(), '/fc-ele/');
// const appPath = app.isPackaged ? Path.dirname(app.getPath('exe')) : app.getAppPath();
const _path = process.env.WEBPACK_DEV_SERVER_URL?`logs/${logFileName}`: Path.resolve( userPath,`/logs/${logFileName}`);
console.log(_path);

const config = {
    // 输出到控制台的内容，同时也输出到日志文件中
    replaceConsole: true,
    appenders: {
        cheese: {
            // 设置类型为 dateFile
            type: 'dateFile',
            // 配置文件名
            filename: _path,
            // 指定编码格式为 utf-8
            encoding: 'utf-8',
            // 配置 layout，此处使用自定义模式 pattern
            // layout: 'basic',
            // 日志文件按日期（天）切割
            pattern: "yyyy-MM-dd",
            // 保留10天的日志文件
            backups:10,
            // 回滚旧的日志文件时，保证以 .log 结尾 （只有在 alwaysIncludePattern 为 false 生效）
            keepFileExt: true,
            // 输出的日志文件名是都始终包含 pattern 日期结尾
            alwaysIncludePattern: true,
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        // 设置默认的 categories
        default: { appenders: ['cheese', 'console'], level: 'debug' },
    }
}
// 加载配置文件
log4js.configure(config);


function logger(name: string, level: string) {
    const logger = log4js.getLogger(name)
    // 默认为debug权限及以上
    logger.level = levels[level] || levels['debug']
    return logger
}

export default {
    logger,
}

