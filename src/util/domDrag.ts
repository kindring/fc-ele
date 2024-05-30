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
        top += getElementTop(el.parentElement);
    }
    return top;
}

function getElementDistanceToViewportEdge(element: HTMLElement): { top: number, right: number, bottom: number, left: number } {
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

    const top = rect.top - scrollY;
    const right = viewportWidth - rect.right + scrollX;
    const bottom = viewportHeight - rect.bottom + scrollY;
    const left = rect.left - scrollX;

    return { top, right, bottom, left };
}



export interface ElementInfo{
    el: HTMLElement | null;
    left: number;
    top: number;
    parentLeft: number;
    parentTop: number;
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
    constructor(el: HTMLElement, moveWait: number = 60) {
        // 绑定事件
        this.el = el;
        this.moveWait = moveWait;
        this.bindEvent();
    }
    el: HTMLElement;
    isMove: boolean = false;
    // 延迟时间, 同一时间内的合并为同一
    moveWait: number;
    // 计时器
    waitTimer: NodeJS.Timeout | null = null ;
    parent: ElementInfo = {
        el: null,
        left: 0,
        top: 0,
        parentTop: 0,
        parentLeft: 0,
        width: 0,
        height: 0,
        diffX: 0,
        diffY: 0
    };
    thisInfo: ElementInfo = {
        el: null,
        left: 0,
        top: 0,
        parentTop: 0,
        parentLeft: 0,
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
        const parentDistance = getElementDistanceToViewportEdge(parent);
        const distance = getElementDistanceToViewportEdge(el);
        this.parent = {
            el: parent,
            left: parentDistance.left,
            top: parentDistance.top,
            parentTop: 0,
            parentLeft: 0,
            width: parent.offsetWidth,
            height: parent.offsetHeight,
            diffX: 0,
            diffY: 0
        }
        this.thisInfo = {
            el: el,
            left: getElementLeft(el),
            top: getElementTop(el),
            parentTop: this.parent.top,
            parentLeft: this.parent.left,
            width: el.offsetWidth,
            height: el.offsetHeight,
            diffX: 0,
            diffY: 0
        }


        console.log('Distance to top:', distance.top);
        console.log('Distance to right:', distance.right);
        console.log('Distance to bottom:', distance.bottom);
        console.log('Distance to left:', distance.left);
    }
    downEvent = (e: MouseEvent) => {
        if(this.isMove){
            return
        }
        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;
        let el = this.el;
        this.isMove = true;

        console.log(el);
        // 获取元素再页面上的位置
        const left = getElementLeft(el);
        const top = getElementTop(el);
        let parentLeft = 0;
        let parentTop = 0;


        console.log(left, top)
        console.log(parentLeft, parentTop)

        // 计算元素偏移差值
        const diffX = e.offsetX;
        const diffY =  e.offsetY;

        this.startX = x;
        this.startY = y;

        this.thisInfo = {
            ...this.thisInfo,
            diffX: diffX,
            diffY: diffY
        }
        if (this.parent.el) {
            const parentDistance = getElementDistanceToViewportEdge(this.parent.el)
            this.thisInfo.parentTop = parentDistance.top
            this.thisInfo.parentLeft = parentDistance.left
        }
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }
        this.moveStart && this.moveStart(mouseInfo, this.thisInfo);
        setTimeout(()=>{
            document.addEventListener('mousemove', this.mouseMove);
        }, 100)
        document.addEventListener('mouseup', this.mouseUp);

    }

    mouseUp = (e: MouseEvent) => {
        this.isMove = false;
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
    mouseMove = (e: MouseEvent) => {
        if (!this.isMove){
            // 已经被取消
            document.removeEventListener('mousemove', this.mouseMove);
            return
        }
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
