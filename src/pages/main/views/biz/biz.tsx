import * as React from 'react';
import './biz.less';
import { ReqStruct } from '@static/biz/bizCommon';

//使用redux必须要添加的引用
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { ActionIds, ActModule } from "@lwRedux/action/actions";
import * as ActionCreator from "@lwRedux/action/creator";

interface PropStruct {
    dispatch: (request: ReqStruct) => void,
}
class Biz extends React.Component<PropStruct, {}>{
    render() {
        return <div>业务内容</div>;
    }
}
//store中最新state数据映射到组件中
const mapStateToProps = (state: any, props: PropStruct) => {
    return {
        menu: state.localApi.menu
    };
}
//dispatch方法映射到组件属性中
const mapDispatchToProps = (dispatch: any, props: PropStruct) => {
    return bindActionCreators(ActionCreator, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Biz);