import { ajax } from '../common/ajax';
import { ReqStruct } from '../biz/bizCommon';
import api, { UtilStruct } from '../common/utils';
import md5 from 'js-md5';

//将部分变量挂在到window上，方便使用
interface App {
    ajax: (params: ReqStruct) => void,
    api: UtilStruct,
    md5: md5.md5,
}
declare global {
    let App: App;
    interface Window {
        App: App,
    }
    interface Date {
        format: (type?: number) => string;
    }
}

//修正数据位数
function reviseDigitLength(digit: number, length: number) {
    let result = digit.toString();
    if (result.length > length) {
        return result.substr(0, length);
    }
    for (let i = result.length; i < length; i++) {
        result = "0" + result;
    }
    return result;
}

function loadGlobalVar() {
    window.App = { ajax, api, md5 };
    //定义日期中的format方法
    Date.prototype.format = function (type?: number) {
        let year = this.getFullYear();
        let month = this.getMonth() + 1;
        let date = this.getDate();
        let hour = reviseDigitLength(this.getHours(), 2);
        let minute = reviseDigitLength(this.getMinutes(), 2);
        let second = reviseDigitLength(this.getSeconds(), 2);
        if (type == 1) { //2018-5-5 12:07:05
            return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
        if (type == 2) { //2018-05-05 12:07:05
            return year + "-" + reviseDigitLength(month, 2) + "-" + reviseDigitLength(date, 2) + " " + hour + ":" + minute + ":" + second;
        }
        if (type == 3) { //2018/5/5 12:07:05
            return year + "/" + month + "/" + date + " " + hour + ":" + minute + ":" + second;
        }
        if (type == 4) { //2018/05/05 12:07:05
            return year + "/" + reviseDigitLength(month, 2) + "/" + reviseDigitLength(date, 2) + " " + hour + ":" + minute + ":" + second;
        }
        if (type == 5) { //2018-5-5
            return year + "-" + month + "-" + date;
        }
        if (type == 6) { //2018-05-05
            return year + "-" + reviseDigitLength(month, 2) + "-" + reviseDigitLength(date, 2);
        }
        if (type == 7) { //2018/5/5
            return year + "/" + month + "/" + date;
        }
        if (type == 8) { //2018/05/05
            return year + "/" + reviseDigitLength(month, 2) + "/" + reviseDigitLength(date, 2);
        }
        if (type == 9) { //20180505120705
            return year + reviseDigitLength(month, 2) + reviseDigitLength(date, 2) + hour + minute + second;
        }
        return year + reviseDigitLength(month, 2) + reviseDigitLength(date, 2);
    }
}



export {
    loadGlobalVar,
};