import { message } from 'antd';
import { ReqStatus, ContextStruct, ReqMode } from '@static/biz/bizCommon';
import { getActByCode } from '@lwRedux/action/actions';
import { ActStruct } from '@lwRedux/action/actions/const';

const RspCodeMsg: any = {
    Exception: { code: "Exception", errorMsg: "系统处理请求数据发生异常", successMsg: "" },
    Logout: { code: "Logout", errorMsg: "系统已登出，请重新登录", successMsg: "" },
    401: { code: "401", errorMsg: "系统异常", successMsg: "" },
    403: { code: "403", errorMsg: "系统异常", successMsg: "" },
    404: { code: "404", errorMsg: "系统异常", successMsg: "" },
    503: { code: "503", errorMsg: "系统异常", successMsg: "" },
    504: { code: "504", errorMsg: "系统异常", successMsg: "" },
};

interface NextStruct {
    (params: ContextStruct): void;
}
//显示成功信息，信息的优先级为：映射表(rspCodeMsg)信息 > 视图行为(actions)信息 > 后台接口返回信息
function showSuccessMsg(returnCode: number, returnDesc: string, actInfo?: any) {
    let msg = returnDesc;
    if (actInfo && actInfo.successMsg) {
        msg = actInfo.successMsg;
    }
    if (RspCodeMsg[returnCode] && RspCodeMsg[returnCode].successMsg) {
        msg = RspCodeMsg[returnCode].successMsg;
    }
    message.success(msg, 1);
}

//错误信息表，防止错误信息提示框多次弹出
let ErrorMsgMap: any = {};
//显示错误信息，信息的优先级为：映射表(rspCodeMsg)信息 > 视图行为(actions)信息 > 后台接口返回信息
function showErrorMsg(returnCode: number, returnDesc: string, actInfo?: any) {
    let msg = returnDesc;
    if (actInfo && actInfo.errorMsg) {
        msg = actInfo.errorMsg;
    }
    //如果能查到相关错误码则根据是否配置错误信息选择展示
    if (RspCodeMsg[returnCode]) {
        msg = RspCodeMsg[returnCode].errorMsg || returnDesc;
    }
    //防止相同的错误提示信息多次弹出
    if (!ErrorMsgMap[returnCode]) {
        ErrorMsgMap[returnCode] = msg;
        message.error(msg, 1, () => {
            delete ErrorMsgMap[returnCode];
        });
    }
}

//处理正常请求结果
function alySuccessRsp(context: ContextStruct, next: NextStruct) {
    let actInfo: ActStruct = getActByCode(context.type || "");
    if (actInfo.showSuccessMsg) {
        showSuccessMsg(context.response.rspCode || 0, context.response.rspDesc || "", actInfo);
    }
    next(context);
}
//处理异常请求结果
function alyFailedRsp(context: ContextStruct, next: NextStruct) {
    let actInfo: ActStruct = getActByCode(context.type || "");
    if (actInfo.showErrorMsg) {
        showErrorMsg(context.response.rspCode || 0, context.response.rspDesc || "", actInfo);
    }
    next(context);
}

//处理返回数据中间件
function AlyRspMiddle(store: any) {
    return function (next: NextStruct) {
        return function (context: ContextStruct) {
            //如果不存在request则需要做特殊处理，针对store直接dispatch的情况
            if (!context.request) {
                context.request = Object.assign({}, context);
            }
            //从请求中分离request与response
            let { type = "", actModule = "", params = {} } = context.request || context;
            //如果type没有值或者Actions中无此行为定义，则认为是非法行为
            let actInfo: ActStruct = getActByCode(type, actModule);
            if (!type || !actInfo) {
                console.log("非法的请求行为：" + JSON.stringify(context.request));
                return;
            }
            //本地请求不做成功或者失败信息提示
            if (actInfo.reqMode == ReqMode.Local) {
                next(context);
                return;
            }
            if (context.response.status == ReqStatus.Success) {
                alySuccessRsp(context, next);
            }
            if (context.response.status == ReqStatus.Failed) {
                alyFailedRsp(context, next);
            }
        }
    }
}

export default AlyRspMiddle;