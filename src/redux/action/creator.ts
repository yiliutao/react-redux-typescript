import { ReqStruct, ContextStruct, RspStruct, ReqStatus } from '@static/biz/bizCommon';

function dispatch(request: ReqStruct) {
    let response: RspStruct = { type: request.type || "", actModule: request.actModule, params: request.params, status: ReqStatus.Pending };
    let context: ContextStruct = { type: request.type || "", actModule: request.actModule, request: request, response: response };
    return context;
}
export {
    dispatch,
}