export interface Calendar {
    year: number;
    month: number;
    day: number;
    week: number;
    isToday: boolean;
    isLast: boolean;
    isNext: boolean;
    // todo 农历
}


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

    return format.replace(/yyyy/, tf(t.getFullYear()))
        .replace(/MM/, tf(t.getMonth() + 1))
        .replace(/M/, String(t.getMonth() + 1))
        .replace(/dd/, tf(t.getDate()))
        .replace(/d/, String(t.getDate()))
        .replace(/HH/, tf(t.getHours()))
        .replace(/H/, String(t.getHours()))
        .replace(/mm/, tf(t.getMinutes()))
        .replace(/m/, String(t.getMinutes()))
        .replace(/ss/, tf(t.getSeconds()))
        .replace(/s/, String(t.getSeconds()));
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


export const LUNAR_INFO = {
    MIN_YEAR: 1901, // YEAR_INFO 的最小年份，和数组下标配合可知每个项的年份
    MAX_YEAR: 2100, // YEAR_INFO 的最大年份
    YEAR_INFO: [
        "4e4ae0", "22a570", "7554d5", "42d260", "12d950", "e56554", "3656a0", "a9ad0", "5955d2", "2a4ae0",
        "79a5b6", "4aa4d0", "1ad250", "e9d255", "3ab540", "ed6a0", "5dada2", "2e95b0", "864977", "524970",
        "22a4b0", "71b4b5", "426a50", "166d40", "e1ab54", "362b60", "a9570", "5d52f2", "2a4970", "796566",
        "46d4a0", "1aea50", "e96a95", "3a5ad0", "122b60", "e186e3", "2e92e0", "fd48d7", "4ec950", "22d4a0",
        "edd8a6", "3eb550", "1656a0", "e5a5b4", "3625d0", "a92d0", "59d2b2", "2aa950", "75b557", "466ca0",
        "1ab550", "ed5355", "3a4da0", "ea5b0", "e14573", "3252b0", "7da9a8", "4ae930", "226aa0", "71aea6",
        "3eab50", "164b60", "65aae4", "36a570", "a5260", "55f263", "26d950", "795b57", "4656a0", "1a96d0",
        "6d4dd5", "3e4ad0", "ea4d0", "5dd4d4", "2ed250", "7dd558", "4ab540", "1eb6a0", "f195a6", "4295b0",
        "1649b0", "65a974", "36a4b0", "ab27a", "526a50", "266d40", "75af46", "46ab60", "1a9570", "6d4af5",
        "3e4970", "1264b0", "5d74a3", "2aea50", "7d6b58", "4e5ac0", "1eab60", "7196d5", "4292e0", "16c960",
        "61d954", "32d4a0", "6da50", "597552", "2656a0", "75abb7", "4a25d0", "1e92d0", "69cab5", "3aa950",
        "eb4a0", "5dbaa4", "2aad50", "7d55d9", "4e4ba0", "22a5b0", "f15176", "4252b0", "16a930", "657954",
        "326aa0", "6ad50", "595b52", "2a4b60", "75a6e6", "46a4e0", "1ad260", "69ea65", "36d530", "e5aa0",
        "5d76a3", "2e96d0", "7d4afb", "4e4ad0", "22a4d0", "f1d0b6", "3ed250", "12d520", "61dd45", "32b5a0",
        "656d0", "5955b2", "2a49b0", "79a577", "46a4b0", "1aaa50", "e9b255", "3a6d20", "aada0", "dd4b63",
        "2e9370", "649f8", "4e4970", "2264b0", "f168a6", "3eea50", "126aa0", "e1a6c4", "32aae0", "a92e0",
        "55d2e3", "26c960", "75d557", "46d4a0", "16da50", "695d55", "3a56a0", "ea6d0", "5d55d4", "2e52d0",
        "7da9b8", "4ea950", "1eb4a0", "6db6a6", "3ead50", "1655a0", "61aba4", "32a5b0", "a52b0", "59b273",
        "266930", "757337", "466aa0", "1aad50", "e94b55", "3a4b60", "ea570", "6154e4", "2ad160", "79e968",
        "4ad520", "1edaa0", "ed6aa6", "3e56d0", "164ae0", "65a9d4", "32a2d0", "6d150", "55f252", "26d520"
    ],
    HEAVENLY_STEMS: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
    EARTHLY_BRANCHES: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'],
    ZODIAC: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    CHINESE_MONTH: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    CHINESE_DATE: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '初', '廿', '卅', '年', '月', '日', '闰'], // 廿: nian; 卅: sa; 都读四声
    CHINESE_SOLAR_TERMS: ['立春', '雨水', '惊蛰', '春分', '清明', '谷雨', '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑', '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'],
    WEEK_DAY: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    WEEK_DAY_SHORT: ['一', '二', '三', '四', '五', '六', '日'],
    MONTH_DAY: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], // 闰年2月29天
}




/**
 * 获取日期的中文星期 星期一 至 星期日
 * @param date
 * @returns
 */
function getChineseWeek(date: Date): number {
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 ? 7 : dayOfWeek;
}

/**
 * 获取指定月份的天数 该函数无需考虑闰年
 * @param date
 */
function getMonthDays(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}


/**
 * 获取指定月份的日期信息
 * @param year
 * @param month
 */
