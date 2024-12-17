/**
 * 返回基础api的请求函数, 用于封装请求. 用于同时支持浏览器和electron环境
 */
import {ApiType, ErrorCode, NotifyData, RequestData, ResponseData} from "@/types/apiTypes.ts";
import {randomId} from "@/util/random.ts";

interface CallItem {
    callId: string;
    action: string;
    resolve: (value: ResponseData<any>) => void;
    reject: (reason: any) => void;
    endTime: number;
    // 是否在初始化前尝试发送
    isInit: boolean;
}
interface Calls {
    [key: string]: CallItem;
}

interface NotifyItem {
    action: string;
    handlers: {
        [key: string]:{
            callback: (params: any) => void;
            isOnce: boolean;
        }
    }
}
interface NotifyMap {
    [key: string]: NotifyItem;
}

// 定义send函数的数据类型
export type SendFunction = (channel: string,     ...args: any[])=> void

export type ListenerFunction = (channel: string, listener: (event: any, ...args: any[]) => void) => void



export class ApiController {
    type = ''
    signId = ''
    calls: Calls = {}
    notifyMap: NotifyMap = {}
    // 最近的一个过期时间
    lastCheckTime = 0
    // 最近的过期检测id
    lastCheckId: string = ""
    checkTimer: NodeJS.Timeout | null = null
    // 下一次检测的间隔时间, 毫秒
    checkInterval = 10
    isInit: boolean = false
    // init 前尝试发送的数据
    sendTasks: RequestData[] = []
    // init 前尝试取消的发送
    cancelTasks: string[] = []
    sendCallback: SendFunction | null = null;
    sendKey: string = ""
    listenerKey: string = ""
    listenerCallback: ListenerFunction | null = null;
    logFn: (...args: any[]) => void = console.log
    constructor() {
    }
    init(type: string, sendCallback: SendFunction, listenerCallback: ListenerFunction, sendKey: string, listerKey: string, signId: string){
        this.isInit = true
        this.type = type
        this.sendCallback = sendCallback
        this.listenerCallback = listenerCallback
        this.sendKey = sendKey
        this.listenerKey = listerKey
        this.signId = signId

        // listenerCallback(listerKey, this.apiControllerHandler)
        this.sendTasks.forEach(requestData => {
            requestData.signId = this.signId
            console.log(`[I] sendTasks: ${JSON.stringify(requestData)}`)
            sendCallback(sendKey, requestData)
            this.refreshTimeout(requestData.callId, requestData.timeout)
        })
        this.cancelTasks.forEach(callId => {
            this.cancelQuery(callId)
        })
    }
    setLogFn(logFn: (...args: any[]) => void){
        this.logFn = logFn
    }
    /**
     * 构建新的callId
     */
    private buildCallId( deep: number = 0) : string {
        let callId = randomId()
        if(!this.calls[callId]){
            return callId
        }
        if(deep > 10){
            return `${callId}${deep}${randomId()}`
        }
        return this.buildCallId(deep++)
    }
    /**
     * 构建新的notifyId
     */
    private buildNotifyId(action: string, deep: number = 0) : string {
        let notifyId = randomId()
        if(!this.notifyMap[action] || !this.notifyMap[action].handlers[notifyId]){
            return notifyId
        }
        if(deep > 10){
            return `${notifyId}${deep}${randomId()}`
        }
        return this.buildNotifyId(action)
    }
    public apiControllerHandler = (_:any, data: ResponseData<any> | NotifyData) =>
    {
        console.log(`[I] apiControllerHandler: ${JSON.stringify(data)}`)
        switch(data.type){
            case ApiType.res:
                if(this.calls[data.callId]){
                    this.callResponseHandle(this.calls[data.callId], data)
                }
                break;
            case ApiType.notify:
                if(this.notifyMap[data.action])
                {
                    this.notifyHandle(this.notifyMap[data.action], data)
                }
                break;
        }
    }
    private callResponseHandle = (call: CallItem, responseData: ResponseData<any>) => {
        if( this.lastCheckId === call.callId){
            // 取消检测当前函数的定时器, 防止多次触发
            if(this.checkTimer){
                clearTimeout(this.checkTimer)
            }
            this.checkTimer = null
            this.lastCheckId = "";
            this.lastCheckTime = 0;
        }
        // 执行回调
        call.resolve(responseData)
        // 从队列中删除
        delete this.calls[call.callId]
        this.findNextTimeoutCall()
    }
    private notifyHandle(notify: NotifyItem, data: NotifyData) {
        for (const notifyHandleId in notify.handlers) {
            let notifyHandle = notify.handlers[notifyHandleId]
            notifyHandle.callback(data)
            if(notifyHandle.isOnce){
                delete notify.handlers[notifyHandleId]
            }
        }
    }


