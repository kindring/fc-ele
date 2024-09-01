import {ApplicationInfo, RunApplicationInfo} from "@/types/application.ts";

export let testApplications:ApplicationInfo[] = [
    {
        key: 'music',
        name: '音乐',
        pinyin: 'yinyue',
        en: 'music',
        icon: 'music',
        allowMulti: false,
        minHeight: 600,
        minWidth: 800,
    },
    {
        key: 'setting',
        name: '软件设置',
        pinyin: 'shezhi',
        en: 'setting',
        icon: 'setting',
        allowMulti: false,
        minHeight: 600,
        minWidth: 800,
    },
]

// 已经启动的app 列表
export let runningApplications:RunApplicationInfo[] = []


function genAppId(key: string, num: number = 0): string {
    let appId = `${key}-${num}`
    let app = runningApplications.find(item => item.id === appId)
    if (app) {
        return genAppId(key, num + 1)
    }
    return appId
}
function runApp(appInfo: ApplicationInfo): RunApplicationInfo {

    let appId = genAppId(appInfo.key + runningApplications.length)
    let app:RunApplicationInfo = {
        id: appId,
        key: appInfo.key,
        show: true,
        full: false,
        index: 0,
        name: appInfo.name,
    }
    return app
}


export function openApp(appInfo: ApplicationInfo) {
    let app = null;
    if (appInfo.allowMulti) {
        // 允许多开
        app = runApp(appInfo)
        runningApplications.push(app)
    } else {
        // 不允许多开
        app = runningApplications.find(item => item.id)
    }
    if(!app){
        app = runApp(appInfo)
        runningApplications.push(app)
    }
}

export function closeApp(app: RunApplicationInfo) {
    let appIndex = runningApplications.findIndex(item => item.id === app.id)
    if (appIndex === -1) {
       return console.error('app not found')
    }
    runningApplications.splice(appIndex, 1)
}
