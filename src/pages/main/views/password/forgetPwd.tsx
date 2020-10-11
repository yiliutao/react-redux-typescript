import * as React from "react";
import styled from "styled-components";
import { Form, Button, message } from "antd";
import { ReqStruct } from '@static/biz/bizCommon';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ActionIds, ActModule } from '@lwRedux/action/actions';
import * as ActionCreator from '@lwRedux/action/creator';

interface PropsStruct {
    className?: any;
    dispatch: (request: ReqStruct) => void,
}
class ForgetPassword extends React.Component<PropsStruct, {}>{
    render() {
        return <div>????</div>;
    }
}
const StylePage = styled(ForgetPassword)``;
const mapStateToProps = (state: any) => {
    return {};
};
const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators(ActionCreator, dispatch);
};
const WrappPage = connect(mapStateToProps, mapDispatchToProps)(StylePage);
export default WrappPage;
