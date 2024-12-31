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
    // 数据库错误, 读写数据库失败
    db,
    // IO错误, 读写文件失败
    io,

}

// 请求类型
export enum ApiType {
    req = 0xFF,
    // 请求的响应
    res = 0xFE,
    notify = 0xFD,
}

export enum Order {
    asc = 'asc',
    desc = 'desc',
}


// 请求参数
export interface RequestData<T>
{
    type: ApiType.req;
    signId: string;
    callId: string;
    // 请求的具体操作
    action: string;
    data: T;
    // 超时时间, 单位毫秒
    timeout: number;
}

export interface ResponseData<T>
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
    data: T;
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


export interface Page<T> {
    // 请求页数
    page: number;
    // 每页数量
    size: number;
    // 总文件数量
    total: number;
    // 排序字段
    sort: string;
    // 排序方式
    order: Order;
    // 实际数据
    data: T;
}


export enum magnet_Actions {
    // 获取列表
    magnet_list = 'magnet_list',
    // 批量更改磁力链接
    magnet_batch_update = 'magnet_batch_update',
    // 删除磁力链接
    magnet_delete = 'magnet_delete',
}
