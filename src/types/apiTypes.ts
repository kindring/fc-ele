export enum ErrorCode {
    success = 0,
    // 参数错误
    params,
    // 权限错误
    permission,
    // 请求超时, 可能是由发送者触发, 也有可能是服务端处理其他任务时超时
    timeout,
    // 被取消请求, 一般由发起者触发, 也有可能是由其他客户端将其取消
    cancel,


}

// 请求类型
export enum ApiType {
    req = 0xFF,
    // 请求的响应
    res = 0xFE,
    notify = 0xFD,
}


// 请求参数
export interface RequestData
{
    type: ApiType.req;
    callId: string;
    // 请求的具体操作
    action: string;
    data: any;
    // 超时时间, 单位毫秒
    timeout: number;
}

export interface ResponseData
{
    type: ApiType.res;
    callId: string;
    // 请求的具体操作
    action: string;
    // 错误码
    code: ErrorCode;
    // 错误信息
    msg: string;
    // 返回的数据
    data: any;
}

export interface NotifyData
{
    type: ApiType.notify;
    // 请求的具体操作
    action: string;
    // 错误码
    code: ErrorCode;
    // 错误信息
    msg: string;
    // 返回的数据
    data: any;
}


export enum magnet_Actions {
    // 获取列表
    magnet_list = 'magnet_list',
    // 批量更改磁力链接
    magnet_batch_update = 'magnet_batch_update',
    // 删除磁力链接
    magnet_delete = 'magnet_delete',
}