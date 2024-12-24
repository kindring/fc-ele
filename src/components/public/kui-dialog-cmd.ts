import {Component, h, render} from "vue";
import alertModel from "./alertModel.vue"

export enum KuiDialogType {
    alert,
    confirm,
    prompt,
    loading,
    custom
}
export interface KuiDialogCmdOptions {
    dialogType?: KuiDialogType;
    showContent: string | Component;
    mountTarget?: string;
    className?: string;
    onClose?: () => void;
    beforeClose?: () => boolean;
    onOk?: () => void;
    on?: Record<string, (...args: any[]) => void>;
}
export class KuiDialogCmd {
    static defaultOptions: KuiDialogCmdOptions = {
        dialogType: KuiDialogType.custom,
        showContent: "kui-dialog",
        mountTarget: "kui-root",
        beforeClose: (): boolean => {
            return true;
        },
        onClose() {
        },
        onOk() {
        },
        className: "kui-dialog",
    }
    options: KuiDialogCmdOptions;
    containerEl: HTMLElement;
    targetEl: HTMLElement | null;
    showFlag: boolean;
    tmpVNode: any;

    constructor(opt: KuiDialogCmdOptions) {
        this.options = {
            ...KuiDialogCmd.defaultOptions,
            ...opt
        };
        this.containerEl = document.createElement('div');
        this.containerEl.className = <string>this.options.className;
        this.targetEl = null;
        this.showFlag = false;
    }

    show( props?: any ) {
        let eventListeners;
        if (this.options.dialogType === KuiDialogType.alert) {
            eventListeners = {
                onOk: () => {
                    this.hide();
                    // 阻断hide触发close事件, 用于在外部
                    this.options.onOk?.();
                    },
                onCancel: () => {
                    this.hide(true);
                },
            }
        } else {
            eventListeners = {
                onClose: () => this.hide(true),
            };
        }
        // 解析 option中的on
        // 根据参数决定显示类型
        let vNode =
            h(this.options.showContent,  {
            ...props,
            // 这里会将所有其他事件（包括未明确绑定）传递给子组件
            on: {
                ...this.options.on, // 传递的自定义事件
                ...this.getAllListeners(), // 获取所有未明确定义的事件
            },
            ...eventListeners,
            ...this.options.on
        });
        render(vNode, this.containerEl);
        let target = document.getElementById(<string>this.options.mountTarget);
        if (!target) {
            target = document.body;
        }
        target.appendChild(this.containerEl);
        this.targetEl = target;
        this.showFlag = true;
    }

    hide(isSub: boolean = false) {
        let beforeCloseFn = this.options.beforeClose;
        let closeFn = this.options.onClose;
        if (beforeCloseFn && !beforeCloseFn()) {
            // 被阻止关闭
            return;
        }
        if (this.targetEl) {
            this.targetEl.removeChild(this.containerEl);
        }
        render(null, this.containerEl);
        this.showFlag = false;
        if (isSub && closeFn) closeFn();
    }

    getAllListeners() {
        // 获取所有从 options.on 传递过来的事件监听器
        return this.options.on || {};
    }
    isShow() {
        return this.showFlag;
    }
}


export interface KuiDialogAlertOptions{
    title: string;
    content: string;
    okText?: string;
    cancelText?: string;
    onOk?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}
export function showAlert( alertOptions: KuiDialogAlertOptions, mountTarget: string = "kui-root"): KuiDialogCmd
{
    const defaultOptions: KuiDialogAlertOptions = {
        title: "提示",
        content: "内容",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {},
        onCancel: () => {},
        showCancel: true,
    }
    let _alertOptions: KuiDialogAlertOptions = {
        ...defaultOptions,
        ...alertOptions
    }
    let dialogOptions: KuiDialogCmdOptions = {
        dialogType: KuiDialogType.alert,
        showContent: alertModel,
        mountTarget: mountTarget,
        onOk: _alertOptions.onOk,
        onClose: _alertOptions.onCancel,
    }
    let dialog = new KuiDialogCmd(dialogOptions);
    dialog.show({
        title: _alertOptions.title,
        content: _alertOptions.content,
        okText: _alertOptions.okText,
        cancelText: _alertOptions.cancelText,
        showCancel: _alertOptions.showCancel,
    });
    return dialog;
}
