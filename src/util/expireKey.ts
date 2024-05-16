interface KeyItem {
    key: string;
    time: number;
}

let keys: KeyItem[] = [];
let expireTime: number = 1000 * 60 * 10; // 10分钟

// 检查key是否存在
function checkKey(key: string): boolean {
    let index = keys.findIndex(item => item.key === key);
    return index !== -1;
}

// 生成key
export function createKey(): string {
    let key = '';
    do {
        key = Math.random().toString(36).substr(2);
    } while (checkKey(key));
    keys.push({
        key,
        time: Date.now()
    });
    return key;
}

// 检查是否过期
function checkExpire(): void {
    let now = Date.now();
    keys = keys.filter(item => {
        return now - item.time < expireTime;
    });
}

// 更新过期时间
function updateExpire(key: string): void {
    let index = keys.findIndex(item => item.key === key);
    if (index !== -1) {
        keys[index].time = Date.now();
    }
}

export default {
    checkKey,
    createKey,
    checkExpire,
    updateExpire
};
