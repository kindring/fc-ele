// 自定义维护 hook
// 1. 用于维护自定义的 hook

// 类型定义
import Logger from "./logger.ts";

// 定义 HookFn 类型
export type HookFn<T> = (...args: T[]) => Promise<T>;

interface Hook {
    id: string;
    tips: string;
    key: string;
    hookFn: HookFn<any>;
}

type HookArray = Hook[];

const logger = Logger.logger('hook.js', 'init');

let hookArr: HookArray = [];
//
// let defaultHook: Hook = {
//     tips: '',
//     key: '',
//     hookFn: Promise.resolve(),
// }

// 随机生成 id
function randomId(): string {
    return Math.random().toString(36).substr(4);
}

function findHook(key: string): Hook | undefined {
    return hookArr.find(value => value.key === key);
}

/**
 * 添加 hook
 * @param key
 * @param hookFn {Promise<any>} 要添加的 hook
 * @param fnName
 * @returns {string}
 */
export function addHook(key: string, hookFn: HookFn<any>, fnName: string): string {
    logger.info(`添加 hook:${key}-${fnName}`);
    let hook = findHook(key);
    if (!hook) {
        hook = {
            id: randomId(),
            tips: fnName,
            key: key,
            hookFn: hookFn,
        }
        hookArr.push(hook);
    }
    return hook.id;
}

/**
 * 移除 hook
 * @param key
 * @param id
 * @returns {boolean}
 */
export function removeHook(key: string, id: string): boolean {
    let hook = findHook(key);
    if (!hook) {
        return false;
    }
    let index = hookArr.findIndex(value => value.id === id);
    if (index === -1) {
        return false;
    }
    hookArr.splice(index, 1);
    return true;
}

/**
 * 触发 hook
 * @param key
 * @param args 要传递的参数
 * @returns {Promise<any>}
 */
export function runHook(key: string, ...args: any[]): Promise<[any , any]> {
    //
    logger.info(`触发 hook:${key}`);
    return new Promise(async (resolve, _) => {
        let hook = findHook(key);
        if (!hook) {
            resolve([Error('没有找到 hook'), null]);
            return;
        }
        let result = hook.hookFn(...args);
        result.then((result) => {
            resolve([null, result]);
        }).catch((error) => {
            resolve([error, null]);
        });
    });
}

/**
 * 获取 hook
 * @param key
 * @returns {boolean|*}
 */
export function getHook(key: string): Hook | boolean {
    let hook = findHook(key);
    if (!hook) {
        return false;
    }
    return hook;
}

/**
 * 设置 hook 的 tips
 * @param key
 * @param tips
 * @returns {boolean}
 */
export function setHookTips(key: string, tips: string): boolean {
    let hook = findHook(key);
    if (!hook) {
        return false;
    }
    hook.tips = tips;
    return true;
}

export default {
    addHook,
    removeHook,
    runHook,
    getHook,
    setHookTips,
}