    private startTimeoutCheck(callId: string){
        // 获取当前的时间戳
        let nowTimeStamp = Date.now()
        // 获取对应call的超时时间
        let callItem = this.calls[callId]
        if (!callItem)
        {
            return this.logFn(`[E] startTimeoutCheck: ${callId} not found`)
        }

        let timeWait = callItem.endTime - nowTimeStamp - this.checkInterval
        console.log(`[I] startTimeoutCheck: ${callId} timeWait: ${timeWait}`)
        // 在已经有一个超时检查的情况下, 判断新的超时时间是否小于当前正在执行的超时时间. 用于将计时器更新为最新的
        if(this.lastCheckId && callId !== this.lastCheckId){
            if(callItem.endTime < this.lastCheckTime){
                this.lastCheckTime = callItem.endTime
                this.lastCheckId = callId
                // 取消计时器
                if(this.checkTimer)
                {
                    clearTimeout(this.checkTimer)
                    this.checkTimer = null
                }
                // 获取
                this.checkTimer = setTimeout(() => {
                    this.checkTimeout()
                }, timeWait)
            }
            return;
        }
        this.lastCheckTime = callItem.endTime
        this.lastCheckId = callId
        // 防止负数导致疯狂执行
        if(timeWait > 0 || timeWait + this.checkInterval > 5){
            if(timeWait < 0){
                timeWait = Math.abs(timeWait)
            }
            this.checkTimer = setTimeout(() => {
                this.checkTimeout()
            }, timeWait)
        }
        // 如果超时时间小于等于0, 立即判断是否已经超时
        if(timeWait <= 0){
            // 立即执行
            this.checkTimeout()
        }
    }
    // 超时检查
    private checkTimeout() {
        let callItem = this.calls[this.lastCheckId]
        if(!callItem || callItem.endTime === -1){
            // 尝试获取calls中获取到期时间最小的一个请求
            this.logFn(`[W] checkTimeout: ${this.lastCheckId} not supported check timeoutDate: ${callItem?.endTime}`)
            return this.findNextTimeoutCall()
        }
        let nowTimeStamp = Date.now()
        if (callItem.endTime < nowTimeStamp){
            return this.callTimeoutHandle(callItem)
        }
        // 暂未超时,
        this.startTimeoutCheck(this.lastCheckId)
    }
    private callTimeoutHandle(callItem: CallItem)
    {
        this.logFn(`[E] ${callItem.callId} timeout endTime:${callItem.endTime}`)
        // 移除超时检查
        this.lastCheckTime = 0;
        this.lastCheckId = "";
        this.callResponseHandle(callItem, {
            type: ApiType.res,
            action: callItem.action,
            callId: callItem.callId,
            code: ErrorCode.timeout,
            msg: '等待api响应数据超时!',
            data: null,
        })
        // 寻找下一个超时检查项
        this.findNextTimeoutCall()
    }
    private findNextTimeoutCall()
    {
        // 遍历请求,
        for(let callId in this.calls){
            let callItem = this.calls[callId]
            if (callItem.endTime === -1){
                continue;
            }
            this.lastCheckTime = callItem.endTime;
            this.lastCheckId = callId;
            if(callItem.endTime < this.lastCheckTime){
                this.lastCheckTime = callItem.endTime
                this.lastCheckId = callId
            }
        }
        if(this.lastCheckId !== ""){
            this.startTimeoutCheck(this.lastCheckId)
        }else{
            // 没有找到超时检查项, 则取消计时器
        }
    }
    // 刷新超时时间
    refreshTimeout(callId: string, timeout: number) {
        let callItem = this.calls[callId]
        if(!callItem){
            return this.logFn(`[E] refreshTimeout: ${callId} not found`)
        }
        callItem.endTime = Date.now() + timeout
        this.startTimeoutCheck(callId)
    }

