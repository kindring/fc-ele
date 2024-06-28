
// import {App} from "vue";

import {Magnet, MagnetInfo, MagnetSize, SavedMagnet, ShowMagnetInfo} from "@/types/magnetType.ts";



const cellWidth = 50;
const cellMargin = 10;

export const MagnetEvent = "magnet"

// 时间组件
export const timeMagnetInfo: MagnetInfo =
{
    title: '日历组件',
    type: 'TimeMagnet',
    event: 'daySelect',
    defaultSize: MagnetSize.medium,
    sizes: {
        small: {
            title: "本周日历",
            description: '展示本周的日历列表',
            width: 7,
            height: 3,
        },
        medium: {
            title: '',
            description: '',
            width: 7,
            height: 6,
        },
    },
}

const TypeComponent: {[key:string]: any} = {
    [timeMagnetInfo.type]: null,
}





export const magnetInfos: MagnetInfo[] =
[
    timeMagnetInfo,
    {...timeMagnetInfo, defaultSize: MagnetSize.small, },
    {...timeMagnetInfo, defaultSize: MagnetSize.small, },
    {...timeMagnetInfo, defaultSize: MagnetSize.small, },
    {...timeMagnetInfo, defaultSize: MagnetSize.small, },
    {...timeMagnetInfo, defaultSize: MagnetSize.small, },
]


export function getShowMagnetInfo() : ShowMagnetInfo[]{
    return magnetInfos.map(magnetInfo=>{
        let size = magnetInfo.sizes[magnetInfo.defaultSize]
        if (!size) {
            throw new Error(`magnetInfo default size not found: ${magnetInfo.type} ${magnetInfo.defaultSize} magnet must have size`)
        }
        return {
            ...magnetInfo,
            size: size
        }
    })
}

export function findMagnetInfo(type: string): MagnetInfo | undefined
{
    return magnetInfos.find(magnetInfo => magnetInfo.type === type)
}

// 寻找空位置
export function findEmptyPosition(magnets: Magnet[], width: number, height: number, maxWidth: number): {x: number, y: number}
{
    let x = 0;
    let y = 0;
    for (let i = 0; i < magnets.length; i++) {
        // 遍历所有的磁贴组件, 找到最下方的坐标
        let magnet = magnets[i];
        if (magnet.x + magnet.width > x) {
            x = magnet.x + magnet.width;
        }
        // 尝试看是否能够摆下元素
        if (magnet.y + magnet.height > y) {
            y = magnet.y + magnet.height;
        }
    }
    if (x + width > maxWidth) {
        x = 0;
        y += height;
    }
    // 防止 磁贴位置超出边界
    return {x, y}
}

/**
 * 初始化磁贴对应的组件
 * @param component
 */
export function initTypeComponent(type: string , component: any){
    TypeComponent[type] = component
}

export function getComponent(type: string) : any
{
    let component = TypeComponent[type]
    if (!component) {
        throw new Error(`component not found: ${type}`)
    }
    return component
}

function _findMagnetInfo(type: string): MagnetInfo
{
    let _magnetInfo = magnetInfos.find(magnetInfo => magnetInfo.type === type)
    if (!_magnetInfo) {
        throw new Error(`magnetInfo not found: ${type}`)
    }
    return _magnetInfo
}
function  _savedMagnet2Magnet(savedMagnet: SavedMagnet) : Magnet
{
    let magnetInfo = _findMagnetInfo(savedMagnet.type)
    let size = magnetInfo.sizes[savedMagnet.size] || magnetInfo.sizes[magnetInfo.defaultSize]
    if (!size) {
        throw new Error(`magnetInfo size not found: ${savedMagnet.type} ${savedMagnet.size} magnet must have size`)
    }
    return {
        id: savedMagnet.id,
        type: savedMagnet.type,
        size: savedMagnet.size,
        x: savedMagnet.x,
        y: savedMagnet.y,
        width: size.width,
        height: size.height,
        event: magnetInfo.event,
        selected: false,
        changed: false,
        isAdd: false
    }
}

export function savedMagnets2Magnets(savedMagnets: SavedMagnet[]): Magnet[]{
    let arr = savedMagnets.map(savedMagnet => _savedMagnet2Magnet(savedMagnet))
    return arr
}

export function computeMagnetStyle(magnet: Magnet) {
    // console.log(magnet)
    // 计算磁贴样式 元素宽度为 50px, 间距为 5px
    return computeStyle(magnet.width, magnet.height, magnet.x, magnet.y);
}





export function computeStyle(w: number, h: number, x: number, y: number, sub: boolean = false) {
    let _w = cellWidth * w + (cellMargin * w - cellMargin);
    let _h = cellWidth * h + (cellMargin * h  - cellMargin);
    // 计算元素位置 起始位置为 0 .
    let _x = cellWidth * x + (cellMargin * x + cellMargin);
    let _y = cellWidth * y + (cellMargin * y + cellMargin);
    // console.log(w, h, x, y)
    if (sub) {
        return {
            width: `${_w}px`,
            height: `${_h}px`,
        }
    }
    return {
        width: `${_w}px`,
        height: `${_h}px`,
        left: `${_x}px`,
        top: `${_y}px`
    }
}

// 通过元素位置反向计算xy值
export function comXY(left: number, top: number){
    let x = Math.floor(left / (cellWidth + cellMargin));
    let y = Math.floor(top / (cellWidth + cellMargin));
    return {x, y}
}

export function comMaxWidth(width: number){
    let w = Math.floor(width / (cellWidth + cellMargin));
    console.log(`width: ${width} w: ${w}`)
    return w
}





// 定义vue组件



export default {
    timeMagnetInfo,
}

