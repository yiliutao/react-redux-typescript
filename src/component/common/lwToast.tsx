import * as React from 'react';
import styled from "styled-components";

interface PropsStruct {
    className?: any;
    visiblie?: boolean;
}
class LwToast extends React.Component<PropsStruct, {}>{
    render() {
        let { className, visiblie = false } = this.props;
        return <div className={`${className} lwToast ${visiblie ? "visible" : 'isVisible'}`}>
            <div className="modalMask"></div>
            <div className="modalBox">
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        </div>
    }
}
const styledPage = styled(LwToast)`
    &.lwToast{
        .modalBox{
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            overflow: auto;
            outline: 0;
            > .content{
                color: rgba(0,0,0,.65);
                font-size: 14px;
                position: relative;
                top: 100px;
                width: 350px;
                margin: 0 auto;
                background:rgb(254,251,232);
                border:1px solid #FAAD14;
                >.anticon{
                    color: #FAAD14;
                    padding: 10px;
                }
            }
        }
        .modalMask {
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1000;
            height: 100%;
            background-color: rgba(0,0,0,.65);
            filter: alpha(opacity=50);
        }
    }
    &.isVisible{
        display:none;
    }
    &.visible{
        display:block;
    }
`
export default styledPage;