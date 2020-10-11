import * as React from 'react';
import { Modal } from 'antd';
import './lwModal.less';

//对话框尺寸设置
const DlgSizeType = {
    superFixed: "superFixed",
    bigFixed: "bigFixed",
    middleFixed: "middleFixed",
    smallFixed: "smallFixed",
    superAuto: "superAuto",
    bigAuto: "bigAuto",
    middleAuto: "middleAuto",
    smallAuto: "smallAuto",
    newSmallAuto: "newSmallAuto"
};
const DlgSize: any = {
    superFixed: { width: 920, height: 740 },
    bigFixed: { width: 720, height: 640 },
    middleFixed: { width: 640, height: 600 },
    smallFixed: { width: 450, height: 265 },
    newSmallAuto: { widt: 450, minHeight: 120 },
    superAuto: { width: 920, maxHeight: 740, minHeight: 120 },
    bigAuto: { width: 720, maxHeight: 640, minHeight: 120 },
    middleAuto: { width: 640, maxHeight: 600, minHeight: 120 },
    smallAuto: { width: 450, maxHeight: 440, minHeight: 120 },
};

//对话框按钮类型
declare type ButtonType = 'primary' | 'ghost' | 'dashed' | 'danger';
interface Size {
    width?: number,
    height?: number,
    minHeight?: number,
    maxHeight?: number,
};

//对话框尺寸类型
declare type sizeType = "superFixed" | "bigFixed" | "middleFixed" | "smallFixed" | "superAuto" | "bigAuto" | "middleAuto" | "smallAuto" | "newSmallAuto";

//对话框尺寸
interface ModalProps {
    /** 对话框是否可见 */
    visible?: boolean;
    /** 确定按钮 loading */
    confirmLoading?: boolean;
    /** 标题 */
    title?: React.ReactNode | string;
    /** 是否显示右上角的关闭按钮 */
    closable?: boolean;
    /** 点击确定回调 */
    onOk?: (e: React.MouseEvent<HTMLElement>) => void;
    /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调 */
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
    afterClose?: () => void;
    /** 垂直居中 */
    centered?: boolean;
    /** 宽度 */
    width?: string | number;
    /** 底部内容 */
    footer?: React.ReactNode;
    /** 确认按钮文字 */
    okText?: React.ReactNode;
    /** 确认按钮类型 */
    okType?: ButtonType;
    /** 取消按钮文字 */
    cancelText?: React.ReactNode;
    /** 点击蒙层是否允许关闭 */
    maskClosable?: boolean;
    /** 强制渲染 Modal */
    forceRender?: boolean;
    destroyOnClose?: boolean;
    style?: React.CSSProperties;
    wrapClassName?: string;
    maskTransitionName?: string;
    transitionName?: string;
    className?: string;
    getContainer?: string | HTMLElement | false | null;
    zIndex?: number;
    bodyStyle?: React.CSSProperties;
    maskStyle?: React.CSSProperties;
    mask?: boolean;
    keyboard?: boolean;
    wrapProps?: any;
    prefixCls?: string;
    closeIcon?: React.ReactNode;
    sizeType: sizeType,
}

export default class LwModal extends React.Component<ModalProps, any>{
    getModalBodyStyle = () => {
        let style = {};
        let { sizeType = DlgSizeType.smallFixed } = this.props;
        if (sizeType == DlgSizeType.smallFixed || sizeType == DlgSizeType.middleFixed || sizeType == DlgSizeType.bigFixed) {
            let { height } = DlgSize[sizeType];
            style = { height: height + "px" };
        } else {
            let { minHeight, maxHeight } = DlgSize[sizeType];
            style = { minHeight: minHeight + "px", maxHeight: maxHeight + "px" };
        }
        return style;
    };

    getModalWidth = () => {
        let width = 0;
        let { sizeType = DlgSizeType.smallFixed } = this.props;
        width = DlgSize[sizeType].width;
        return width;
    };

    render() {
        let width = this.getModalWidth();
        let bodyStyle = this.getModalBodyStyle();
        let wrapClassName = this.props.wrapClassName ? `lwModal ${this.props.wrapClassName}` : "lwModal";
        return <Modal {...this.props} width={width} bodyStyle={bodyStyle} wrapClassName={wrapClassName} maskClosable={false}>
            {this.props.children}
        </Modal>
    }
}