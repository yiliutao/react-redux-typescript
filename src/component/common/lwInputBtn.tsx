import * as React from 'react';
import { Input, Button } from 'antd';
import './lwInputBtn.less';

declare type NoteAlign = "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "center" | "left" | "right" | "end" | "justify"
    | "match-parent" | "start" | undefined;
interface PropStruct {
    value?: string,                     //输入框中的值
    note?: string,                      //标注
    noteWidth?: number,                 //标注宽度
    valWidth?: number,                  //输入框宽度
    noteAlign?: NoteAlign,              //前面标注对齐方向
    btnText?: string,                   //按钮文本
    tips?: string,                      //信息提示文本
    placeholder?: string,               //默认显示文本
    rule?: any,                         //校验正则表达式
    disableBtn?: boolean,               //设置按钮状态
    onClick?: () => void;  //点击事件
    onCheck?: (value: string, isValid: boolean, showError: any) => void;  //数值传出
    isAllowEmpty?: boolean;             //是否允许填写空值
};
export default class LwInputBtn extends React.Component<PropStruct, {}>{
    state = {
        isValid: true,              //输入内容是否有效
        value: "",                  //输入的内容
        showErrorTips: false,       //是否显示错误信息
    };

    //检查输入内容是否符合要求
    checkValue = (val: string) => {
        let { rule, isAllowEmpty } = this.props;
        if (isAllowEmpty && !val) {
            return true;
        }
        if (!rule) {
            return true;
        }
        return rule.test(val);
    };

    //外部控制错误的显示
    onShowError = (isShowError: boolean) => {
        if (isShowError) {
            this.setState({ showErrorTips: true });
        } else {
            this.setState({ showErrorTips: false });
        }
    };
    //失焦事件
    onBlur = (e: any) => {
        let val = e.target.value;
        let isValid = this.checkValue(val);
        let showErrorTips = isValid ? false : true;
        this.setState({ isValid: isValid, value: val, showErrorTips: showErrorTips }, () => {
            this.props.onCheck && this.props.onCheck(val, isValid, this.onShowError);
        });
    };

    //改变事件
    onChange = (e: any) => {
        let val = e.target.value;
        let isValid = this.checkValue(val);
        //只要有改变就要隐藏之前的错误显示
        this.setState({ isValid: isValid, value: val, showErrorTips: false }, () => {
            this.props.onCheck && this.props.onCheck(val, isValid, this.onShowError);
        });
    };

    componentWillReceiveProps(nextProps: PropStruct) {
        //如果传入的值不是undefined，则以传入的值为主
        if (nextProps.value != undefined) {
            this.setState({ value: nextProps.value });
        }
    }

    //按钮点击事件
    onClick = () => {
        this.props.onClick && this.props.onClick();
    };

    componentDidMount() {
        let { value = "" } = this.props;
        let isValid = this.checkValue(value);
        this.setState({ isValid: isValid, value: value }, () => {
            this.props.onCheck && this.props.onCheck(value, isValid, this.onShowError);
        });
    }

    render() {
        let { valWidth = 122, btnText = "获取验证码", tips = "验证码错误", placeholder = "请输入验证码", note = "", noteWidth = 80, noteAlign, disableBtn } = this.props;
        let noteStyle = { textAlign: noteAlign, width: noteWidth + "px" };
        let { value, showErrorTips } = this.state;
        let inputStyle = { width: valWidth + "px" };
        return <div className="lwInputBtn">
            {note ? <div className="note" style={noteStyle}>{note}</div> : null}
            <div className="value">
                <Input placeholder={placeholder} onBlur={this.onBlur} onChange={this.onChange} style={inputStyle} value={value} autoComplete="off" />
                <Button onClick={this.onClick} disabled={disableBtn} className={disableBtn ? "ant-btn-disabled" : ""}>{btnText}</Button>
                <div className="tips">{showErrorTips ? tips : ""}</div>
            </div>
        </div>;
    };
}