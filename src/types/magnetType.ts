/**
 * 磁贴定义
 * 1. 磁贴坐标抽象为格子坐标
 * 2. 磁贴宽高不允许自定义, 只能根据组件的内容来确定可选的宽高
 * 3. 磁贴内容, 确定磁贴中的具体内容
 */

/**
 * 磁贴大小
 */
export enum MagnetSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
    xLarge = 'xLarge',
}

/**
 * 磁贴类型, 前端应用的磁贴类型
 */
export interface Magnet {
    // 磁贴id, 用于存储再数据库中
    id: string,
    // 磁贴坐标
    x: number,
    y: number,
    // 磁贴宽高, 用于再更改时碰撞检测
    width: number,
    height: number,
    // 磁贴内容, 确定磁贴中的具体内容
    type: string,
    // event 触发事件的key
    event: string,
    // 磁贴大小, 用于确定磁贴的样式
    size: MagnetSize,
    // 磁贴是否被选中, 用于判断是否可以拖动
    selected: boolean,
    // 磁贴是否被改变, 用于判断是否需要保存
    changed: boolean,
}

/**
 * 存储磁贴信息
 */
export interface SavedMagnet
{
    id: string,
    x: number,
    y: number,
    type: string,
    size: MagnetSize,
}



interface size {
    width: number,
    height: number,
}


/**
 * 磁贴大小定义
 */
export interface MagnetInfo  {
    type: string,
    event: string,
    // 磁贴可以有多个可选尺寸, 不同尺寸, 对应不同宽高
    sizes:
        { [key in MagnetSize]?: size}
    ,
    defaultSize: MagnetSize,
    // 磁贴内容, 确定磁贴中的具体内容
    component: any
}

export interface showMagnetInfo extends MagnetInfo{
    size: size
}


export interface MagnetEmit<T>{
    event: string,
    data: T,
}