    /**
     * 修改当前总api的签名
     * @param signId
     */
    changeSign(signId: string) {
        console.log(`[I] changeSign: ${signId}`)
        this.signId = signId
    }

    _findTaskByAction(action)
    {
        return this.sendTasks.find(task => {
            return task.action === action
        })
    }

    /**
     * 调用ipc 获取数据
     * @param action
     * @param params
     * @param timeout
     * @param once 是否合并多个请求
     */
    sendQuery(action: string, params: any, timeout: number = 10 * 1000, once: boolean = false): [callId: string, Promise<ResponseData<any>>] {
        let callId = this.buildCallId()
        let requestData: RequestData = {
            type: ApiType.req,
            signId: this.signId,
            action: action,
            data: params,
            callId: callId,
            timeout: timeout,
        }
        console.log(requestData)
        if (once)
        {
            // 寻找队列中是否存在相同的请求. 如果有则直接返回, 不再发送请求
            let _task = this._findTaskByAction(action);
            if (_task)
            {
                // 返回一个直接触发的promise, 并将此次请求无效化
                let promise: Promise<ResponseData<null>> = new Promise((resolve, reject): Promise<ResponseData<null>> => {
                    resolve({
                        type: ApiType.res,
                        action: action,
                        callId: callId,
                        code: ErrorCode.cancel,
                        msg: '请求被取消',
                        data: null,
                    })
                })
                console.log(`[I] sendQuery: ${action} has same task, return a promise`);
                return [callId, promise];
            }
        }
        if(this.isInit){
            if (this.sendCallback){
                this.sendCallback(this.sendKey, requestData)
            }else {
                this.logFn(`[E] sendQuery: ${action} not init data`)
            }
        }else{
            this.sendTasks.push(requestData)
        }

        // 获取当前的时间戳
        let timeStamp = Date.now()
        // 加上通信超时时间
        let endTime = timeStamp + timeout + 200

        let promise: Promise<ResponseData<any>> = new Promise((resolve, reject) => {
            this.calls[callId] = {
                action: action,
                callId: callId,
                resolve: resolve,
                reject: reject,
                endTime: endTime,
                isInit: !this.isInit,
            }
        })
        // 如果是-1, 则表示不设置超时时间, 永久等待检测
        if(timeout === -1){
            endTime = -1
        }else{
            if(this.isInit){
                console.log(`[I] start timeout check: ${callId} now: ${timeStamp} endTime: ${endTime} wait: ${timeout}`)
                this.startTimeoutCheck(callId)
            }else{
                this.logFn(`!!!Try calling the send function before initializing`)
            }
        }
        return [callId, promise]
    }
    registerNotify(action: string, isOnce: boolean = false, callback: (params: NotifyData) => void): string {
        if (!this.notifyMap[action]) {
            // 初始化 notify 对象
            this.notifyMap[action] = {
                action: action,
                handlers: {},
            }
        }
        let callId = this.buildNotifyId(action)
        this.notifyMap[action].handlers[callId] = {
            callback: callback,
            isOnce: isOnce,
        }
        return callId
    }
    // 取消方法
    cancelQuery(callId: string) {
        if(this.calls[callId]){
            this.callResponseHandle(this.calls[callId], {
                type: ApiType.res,
                action: this.calls[callId].action,
                callId: this.calls[callId].callId,
                code: ErrorCode.cancel,
                msg: '取消请求',
                data: null,
            })
            delete this.calls[callId]
        }
    }
    destroy() {

    }
}


// 使用单例模式创建ApiController
let api: ApiController | null = null
if(!api){
    api = new ApiController()
}


export default api as ApiController

