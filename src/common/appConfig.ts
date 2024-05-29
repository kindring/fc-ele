// import {app} from "electron";
import Path from "path";

import Logger from '../util/logger';
import fs from "fs";
import path from "path";
import {AppConfig} from "@/types/appConfig.ts";
import {getUserHomePath} from "@/util/pathTool.ts";


let logger = Logger.logger('config', 'info');
// const appPath = app.isPackaged ? Path.dirname(app.getPath('exe')) : app.getAppPath();
let userPath = getUserHomePath();
const configPath = Path.resolve( userPath,`configs/fc-ele.json`);
logger.info(`[config app] configPath: ${configPath}`);

const defaultConfig : AppConfig = {
    // 项目高级配置文件 使用nedb存储至用户目录
    dbPath: '',
    // 退出时是否提示
    exitQuestion: true,
    // 直接退出或者缩小到托盘
    exitMode: 'normal',
    // 快捷键
    hotKey: {
        // 显示
        show: 'ctrl+alt+h',
        min: 'ctrl+alt+x',
    },
    // 窗口队列
    saveWinSize: 1,
    enableIpv6: true,
};

let _config: null|AppConfig = null;

// 加载项目配置文件 json
function _loadProjectConfig(): null|AppConfig {
    let config: null|AppConfig = null;
    try {
        let data = fs.readFileSync(configPath, 'utf-8');
        // fs 的 buffer 转字符串
        config = JSON.parse(data.toString());
    } catch (err) {
        logger.error(err);
    }
    return config;
}

function _saveProjectConfig(config: AppConfig): boolean {
    try {
        // 判断目录是否存在
        if(!fs.existsSync(path.dirname(configPath))){
            logger.info("创建默认配置文件");
            fs.mkdirSync(path.dirname(configPath));
        }
        fs.writeFileSync(configPath, JSON.stringify(config));
        return true;
    } catch (err) {
        logger.error(err);
        logger.info("save config file fail")
        return false;
    }
}

// 修改配置文件
// function _changeConfig(key: string, value: any): boolean {
//     if(!_config){
//         return false;
//     }
//     _config = {
//     ..._config,
//         [key]: value,
//     };
//     return _saveProjectConfig(_config);
// }


export function saveConfig(appConfig: AppConfig): boolean {
    return _saveProjectConfig(appConfig);
}

export function getProjectConfig() : Promise<AppConfig> {
    return new Promise((resolve, reject) => {
        let config = _loadProjectConfig();
        if(config){
            resolve(config);
        }else{
            reject()
        }
    })
}



export function initData(): AppConfig {
    let config = _loadProjectConfig();
    if(!config){
        logger.info("init config");
        config = defaultConfig;
    }
    // 合并config
    _config = {
        ...defaultConfig,
        ...config,
    };
    // 保存配置文件
    _saveProjectConfig(_config);

    // 创建数据库
    return _config;
}



