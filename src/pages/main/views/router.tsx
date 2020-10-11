import * as React from 'react';
import { Switch, Redirect, Route, HashRouter } from 'react-router-dom';
import Biz from './biz/biz';
import Login from './login/login';
import ForgetPwd from "./password/forgetPwd";
import ActiveAcct from "./account/activeAcct";
//使用redux必须要添加的引用
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionIds, ActModule } from '@lwRedux/action/actions';
import * as ActionCreator from '@lwRedux/action/creator';

interface PropStruct {
    className?: string,
}

class AppRouter extends React.Component<PropStruct, {}>{
    render() {
        return <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/forgetPwd" component={ForgetPwd} />
                <Route path="/activeAcct" component={ActiveAcct} />
                <Route path="/biz" component={Biz} />
                <Redirect to="/login" />
            </Switch>
        </HashRouter>;
    }
}

const mapStateToProps = (state: any, props: PropStruct) => {
    return {
        reqCount: state.localApi.reqCount || 0,
        reqMap: state.localApi.reqMap || {},
    };
};
const mapDispatchToProps = (dispatch: any, props: PropStruct) => {
    return bindActionCreators(ActionCreator, dispatch);
};
const WrapApp = connect(mapStateToProps, mapDispatchToProps)(AppRouter);
export default WrapApp;