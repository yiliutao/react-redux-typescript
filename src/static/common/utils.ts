//无效值
const invalidVal = "--";
//省略符
const ellipsis = "...";

//从localstorage中获取数据
function getKvLS(key: string) {
    try {
        let val: any = localStorage.getItem("lw" + key);
        val = JSON.parse(val);
        return val;
    } catch (e) {
        console.log(e.message);
        return null;
    }
}

//将数据存入localstorage中
function setKvLS(key: string, value: any) {
    try {
        let val = JSON.stringify(value);
        localStorage.setItem("lw" + key, val);
    } catch (e) {
        console.log(e.message);
    }
}

//时间字符串转换为时间戳
function convertToStamp(timeStr: string) {
    let date = new Date(timeStr);
    return +date;
}
//时间戳转换为时间字符串
function convertToTimeStr(stamp: number | string, type: number) {
    if (!stamp) {
        return invalidVal;
    }
    //判断是时间格式的字符串还是时间戳字符串，并作转换
    if (stamp) {
        let stampReg = /^[1-9]\d{12}$/;
        let stampStr = stamp.toString();
        if (stampReg.test(stampStr)) {
            stamp = parseInt(stampStr);
        }
    }
    let date = new Date(stamp);
    return date.format(type);
}

//获取一天的起始时刻
function getDateBegin(time: any) {
    let date = new Date(time);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return +date;
}

//获取一天的结束时刻
function getDateEnd(time: any) {
    let date = new Date(time);
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return +date;
}

//以天为单位的时间差
function getDiffDays(beginStamp: number | string, endStamp: number | string) {
    let newEnd: any = new Date(endStamp);
    let newBegin: any = new Date(beginStamp);
    let diff = newEnd - newBegin;
    let result = diff / 1000 / 60 / 60 / 24;
    return Math.round(result);
}

//以小时为单位的时间差
function getDiffHours(beginStamp: number | string, endStamp: number | string) {
    let newEnd: any = new Date(endStamp);
    let newBegin: any = new Date(beginStamp);
    let diff = newEnd - newBegin;
    let result = diff / 1000 / 60 / 60;
    return Math.round(result);
}
//以秒为单位的时间差
function getDiffSeconds(beginStamp: number | string, endStamp: number | string) {
    let newEnd: any = new Date(endStamp);
    let newBegin: any = new Date(beginStamp);
    let diff = newEnd - newBegin;
    let result = diff / 1000;
    return Math.round(result);
}
//删除时间戳中的毫秒
function removeMilliseconds(stamp: number) {
    let date = new Date(stamp);
    date.setMilliseconds(0);
    return +date;
}

//数字千分位处理，目前只处理整数部分
function numberToThousands(num: number | string, decimal: number = 2, defaultVal: string = invalidVal) {
    //异常数据处理
    if (!num && num !== 0) {
        return defaultVal;
    }
    //统一数据类型
    num = parseFloat(num.toString());
    if (num == NaN) {
        return defaultVal;
    }
    //分别取小数部分和整数部分
    let decimalVal: any = num % 1;
    let intVal = Math.floor(num).toString();
    //小数部分只做位数保留处理
    decimalVal = decimalVal.toFixed(decimal);
    let singleVal = decimalVal.substr(0, 1);
    intVal = (Number(intVal) + Number(singleVal)).toString();
    //整数部分千分位处理
    intVal = intVal.replace(/(\d{1,3})(?=(\d{3})+$)/g, function (s) { return s + "," });
    //整合小数部分和整数部分
    return intVal + decimalVal.substr(1);
}

//在当前日期的基础上添加天数
function addDays(curTime: number, days: number) {
    let curDate = new Date(curTime);
    curDate.setMilliseconds(0);
    let newDate = curDate.getTime() + days * 24 * 60 * 60 * 1000;
    return newDate;
}

//判断对象是否是promise对象
function isPromiseObj(obj: any) {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

//判断是否试promise数组
function isPromiseList(promises: any) {
    return !!promises && promises.length > 0 && isPromiseObj(promises[0]);
}

//获取一分钟的开始
function getMinuteBegin(time: Date | number) {
    let date = new Date(time);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return +date;
}

//获取一分钟的结束
function getMinuteEnd(time: Date | number) {
    let date = new Date(time);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return +date;
}

interface UtilStruct {
    invalidVal: string,
    ellipsis: string,
    getKvLS: (key: string) => any,
    setKvLS: (key: string, value: any) => void;
    convertToStamp: (timeStr: string) => number,
    convertToTimeStr: (stamp: number | string, type: number, defaultVal?: string) => string,
    getDiffDays: (beginStamp: number | string, endStamp: number | string) => number;
    getDiffHours: (beginStamp: number | string, endStamp: number | string) => number;
    getDiffSeconds: (beginStamp: number | string, endStamp: number | string) => number;
    removeMilliseconds: (stamp: number) => number;
    getDateBegin: (time: any) => number;
    getDateEnd: (time: any) => number;
    numberToThousands: (num: string | number, decimal?: number, defaultVal?: string) => string,
    addDays: (curTime: number, days: number) => number,
    isPromiseObj: (obj: any) => boolean,
    isPromiseList: (objs: any) => boolean;
    getMinuteBegin: (time: Date | number) => number;
    getMinuteEnd: (time: Date | number) => number;
}
//定义通用函数的数据结构
const utils: UtilStruct = {
    invalidVal,
    ellipsis,
    getKvLS,
    setKvLS,
    convertToStamp,
    convertToTimeStr,
    getDiffDays,
    getDiffHours,
    getDiffSeconds,
    removeMilliseconds,
    getDateBegin,
    getDateEnd,
    numberToThousands,
    addDays,
    isPromiseObj,
    isPromiseList,
    getMinuteBegin,
    getMinuteEnd,
}
export {
    UtilStruct,
    invalidVal,
    ellipsis,
    getKvLS,
    setKvLS,
    convertToStamp,
    convertToTimeStr,
    getDiffDays,
    getDiffHours,
    getDiffSeconds,
    removeMilliseconds,
    getDateBegin,
    getDateEnd,
    numberToThousands,
    addDays,
    isPromiseObj,
    isPromiseList,
    getMinuteBegin,
    getMinuteEnd,
}
export default utils;