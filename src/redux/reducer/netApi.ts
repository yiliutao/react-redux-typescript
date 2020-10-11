import { ActionIds } from '../action/actions';
import { ReqStatus, ContextStruct } from '../../static/biz/bizCommon';
import { getInitState } from "../store/state";

function funcApi(state: any, context: ContextStruct) {
    let { type } = context;
    let { status, data } = context.response || {};
    let newState = { ...state };
    switch (type) {
    }
    return newState || {};
}
export default funcApi;