function getMonthDaysInfo(year: number, month: number): Calendar[] {
    let calendar: Calendar[] = [];
    let time = new Date(`${year}-${month}-01`)
    let nowDate = new Date();
    let nowDay = nowDate.getDate();
    let isDay = nowDate.getMonth() + 1 === month && nowDate.getFullYear() === year;
    // 计算当前月有多少天
    let daysInMonth = getMonthDays(time);
    for (let i = 1; i <= daysInMonth; i++) {
        let date = new Date(`${year}-${month}-${i}`);
        calendar.push({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: i,
            week: getChineseWeek(date),
            isToday: isDay ? nowDay === date.getDate() : false,
            isLast: false,
            isNext: false,
        });
    }
    return calendar;
}

function calendarGetNextMonth(calendar: Calendar): Calendar
{

    let nextMonth = calendar.month + 1;
    let nextYear = calendar.year;
    if (nextMonth > 12) {
        nextMonth = 1;
        nextYear++;
    }
    return {
        ...calendar,
        month: nextMonth,
        year: nextYear
    };
}

function calendarGetPrevMonth(calendar: Calendar): Calendar
{

    let prevMonth = calendar.month - 1;
    let prevYear = calendar.year;
    if (prevMonth < 1) {
        prevMonth = 12;
        prevYear--;
    }
    return {
        ...calendar,
        month: prevMonth,
        year: prevYear
    };
}

/**
 * 获取指定日期的日历列表
 * @param time
 */
export function getCalendar(time: Date): Calendar[] {
    const calendar: Calendar = dateToCalendar(time);
    console.log(calendar)
    let calendars: Calendar[] = getMonthDaysInfo(calendar.year, calendar.month);

    // 判断第一天是星期几
    let firstDayWeek = calendars[0].week;
    if (firstDayWeek !== 1)
    {
        // 计算前一个月的天数
        let lastCalendar = calendarGetPrevMonth(calendar);
        console.log(lastCalendar)
        let daysInLastMonth = getMonthDaysInfo(lastCalendar.year, lastCalendar.month);
        // 获取前一个月的后几天
        for(let i = 1; i < firstDayWeek; i++)
        {

            console.log(`i: ${i} => ${daysInLastMonth.length - i}`)
            // 获取上一个月的最后几天
            let lastDay = daysInLastMonth[daysInLastMonth.length - i];
            lastDay.isLast = true;
            calendars.unshift(lastDay);
        }
    }
    // 判断最后一天是星期几
    let lastDayWeek = calendars[calendars.length - 1].week;
    if (lastDayWeek !== 7) {
        // 计算下一个月的天数
        let nextCalendar = calendarGetNextMonth(calendar);
        let daysInNextMonth = getMonthDaysInfo(nextCalendar.year, nextCalendar.month);
        for (let i = 0; i + lastDayWeek < 7; i++) {
            let nextDay = daysInNextMonth[i];
            nextDay.isNext = true;
            calendars.push(nextDay);
        }
    }
    return calendars;
}

function dateToCalendar(date: Date): Calendar {
    let nowDate = new Date();
    let isToday = date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth() && date.getDate() === nowDate.getDate();
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        week: getChineseWeek(date),
        isToday: isToday,
        isLast: false,
        isNext: false,
    };
}

export function getCalendarByWeek(time: Date, expand: boolean = false): Calendar[] {
    const calendar: Calendar = dateToCalendar(time);
    let calendars: Calendar[] = getMonthDaysInfo(calendar.year, calendar.month);
    // 如果当前日期小于第7天, 则获取上一个月的日期
    if (calendar.day < 7){
        // 获取前一个月的天数
        let lastCalendar = calendarGetPrevMonth(calendar);
        let daysInLastMonth = getMonthDaysInfo(lastCalendar.year, lastCalendar.month);
        // 获取当月第一天的星期
        let len = expand ? daysInLastMonth.length : calendars[0].week;
        console.log(len);
        for (let i = 1; i < len; i++) {
            let lastDay = daysInLastMonth[daysInLastMonth.length - i];
            console.log(`i: ${i} ${daysInLastMonth.length - i}  ${lastDay.month}月${lastDay.day}日`)
            lastDay.isLast = true;
            calendars.unshift(lastDay);
        }
        console.log(calendars)
    }
    if (calendar.day >= 22) {
        // 获取下一个月的天数
        let nextCalendar = calendarGetNextMonth(calendar);
        let daysInNextMonth = getMonthDaysInfo(nextCalendar.year, nextCalendar.month);
        let len = expand ? daysInNextMonth.length : 7 ;
        for (let i = 0; i < len; i++) {
            daysInNextMonth[i].isNext = true;
            calendars.push(daysInNextMonth[i]);
        }
    }

    // 获取指定周
    let targetIndex = calendars.findIndex(item => item.year === calendar.year && item.month === calendar.month && item.day === calendar.day);
    if(targetIndex === -1) {
        return calendars.slice(0, 7);
    }
    let targetDay = calendars[targetIndex];
    // 获取指定日期所在周的信息
    let startIndex = targetIndex - (targetDay.week - 1);
    let endIndex = targetIndex + (7 - targetDay.week);
    // 如果不进行扩展，则只返回指定日期所在周
    if (!expand) {
        return calendars.slice(startIndex, endIndex + 1);
    }
    // 扩展的话则获取前后一周
    let start = Math.max(0, startIndex - 7);
    let end = Math.min(calendars.length - 1, endIndex + 7);
    calendars = calendars.slice(start, end + 1);
    return calendars;
}



