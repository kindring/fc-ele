import {ApplicationInfo, RunApplicationInfo} from "@/types/application.ts";
import {NavItem} from "@/components/appleBar/appleBar.ts";
import message from "@/components/public/kui/message";
import {computed, reactive} from "vue";

export let Applications:ApplicationInfo[] = [
    {
        key: 'music',
        name: '音乐',
        pinyin: 'yinyue',
        en: 'music',
        icon: 'music',
        allowMulti: false,
        minHeight: 600,
        minWidth: 800,
        description: '音乐播放器',
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
        description: '软件设置',
    },
]

// 已经启动的app 列表
export let runningApplications:RunApplicationInfo[] = reactive([]);

// 使用computed 根据 runningApplications 动态生成 navItems
export const runNavComputed = computed(
    () => runningApplications.map(item => {
        let rawAppInfo = Applications.find(appInfo => appInfo.key === item.key)
        if(!rawAppInfo)
        {
            throw new Error(`app not found: ${item.key}`)
        }
        return {
            id: item.id,
            name: rawAppInfo.name,
            icon: rawAppInfo.icon,
            description: rawAppInfo.description,
            actionCode: item.id
        } as NavItem;
    }))

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
    console.log(appInfo.name);
    let app:RunApplicationInfo = {
        id: appId,
        key: appInfo.key,
        show: true,
        full: false,
        index: 0,
        showTitle: appInfo.name,
    }
    return app
}


export function openApp(key: string) {
    let appInfo = Applications.find(item => item.key === key)
    let app = null;
    if(!appInfo)
    {
        message.error(`应用不存在: ${key}`);
        return
    }
    if (appInfo.allowMulti) {
        // 允许多开
        app = runApp(appInfo)
        runningApplications.push(app)
    } else {
        // 不允许多开
        app = runningApplications.find(item => item.key === appInfo.key)
        if(!app){
            app = runApp(appInfo)
            runningApplications.push(app)
        } else {
            app.show = true
        }

    }

}

// 将指定app设置为最上端
export function setAppTop(app: RunApplicationInfo) {
    for (let i = 0; i < runningApplications.length; i++)
    {
        let nextIndex = runningApplications[i].index - 1;
        if (runningApplications[i].id === app.id) {
            nextIndex = runningApplications.length
        }
        if (nextIndex <= 0 )
        {
            nextIndex = 1;
        }
        runningApplications[i].index = nextIndex;
    }
}
export function closeApp(app: RunApplicationInfo) {
    let appIndex = runningApplications.findIndex(item => item.id === app.id)
    if (appIndex === -1) {
       return console.error('app not found')
    }
    runningApplications.splice(appIndex, 1)
}


export function getRunAppNavigation(): NavItem[] {
    return runningApplications.map(item => {
        let rawAppInfo = Applications.find(appInfo => appInfo.key === item.key)
        if(!rawAppInfo)
        {
            throw new Error(`app not found: ${item.key}`)
        }
        return {
            id: item.id,
            name: rawAppInfo.name,
            icon: rawAppInfo.icon,
            description: rawAppInfo.description,
            actionCode: item.id
        } as NavItem;
    })
}
