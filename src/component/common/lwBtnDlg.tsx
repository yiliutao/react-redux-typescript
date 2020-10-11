import * as React from 'react';
import { Button } from 'antd';
import Modal from './lwModal';
import './lwBtnDlg.less';

//按钮类型
declare type ButtonType = "default" | "primary" | "ghost" | "dashed" | "danger" | "link";

interface PropsStruct {
    btnType?: ButtonType;                                        //按钮的类型
    btnText?: string;                                             //按钮文本
    dlgTitle?: string;                                            //对话框标题
    onConfirm?: (data?: string) => void;                         //对话框右侧按钮点击事件
    onCancel?: (data?: string) => void;                          //对话框左侧按钮点击事件
}
export default class LwBtnDlg extends React.Component<PropsStruct, {}>{
    state = {
        showDlg: false,
    };
    constructor(props: PropsStruct) {
        super(props)
    }
    //右侧按钮操作
    onConfirm = () => {
        this.props.onConfirm && this.props.onConfirm();
        this.setState({ showDlg: false });
    }

    //左侧按钮操作
    onCancel = () => {
        this.props.onCancel && this.props.onCancel();
        this.setState({ showDlg: false });
    }

    //对话框销毁事件
    onDestroy = () => {
        this.setState({ showDlg: false });
    }

    //按钮点击事件
    onBtnClick = () => {
        this.setState({ showDlg: true });
    }

    //绘制对话框的foot，目前只支持两个按钮，且左侧为取消按钮，右侧为确认按钮
    getDlgFooter = () => {
        return (<div className="footer">
            <Button type="danger" onClick={this.onCancel}>取消</Button>
            <Button type="primary" onClick={this.onConfirm}>确认</Button>
        </div>);
    }

    render() {
        let { btnType, btnText = "", dlgTitle = "" } = this.props;
        let { showDlg } = this.state;
        let footer = this.getDlgFooter();
        return <span className="lwBtnDlg">
            <Button type={btnType || "primary"} onClick={this.onBtnClick}>{btnText}</Button>
            <Modal footer={footer} visible={showDlg} afterClose={this.onDestroy} maskClosable={false} sizeType="smallAuto" wrapClassName="lwBtnDlg" onCancel={this.onDestroy}>
                <div className="title">{dlgTitle}</div>
                <div className="content">
                    {this.props.children}
                </div>
            </Modal>
        </span>
    }
}