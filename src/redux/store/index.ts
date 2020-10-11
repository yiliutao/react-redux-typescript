import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import Reducer from '../reducer/index';
import { getInitState, clearState } from './state';
import ReqMiddle from '@middleware/reqMiddle';
import StaticMiddle from '@middleware/staticMiddle';
import RspAlyMiddle from '@middleware/rspAlyMiddle';

//保存store实例对象
let store: any = null;
//初始化store
function initStore() {
    clearState();
    let initState = getInitState();
    store = createStore(Reducer, initState, applyMiddleware(thunk, ReqMiddle, StaticMiddle, RspAlyMiddle));
    return store;
}
//获取store实例
function getStore(): Store {
    return <Store>store;
}

export {
    initStore,
    getStore,
}