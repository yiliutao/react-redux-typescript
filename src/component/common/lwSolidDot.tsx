import * as React from 'react';
import './lwSolidDot.less';

interface PropStruct {
    width?: number;
    color?: string;
    className?: string;
    style?: any;
};
interface StateStruct { };
export default class LwSolidDot extends React.Component<PropStruct, StateStruct>{
    render() {
        let { width = 20, color = "red", className = "", style = {} } = this.props;
        style = Object.assign({}, style, { width: width + "px", height: width + "px", color: color, background: color });
        return <span className={`lwSolidDot ${className}`} style={style}></span>
    }
}