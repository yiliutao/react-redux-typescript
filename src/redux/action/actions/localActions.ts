import { ReqMode } from '@static/biz/bizCommon';
import { ActStruct } from './const';

interface LocalIdMap {
    GlobalStatic: string,
    AddStaticCount: string,
    ReduceStaticCount: string,
    ClearStatistics: string,
    ClearLocalData: string,
    SaveKVToLocal: string,
}
const ActionIds: LocalIdMap = {
    GlobalStatic: "GlobalStatic",               //全局统计请求
    AddStaticCount: "AddStaticCount",           //添加请求次数
    ReduceStaticCount: "ReduceStaticCount",     //减少请求次数
    ClearStatistics: "ClearStatistics",         //清空请求
    ClearLocalData: "ClearLocalData",           //清空本地数据
    SaveKVToLocal: "SaveKVToLocal",             //向本地保存数据
};

interface LocalActMap {
    GlobalStatic: ActStruct,
    AddStaticCount: ActStruct,
    ReduceStaticCount: ActStruct,
    ClearStatistics: ActStruct,
    ClearLocalData: ActStruct,
    SaveKVToLocal: ActStruct,
}

const Actions: LocalActMap = {
    ClearLocalData: { code: "ClearLocalData", reqMode: ReqMode.Local, url: "clearLocalData" },
    GlobalStatic: { code: "GlobalStatic", reqMode: ReqMode.Local, url: "globalStatic" },
    AddStaticCount: { code: "AddStaticCount", reqMode: ReqMode.Local, url: "addStaticCount", isStatical: false, },
    ReduceStaticCount: { code: "ReduceStaticCount", reqMode: ReqMode.Local, url: "reduceStaticCount", isStatical: false, },
    ClearStatistics: { code: "ClearStatistics", reqMode: ReqMode.Local, url: "ClearStatistics", isStatical: false, },
    SaveKVToLocal: { code: "SaveKVToLocal", reqMode: ReqMode.Local, url: "SaveKVToLocal" },
};
export {
    LocalIdMap,
    LocalActMap,
    ActionIds,
    Actions,
}