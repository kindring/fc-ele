export function randomId(): string {
    return Math.random().toString(36).substr(4);
}

// 生成随机id, a-z 0-9 可以生成特定长度的id
export function randomAzStr(len: number): string {
    let id = '';
    for (let i = 0; i < len; i++) {
        id += Math.random().toString(36).substr(2);
    }
    return id;
}

// 生成指定大小内的随机数字
export function randomNumber(max: number = 100 , min: number = 0 ): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取随机字符串
 * @param str 基础字符串
 * @param len 需要获取的字符串长度
 * @returns 随机字符串
 */
export function getRandomStr(str: string, len: number): string {
    let result = '';
    for (let i = 0; i < len; i++) {
        result += str[Math.floor(Math.random() * str.length)];
    }
    return result;
}