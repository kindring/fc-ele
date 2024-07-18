// 弹窗类型 type: success, error, info, warning
import {AppContext} from "vue";

export enum NotifyType {
    success = 'success',
    error = 'error',
    info = 'info',
    warning = 'warning',
    Loading = "loading",
}

export interface MessageItem {
    id: number | string;
    type?: NotifyType;
    content: string;
    duration?: number;
    closeable?: boolean;
}

export interface MessageConfig {
    id?: number | string;
    type?: NotifyType;
    content: string;
    duration?: number;
    closeable?: boolean;
}

export interface messageFn {
    (config: string | MessageConfig, appContext?: AppContext | number): number | string;
    (config: string | MessageConfig, duration? : number): number | string;
}

// 扩展类型
export interface MessageFn extends messageFn {
    log: messageFn;
    success: messageFn;
    error: messageFn;
    info: messageFn;
    warn: messageFn;
    warning: messageFn;
    loading: messageFn;
}
