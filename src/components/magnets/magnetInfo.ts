
// import {App} from "vue";

import {Magnet, MagnetInfo, MagnetSize} from "@/types/magnetType.ts";
//
// import TimeMagnet from "@/components/magnets/timeMagnet.vue";


const cellWidth = 50;
const cellMargin = 10;

const timeMagnetInfo: MagnetInfo =
{
    type: 'TimeMagnet',
    defaultSize: MagnetSize.medium,
    sizes: {
        medium: {
            width: 5,
            height: 3,
        },
    },

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





// 定义vue组件



export default {
    timeMagnetInfo,
}

