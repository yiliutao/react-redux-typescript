import * as React from 'react';
import './lwSpan.less';

interface PropStruct {
    value: string,                  //展示内容
    showTips?: boolean,             //是否显示tip
    noWrap?: boolean,               //是否截断显示
    maxWidth?: number,              //dom最大宽度
    minWidth?: number,              //dom最小宽度
    invalidVal?: string,            //无效值标识
}
export default class LwSpan extends React.Component<PropStruct, {}>{
    //获取显示文本
    getTextShow = () => {
        let { value, invalidVal = '--' } = this.props;
        return value ? value : invalidVal;
    };

    //获取样式
    getStyle = () => {
        let { noWrap = true, maxWidth, minWidth, } = this.props;
        let style: any = {};
        if (noWrap === true) {
            style["whiteSpace"] = "nowrap";
            style["textOverflow"] = "ellipsis";
            style["overflow"] = "hidden";
        }
        if (maxWidth) {
            style["maxWidth"] = maxWidth + "px";
        }
        if (minWidth) {
            style["minWidth"] = minWidth + "px";
        }
        return style;
    };

    render() {
        let { value, showTips = true } = this.props;
        let text = this.getTextShow();
        let style = this.getStyle();
        return <span className="lwSpan" title={showTips ? value : ""} style={style} >{text}</span>
    }
}