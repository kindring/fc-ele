import {Component, h, render} from "vue";

enum KuiDialogType {
    alert,
    confirm,
    prompt,
    loading,
    custom
}
interface KuiDialogCmdOptions {
    dialogType?: KuiDialogType;
    showContent: string | Component;
    mountTarget?: string;
    className?: string;
    onClose?: () => void;
    beforeClose?: () => boolean;
    on?: Record<string, (...args: any[]) => void>;
}
export class KuiDialogCmd {
    static defaultOptions: KuiDialogCmdOptions = {
        dialogType: KuiDialogType.custom,
        showContent: "kui-dialog",
        mountTarget: "#kui-root",
        beforeClose: (): boolean => {
            return true;
        },
        onClose() {
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
        const eventListeners = {
            onClose: () => this.hide(), // 绑定关闭事件
        };
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

    hide() {
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
        if (closeFn) closeFn();
        this.showFlag = false;
    }

    getAllListeners() {
        // 获取所有从 options.on 传递过来的事件监听器
        return this.options.on || {};
    }
    isShow() {
        return this.showFlag;
    }
}
