import * as React from 'react';
import { Button, message, Input } from 'antd';
import { ReqStruct } from '@static/biz/bizCommon';
import "./login.less";

//使用redux必须要添加的引用
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionIds } from '../../../../redux/action/actions';
import * as ActionCreator from '../../../../redux/action/creator';

interface PropStruct {
    dispatch: (request: ReqStruct) => void,
}
class Login extends React.Component<PropStruct, {}>{
    render() {
        return <div className="login">登录页面</div>;
    }
}
//store中最新state数据映射到组件中
const mapStateToProps = (state: any, props: PropStruct) => {
    return {};
}
//dispatch方法映射到组件属性中
const mapDispatchToProps = (dispatch: any, props: PropStruct) => {
    return bindActionCreators(ActionCreator, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
