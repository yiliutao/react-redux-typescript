import { combineReducers } from 'redux';
import netApi from './netApi';
import localApi from './localApi';
import { ContextStruct } from '@static/biz/bizCommon';
const Reducer = combineReducers<any, ContextStruct>({
    netApi,
    localApi,
});
export default Reducer;