import * as React from 'react';
import { Input, Icon } from 'antd';
import './lwInputTips.less';

interface Rule {
    regExp?: any;           //校验正则表达式
    length?: number;        //输入长度校验
}
declare type NoteAlign = "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "center" | "left" | "right" | "end" | "justify"
    | "match-parent" | "start" | undefined;
interface PropStruct {
    note?: string;                                  //标注文本
    noteAlign?: NoteAlign;                          //文本标注
    noteWidth?: number;                             //标注长度
    value?: string;                                 //输入框数值
    valWidth?: number;                              //输入框的长度设置
    onCheck?: (val: string, isValid?: any, onShowErrorTips?: any) => void; //验证回调函数，在失焦、数值发生变化都会调用,
    tips?: string;                                  //错误提示信息
    rule?: Rule;                                    //数值校验规则
    placeholder?: string;                           //无输入时的提示文本
    isPassword?: boolean;                           //输入框是否是密码输入
    isAllowEmpty?: boolean;                         //是否允许填写空值
    isDisabled?: boolean;     //是否禁止修改
}
export default class InputTips extends React.Component<PropStruct, {}>{
    state = {
        isPasswordVisible: false,       //密码是否可见
        showErrorTips: false,          //是否显示错误信息
        inputType: ''
    };

    //检查输入内容是否符合要求，可以允许不填写内容而不报错
    checkValue = (val: string) => {
        let { rule, isAllowEmpty } = this.props;
        if (isAllowEmpty && !val) {
            return true;
        }
        if (!rule) {
            return true;
        }
        let { regExp, length } = rule;
        if (regExp && !regExp.test(val)) {
            return false;
        }
        if (length && val.length > length) {
            return false;
        }
        return true;
    };

    //检查回调函数的回调参数, 控制错误信息的显示
    onShowErrorTips = (showError?: boolean) => {
        if (showError) {
            this.setState({ showErrorTips: true });
            return;
        }
        this.setState({ showErrorTips: false });
    }

    onChange = (e: any) => {
        let isValid = this.checkValue(e.target.value);
        //只要有改变就要隐藏之前的错误显示
        this.setState({ showErrorTips: false });
        this.props.onCheck && this.props.onCheck(e.target.value, isValid, this.onShowErrorTips);
    };

    onBlur = (e: any) => {
        let isValid = this.checkValue(e.target.value);
        let showErrorTips = isValid ? false : true;
        this.setState({ showErrorTips: showErrorTips });
        this.props.onCheck && this.props.onCheck(e.target.value, isValid, this.onShowErrorTips);
    };

    //小眼睛图标点击事件
    onEyeClick = () => {
        this.setState({ isPasswordVisible: !this.state.isPasswordVisible });
    };

    //获取密码小眼睛
    getPasswordEye = () => {
        let { isPassword = false } = this.props;
        //不是密码输入框没有小眼睛
        if (!isPassword) {
            return null;
        }
        let { isPasswordVisible } = this.state;
        if (isPasswordVisible) {
            return <Icon className="lwEye" type="eye" onClick={this.onEyeClick} />;
        }
        return <Icon className="lwEye" type="eye-invisible" onClick={this.onEyeClick} />;
    };

    componentDidMount() {
        let { value = "" } = this.props;
        let isValid = this.checkValue(value);
        this.props.onCheck && this.props.onCheck(value, isValid, this.onShowErrorTips);
    }

    componentWillReceiveProps(nextProps: PropStruct) {
        if (nextProps.value != this.props.value) {
            let isValid = this.checkValue(nextProps.value || "");
            this.props.onCheck && this.props.onCheck(nextProps.value || "", isValid, this.onShowErrorTips);
        }
    }
    onFocusInput = () => {
        this.setState({
            inputType: "password"
        })
    }
    render() {
        let { note, tips, rule, placeholder, noteAlign, value = "", noteWidth = 80, valWidth = 166, isPassword = false, isDisabled = false } = this.props;
        let { isPasswordVisible, showErrorTips, inputType } = this.state;
        noteWidth = note && noteWidth ? noteWidth : 0;
        let noteStyle = { width: noteWidth + "px", textAlign: noteAlign };
        let valStyle = { width: valWidth + "px", maxWidth: valWidth + "px" };
        return <div className="lwInputTips">
            {note ? <div className="note" style={noteStyle}>{note}</div> : null}
            <div className="value">
                <Input onChange={this.onChange} onBlur={this.onBlur} disabled={isDisabled}
                    onFocus={this.onFocusInput}
                    value={value} style={valStyle} placeholder={placeholder} type={isPassword && !isPasswordVisible ? inputType : ""} autoComplete={isPassword ? "new-password" : "off"} />
                {this.getPasswordEye()}
                {rule ? <div className="tips">{showErrorTips ? tips : ""}</div> : null}
            </div>

        </div>;
    }
}