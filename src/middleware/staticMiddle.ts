import { ActionIds, getActByCode } from '@lwRedux/action/actions';
import { ReqMode, ReqStatus, ReqStruct, RspStruct, ContextStruct } from '@static/biz/bizCommon';
import { ActStruct } from '@lwRedux/action/actions/const';

interface NextStruct {
    (context: ContextStruct): void;
}
//请求数据统计中间件
function staticMiddle(store: any) {
    return function (next: NextStruct) {
        return function (context: ContextStruct) {
            //如果不存在request则需要做特殊处理，针对store直接dispatch的情况
            if (!context.request) {
                context.request = Object.assign({}, context);
            }
            //如果type没有值或者Actions中无此行为定义，则认为是非法行为
            let { type = "", actModule = "" } = context.request || context;
            let actInfo: ActStruct = getActByCode(type, actModule);
            if (!type || !actInfo) {
                console.log("非法的请求行为：" + JSON.stringify(context.request));
                return;
            }
            //具有统计属性的网络请求才能进入统计函数
            let { isStatical = true, reqMode = ReqMode.Network } = actInfo;
            if (!isStatical || reqMode == ReqMode.Local) {
                next(context);
                return;
            }
            //继续往下传context
            next(context);
            //生成全局调用请求信息，状态与之前的请求状态一致
            let contextStatic: ContextStruct = {
                type: ActionIds.local.GlobalStatic,
                request: { type: ActionIds.local.GlobalStatic, params: { reqActType: type } },
                response: { type: ActionIds.local.GlobalStatic, status: context.response.status }
            };
            contextStatic.response.status = context.response.status;
            next(contextStatic);
        }
    }
}

export default staticMiddle;