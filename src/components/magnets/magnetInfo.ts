
// import {App} from "vue";

import {Magnet, MagnetInfo, MagnetSize, SavedMagnet, showMagnetInfo} from "@/types/magnetType.ts";



const cellWidth = 50;
const cellMargin = 10;

export const MagnetEvent = "magnet"

// 时间组件
export const timeMagnetInfo: MagnetInfo =
{
    type: 'TimeMagnet',
    event: 'daySelect',
    defaultSize: MagnetSize.medium,
    sizes: {
        small: {
            width: 7,
            height: 3,
        },
        medium: {
            width: 7,
            height: 6,
        },
    },
    component: import('@/components/magnets/timeMagnet.vue')
}




export const magnetInfos: MagnetInfo[] =
[
    timeMagnetInfo,
    {...timeMagnetInfo, defaultSize: MagnetSize.small, component: import('@/components/magnets/timeMagnet.vue')},
    {...timeMagnetInfo, defaultSize: MagnetSize.small, component: import('@/components/magnets/timeMagnet.vue')},
    {...timeMagnetInfo, defaultSize: MagnetSize.small, component: import('@/components/magnets/timeMagnet.vue')},
    {...timeMagnetInfo, defaultSize: MagnetSize.small, component: import('@/components/magnets/timeMagnet.vue')},
    {...timeMagnetInfo, defaultSize: MagnetSize.small, component: import('@/components/magnets/timeMagnet.vue')},
]


export function getShowMagnetInfo() : showMagnetInfo[]{
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

/**
 * 初始化时间磁贴组件
 * @param component
 */
export function initTimeMagnetInfo(component: any): MagnetInfo{
    timeMagnetInfo.component = component
    return timeMagnetInfo
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

