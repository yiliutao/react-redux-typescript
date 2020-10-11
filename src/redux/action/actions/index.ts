import * as NetAct from './netActions';
import * as LocalAct from './localActions';

const ActModule = {
    net: "net",
    local: "local",
}
interface ActIdMap {
    net: NetAct.CommonIdMap,
    local: LocalAct.LocalIdMap,
}
const ActionIds: ActIdMap = {
    net: NetAct.ActionIds,
    local: LocalAct.ActionIds,
};
interface ActMap {
    net: NetAct.CommonActMap,
    local: LocalAct.LocalActMap,
}
const Actions: ActMap = {
    net: NetAct.Actions,
    local: LocalAct.Actions,
};

//判断行为是否合法
function isValidAct(actCode: string) {
    let isValid: boolean = false;
    let actIdMap = <any>ActionIds;
    for (let key of Object.keys(actIdMap)) {
        let actCodeList = Object.keys(actIdMap[key]);
        if (actCodeList.includes(actCode)) {
            isValid = true;
            break;
        }
    }
    return isValid;
}

//根据行为代码获取行为信息
function getActByCode(actCode: string, actModule?: string) {
    let moduleMap = <any>Actions;
    //如果存在模块代码，则直接根据模块代码做搜索
    if (actModule) {
        let actionMap = <any>moduleMap[actModule];
        return actionMap[actCode];
    }
    for (let key of Object.keys(moduleMap)) {
        let actionMap = <any>moduleMap[key];
        if (actionMap[actCode]) {
            return actionMap[actCode];
        }
    }
    return null;
}
export {
    ActionIds,
    ActModule,
    Actions,
    isValidAct,
    getActByCode,
}