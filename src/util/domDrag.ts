// 元素拖动
function getElementLeft(el: HTMLElement): number{
    let left = el.offsetLeft || 0;
    if(el.parentElement){
        left += getElementLeft(el.parentElement);
    }
    return left;
}
function getElementTop(el: HTMLElement): number{
    let top = el.offsetTop || 0;
    if(el.parentElement){
        top += getElementLeft(el.parentElement);
    }
    return top;
}

export interface ElementInfo{
    el: HTMLElement | null;
    left: number;
    top: number;
    width: number;
    height: number;
    // 鼠标点击位置与元素位置的差值
    diffX: number;
    diffY: number;
}

export interface MouseInfo{
    x: number;
    y: number;
}

export interface MouseListener{
    (mouse: MouseInfo, el: ElementInfo): void;
}
export class Drag{
    constructor(el: HTMLElement) {
        // 绑定事件
        this.el = el;
        this.bindEvent();
    }
    el: HTMLElement;
    parent: ElementInfo = {
        el: null,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        diffX: 0,
        diffY: 0
    };
    thisInfo: ElementInfo = {
        el: null,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        diffX: 0,
        diffY: 0
    };
    startX: number = 0;
    startY: number = 0;

    public static Event = {
        moveStart: "moveStart",
        move: "move",
        moveEnd: "mouseEnd"
    }


    //
    private bindEvent() {
        const el = this.el;
        el.addEventListener('mousedown', this.downEvent);
        let parent = el.parentElement;
        if (!parent) {
            parent = document.body;
        }
        this.parent = {
            el: parent,
            left: getElementLeft(parent),
            top: getElementTop(parent),
            width: parent.offsetWidth,
            height: parent.offsetHeight,
            diffX: 0,
            diffY: 0
        }
        this.thisInfo = {
            el: el,
            left: getElementLeft(el),
            top: getElementTop(el),
            width: el.offsetWidth,
            height: el.offsetHeight,
            diffX: 0,
            diffY: 0
        }
    }
    downEvent(e: MouseEvent) {
        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;
        let el = this.el;
        console.log(el);
        // 获取元素的宽高
        const width = el.offsetWidth;
        const height = el.offsetHeight;
        // 获取元素再页面上的位置
        const left = getElementLeft(el);
        const top = getElementTop(el);
        // 计算元素偏移差值
        const diffX = x - left;
        const diffY = y - top;

        this.startX = x;
        this.startY = y;

        this.thisInfo = {
            el: el,
            left: left,
            top: top,
            width: width,
            height: height,
            diffX: diffX,
            diffY: diffY
        }
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }

        document.addEventListener('mouseup', this.mouseUp);
        document.addEventListener('mousemove', this.mouseMove);
        this.moveStart && this.moveStart(mouseInfo, this.thisInfo);
    }

    mouseUp(e: MouseEvent) {
        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;
        console.log(`mouse up event x: ${x} y: ${y}`)
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }
        // 解除事件绑定
        document.removeEventListener('mousemove', this.mouseMove);
        document.removeEventListener('mouseup', this.mouseUp);
        this.moveEnd && this.moveEnd(mouseInfo , this.thisInfo);

    }
    mouseMove(e: MouseEvent) {
        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;
        console.log(`mouse move event x: ${x} y: ${y}`)
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }
        this.move && this.move(mouseInfo, this.thisInfo);
    }

    moveStart: MouseListener | null = null;
    move: MouseListener | null  = null;
    moveEnd: MouseListener | null  = null;

    public on(eventName: string, callback: MouseListener) {
        switch(eventName) {
            case Drag.Event.moveStart:
                this.moveStart = callback;
                break;
            case Drag.Event.move:
                this.move = callback;
                break;
            case Drag.Event.moveEnd:
                this.moveEnd = callback;
                break;
            default:
                throw new Error('Invalid event name');
        }
    }
    public off(eventName: string) {
        switch(eventName) {
            case Drag.Event.moveStart:
                this.moveStart = null;
                break;
            case Drag.Event.move:
                this.move = null;
                break;
            case Drag.Event.moveEnd:
                this.moveEnd = null;
                break;
            default:
                throw new Error('Invalid event name');
        }
    }


    public destroy() {
        // 移除事件
        this.el.removeEventListener('mousedown', this.downEvent);
        document.removeEventListener('mouseup', this.mouseUp);
        document.removeEventListener('mousemove', this.mouseMove);
        this.off(Drag.Event.moveStart);
        this.off(Drag.Event.move);
        this.off(Drag.Event.moveEnd);
    }

}
