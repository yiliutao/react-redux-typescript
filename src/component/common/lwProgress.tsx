import * as React from 'react';
import { Modal } from 'antd';
import './lwProgress.less';

interface PropStruct {
    rate: number;      //大于等于0的时候开始，大于等于100的时候结束，初始化的时候一定要设置为负数
    onComplete?: () => void;
    tipText?: string;
};
export default class LwProgress extends React.Component<PropStruct, {}>{
    state = {
        visible: false,     //控制进度条是否可见
    };

    constructor(props: PropStruct) {
        super(props);
        this.state.visible = props.rate >= 0 ? true : false;
    }

    componentWillReceiveProps(nextProps: PropStruct) {
        if (nextProps.rate >= 0) {
            this.setState({ visible: true });
        }
        if (nextProps.rate >= 100) {
            this.setState({ visible: false });
            if (this.props.onComplete) {
                this.props.onComplete();
            }
        }
        if (nextProps.rate < 0) {
            this.setState({ visible: false });
        }
    };

    //这样可以防止进度显示数字变小的问题
    shouldComponentUpdate(nextProps: PropStruct) {
        return nextProps.rate <= this.props.rate ? false : true;
    }

    render() {
        let { visible } = this.state;
        let rate: any = this.props.rate < 0 ? 0 : this.props.rate.toFixed(2);
        let { tipText = "已完成" } = this.props;
        return <Modal visible={visible} footer={null} maskClosable={false} closable={false} wrapClassName="lwProgress">
            <div className='content'>{`${tipText}${rate}%`}</div>
        </Modal>
    }
}