export interface ApplicationInfo {
    name: string;
    pinyin: string;
    en: string;
    icon: string;
    key: string;
//     是否允许多开
    allowMulti: boolean;
    minHeight: number;
    minWidth: number;
    description: string;
}

export interface RunApplicationInfo {
    id: string;
    key: string;
    show: boolean;
    full: boolean;
    index: number;
}
