import { ActionIds, isValidAct } from '../action/actions';
import { ReqStatus, ContextStruct } from '@static/biz/bizCommon';
import { getInitState } from "../store/state";

function funcApi(state: any, context: ContextStruct) {
    let { type } = context;
    let { params } = context.request || {};
    let { status } = context.response || {};
    let newState = { ...state };
    switch (type) {
        case ActionIds.local.GlobalStatic:
            return getGlobalStatic(newState, status, params);
        case ActionIds.local.AddStaticCount:
            return addStaticCount(newState, status, params);
        case ActionIds.local.ReduceStaticCount:
            return reduceStaticCount(newState, status, params);
        case ActionIds.local.ClearStatistics:
            return clearStatistics(newState, status, params);
        case ActionIds.local.ClearLocalData:
            return getInitState().localApi;
        case ActionIds.local.SaveKVToLocal:
            return saveKVToLocal(newState, status, params);
    }
    return newState;
}

//全局统计处理函数, params中有两个属性reqActType和count，reqActType代表请求行为，count代表请求的次数
function getGlobalStatic(state: any, status: string, params: any) {
    //检查action是否有效
    let { reqActType } = params;
    if (!isValidAct(reqActType)) {
        return state;
    }
    //首先判断是否发生了页面的切换，切换页面后全局统计中的请求应该清空
    let hash = location.hash;
    if (state.hash != hash) {
        state.reqCount = 0;
        state.reqMap = {};
        state.hash = hash;
    }
    //初始化数据，系统第一次进入该函数的时候调用
    if (!state.reqMap) {
        state.reqMap = {};
        state.reqCount = 0;
    }
    if (status == ReqStatus.Pending) {
        //增加请求次数
        state.reqCount = state.reqCount + 1;
        //将请求放入到请求映射表中，并对单个请求做统计
        if (!state.reqMap[params.reqActType]) {
            state.reqMap[params.reqActType] = { count: 1 };
        } else {
            state.reqMap[params.reqActType].count = state.reqMap[params.reqActType].count + 1;
        }
        return state;
    }
    //请求映射表中存在该请求的时候才会减少次数
    if (state.reqMap[params.reqActType] && state.reqMap[params.reqActType].count > 0) {
        state.reqMap[params.reqActType].count = state.reqMap[params.reqActType].count - 1;
        if (state.reqMap[params.reqActType].count <= 0) {
            delete state.reqMap[params.reqActType];
        }
        state.reqCount = state.reqCount - 1;
    }
    return state;
}

//添加全局统计个数
function addStaticCount(state: any, status: string, params: any) {
    //校验行为是否存在有效
    let { reqActType, count = 1 } = params;
    if (!isValidAct(reqActType)) {
        return state;
    }
    //初始化数据，系统第一次进入该函数的时候调用
    if (!state.reqMap) {
        state.reqMap = {};
        state.reqCount = 0;
        state.loadingText = "数据加载中";
    }
    //增加请求次数
    if (state.reqMap[reqActType]) {
        state.reqMap[reqActType].count = state.reqMap[reqActType].count + count;
    } else {
        state.reqMap[reqActType] = { count: count };
    }
    state.reqCount = state.reqCount + 1;
    return state;
}

//减少全局统计个数
function reduceStaticCount(state: any, status: string, params: any) {
    //校验行为是否存在有效
    let { reqActType, count = 1 } = params;
    if (!isValidAct(reqActType)) {
        return state;
    }
    //初始化数据，系统第一次进入该函数的时候调用
    if (!state.reqMap) {
        state.reqMap = {};
        state.reqCount = 0;
    }
    //减少统计次数
    if (state.reqMap[reqActType]) {
        state.reqMap[reqActType].count = (state.reqMap[reqActType].count > count) ? state.reqMap[reqActType].count - count : 0;
    } else {
        state.reqMap[reqActType] = 0;
    }
    if (state.reqMap[reqActType].count == 0) {
        delete state.reqMap[reqActType];
    }
    if (state.reqCount > 0) {
        state.reqCount = state.reqCount - 1;
    }
    return state;
}

//清空所有的请求
function clearStatistics(state: any, status: string, params: any) {
    state.reqMap = {};
    state.reqCount = 0;
    state.loadingText = "";
    return state;
}

//保存数据到本地，数据为Key-Value格式
function saveKVToLocal(state: any, status: string, params: any) {
    for (let key of Object.keys(params)) {
        state[key] = params[key];
    }
    return state;
}

export default funcApi;