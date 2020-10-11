import { ActionIds, getActByCode } from '@lwRedux/action/actions';
import { ajax } from '@static/common/ajax';
import { ReqMode, ReqStatus, ReqStruct, RspStruct, ContextStruct } from '@static/biz/bizCommon';
import { ActStruct } from '@lwRedux/action/actions/const';

interface NextStruct {
    (context: ContextStruct): void;
}
//生成正式的ajax请求, 实现异步
function getAjaxContext(next: NextStruct, context: ContextStruct) {
    let { type, params = {}, method = "POST", actModule = "", isForm = false, showProcess = false, onFailed = null, onSuccess = null } = context.request;
    let newContext: ReqStruct = {
        type: type,
        actModule: actModule,
        params: params,
        method: method,
        isForm: isForm,
        showProcess: showProcess,
        onSuccess: (rsp?: RspStruct) => {
            context.response = Object.assign({}, context.response, rsp);
            context.response.status = ReqStatus.Success;
            next(context);
            onSuccess && onSuccess(context.response);
        },
        onFailed: (rsp?: RspStruct) => {
            context.response = Object.assign({}, context.response, rsp);
            context.response.status = ReqStatus.Failed;
            context.response.data = rsp ? rsp.data : null;
            context.response.rspCode = rsp ? rsp.rspCode : 0;
            context.response.rspDesc = rsp ? rsp.rspDesc : undefined;
            next(context);
            onFailed && onFailed(context.response);
        },
    };
    return newContext;
}

//redux中API请求发送函数
function reqMiddle(store: any) {
    return function (next: NextStruct) {
        return function (context: ContextStruct) {
            //如果不存在request则需要做特殊处理，针对store直接dispatch的情况
            if (!context.request) {
                context.request = Object.assign({}, context);
            }
            //如果type没有值或者Actions中无此行为定义，则认为是非法行为
            let { type = "", actModule = "", params = {} } = context.request || context;
            let actInfo: ActStruct = getActByCode(type, actModule);
            if (!type || !actInfo) {
                console.log("非法的请求行为：" + JSON.stringify(context.request));
                return;
            }
            //设置请求返回数据
            context.response = { type: type, actModule: actModule, status: ReqStatus.Pending, data: null, params: params };
            //这里区分本地请求和网络请求，本地请求进入一次后就结束了
            if (actInfo.reqMode == ReqMode.Local) {
                context.response.status = ReqStatus.Success;
                next(context);
                context.request.onSuccess && context.request.onSuccess(context.response);
                return;
            }
            //将状态为pending状态的请求分发出去(ajax请求并未发出去)
            next(context);
            let newContext = getAjaxContext(next, context);
            ajax(newContext);
        }
    }
}
export default reqMiddle;