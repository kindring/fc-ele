
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
// 获取元素滚动条位置
function getScrollLeft(el: HTMLElement): number{
    return el.scrollLeft || 0;
}
function getScrollTop(el: HTMLElement): number{
    return el.scrollTop || 0;
}

/**
 * 鼠标位置基于滚动条偏移
 * @param mouseInfo 直接修改此对象
 * @param el
 */
function comMouseInfo(mouseInfo: MouseInfo, el?: HTMLElement | null): MouseInfo{
    // 父元素有滚动条的情况下，需要减去滚动条的偏移量
    if (el) {
        const scrollX = getScrollLeft(el);
        const scrollY = getScrollTop(el);
        // console.log(`scrollX: ${scrollX} scrollY: ${scrollY}`);
        mouseInfo.x += scrollX;
        mouseInfo.y += scrollY;
    }
    return mouseInfo;
}

enum CollisionDirection {
    None = 0,
    Top = 1,
    Bottom = 2,
    Left = 3,
    Right = 4
}

export interface CollisionResult {
    colliding: boolean;
    direction: CollisionDirection;
}

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function detectCollisionDirection(rect1: Rect, rect2: Rect): CollisionResult {
    const horizontalOverlap = Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x);
    const verticalOverlap = Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y);

    if (horizontalOverlap > 0 && verticalOverlap > 0) {
        if (horizontalOverlap > verticalOverlap) {
            return {
                colliding: true,
                direction: rect1.y < rect2.y ? CollisionDirection.Top : CollisionDirection.Bottom
            };
        } else {
            return {
                colliding: true,
                direction: rect1.x < rect2.x ? CollisionDirection.Left : CollisionDirection.Right
            };
        }
    }

    return { colliding: false, direction: CollisionDirection.None };
}



export function isColliding(rect1: Rect, rect2: Rect): boolean {
    if (rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y) {
        return true;
    } else {
        return false;
    }
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
        el.addEventListener('mousedown', this.downEvent)
        // todo 触摸支持
        let parent = el.parentElement;
        if (!parent) {
            parent = document.body;
        }
        const parentDistance = getElementDistanceToViewportEdge(parent);
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


    }
    downEvent = (e: MouseEvent) => {
        if(this.isMove){
            return
        }
        // 获取鼠标位置
        const x = e.clientX;
        const y = e.clientY;
        this.isMove = true;

        // 计算元素偏移差值
        const diffX = e.offsetX;
        const diffY =  e.offsetY;
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }
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
            comMouseInfo(mouseInfo, this.parent.el);
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
        const x = e.pageX;
        const y = e.pageY;
        let mouseInfo: MouseInfo = {
            x: x,
            y: y
        }
        comMouseInfo(mouseInfo, this.parent.el);
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
