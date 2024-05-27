/**
 * 时间戳转时间字符串
 * @param timestamp - 时间戳
 * @returns {string}
 */
export function timestampToTime(timestamp: number): string {
    timestamp = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
    let date = new Date(timestamp);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return Y + M + D + h + m + s;
}

/**
 * 时间字符串转时间戳
 * @param timeStr - 时间字符串
 * @param isSecond - 是否返回秒级时间戳
 * @returns {number} - 时间戳
 */
export function timeStrToTimeStamp(timeStr: string, isSecond: boolean): number {
    let date = new Date(timeStr);
    if (isSecond) {
        return date.getTime() / 1000;
    } else {
        return date.getTime();
    }
}





/**
 * 时间格式化显示
 * @param t - 时间数据格式
 * @param format - 格式字符串
 * @returns {string} - 格式化后的时间字符串
 */
export function timeFormat(t: Date, format: string): string {
    let tf = function(i: number) {
        return (i < 10 ? '0' : '') + i;
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear());
            case 'MM':
                return tf(t.getMonth() + 1);
            case 'mm':
                return tf(t.getMinutes());
            case 'dd':
                return tf(t.getDate());
            case 'HH':
                return tf(t.getHours());
            case 'ss':
                return tf(t.getSeconds());
            default:
                return '';
        }
    });
}

/**
 * 时间戳格式化显示
 * @param timestamp - 时间戳
 * @param format - 格式字符串
 * @returns {string} - 格式化后的时间字符串
 */
export function timestampFormat(timestamp: number, format: string): string {
    return timeFormat(new Date(timestamp), format);
}

/**
 * 获取当前时间的Unix时间戳
 * @returns {number} - Unix时间戳
 */
export function getUnixTimeStamp(): number {
    return Math.round(new Date().getTime() / 1000);
}
