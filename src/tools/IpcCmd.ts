export interface IpcAction {
    title: string;
    icon: string;
    code: string;
    resCode: string;
}


export const actionMap = {
    min: {
        title: '最小化',
        icon: 'minimize',
        code: 'minWin',
        resCode: 'minWin_replay'
    },
    restore: {
        title: '恢复窗口',
        icon: 'restore',
        code: 'restoreWin',
        resCode: 'restoreWin_replay'
    },
    max: {
        title: '最大化',
        icon: 'maximize',
        code: 'maxWin',
        resCode: 'maxWin_replay'
    },
    unMax: {
        title: '还原窗口大小',
        icon: 'restore',
        code: 'unMaxWin',
        resCode: 'unMaxWin_replay'
    },
    close: {
        title: '关闭窗口',
        icon: 'minimize',
        code: 'closeWin',
        resCode: 'closeWin_replay'
    },
    ding: {
        title: '置顶',
        icon: 'top',
        code: 'topWin',
        resCode: 'topWin_replay'
    },
    unDing: {
        title: '取消置顶',
        icon: 'unTop',
        code: 'unTopWin',
        resCode: 'unTopWin_replay'
    },
    show: {
        title: '显示窗口',
        icon: 'show',
        code: 'showWin',
        resCode: 'showWin_replay'
    },
    hide: {
        title: '隐藏窗口',
        icon: 'hide',
        code: 'hideWin',
        resCode: 'hideWin_replay'
    },
    openSetting: {
        title: '打开设置页面',
        icon: 'setting',
        code: 'openSetting',
        resCode: 'openSetting_replay'
    },
    exitApp: {
        title: '退出软件',
        icon: 'top',
        code: 'exitApp',
        resCode: 'exitApp_replay'
    },
    bindSignId: {
        title: "绑定窗口句柄",
        icon: 'connect',
        code: 'bindSignId',
        resCode: 'bindSignId_replay'
    },
    questionUser: {
        title: '询问用户弹窗',
        icon: 'query',
        code: 'questionUser',
        resCode: 'userAnswer'
    },
    apiControl: {
        title: 'api调用',
        icon: 'api',
        code: 'apiControl',
        resCode: 'apiControl_replay'
    },
    enableIgnoreMouse: {
        title: '开启鼠标穿透',
        icon: 'mouse',
        code: 'enableIgnoreMouse',
        resCode: 'enableIgnoreMouse_replay'
    },
    disableIgnoreMouse: {
        title: '关闭鼠标穿透',
        icon: 'mouse',
        code: 'disableIgnoreMouse',
        resCode: 'disableIgnoreMouse_replay'
    }
}

export const windowAction: { [key: string]: IpcAction } = {
    min: actionMap.min,
    restore: actionMap.restore,
    max: actionMap.max,
    unMax: actionMap.unMax,
    close: actionMap.close,
    ding: actionMap.ding,
    unDing: actionMap.unDing,
    show: actionMap.show,
    hide: actionMap.hide,
    openSetting: actionMap.openSetting,
    exitApp: actionMap.exitApp,
    bindSignId: actionMap.bindSignId,
    questionUser: actionMap.questionUser,
    enableIgnoreMouse: actionMap.enableIgnoreMouse,
    disableIgnoreMouse: actionMap.disableIgnoreMouse,
};
