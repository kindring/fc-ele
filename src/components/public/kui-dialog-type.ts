import {Component} from "vue";

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
    menuItems?: KuiMenuItem[];
    position?: KuiPosition;
    contextMenu?: boolean;
}

export interface KuiDialogContextMenu {
    menuItems: Array<{
        label: string;
        value: string;
    }>;
    position: {
        x: number;
        y: number;
    };
}

export interface KuiMenuItem {
    label: string
    action?: () => void
    children?: KuiMenuItem[]
    disabled?: boolean
    icon?: string
}

export interface KuiPosition {
    x: number
    y: number
}

export interface MenuStyle extends KuiPosition {
    visibility: 'visible' | 'hidden'
    maxHeight?: string
}
