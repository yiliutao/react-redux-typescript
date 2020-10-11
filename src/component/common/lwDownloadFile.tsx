import * as React from 'react';
import { Button } from 'antd';
import './lwDownloadFile.less';

interface PropStruct {
    btnText?: string;                               //按钮文本
    url: string;                                    //下载文件的接口url
    params: Map<string, string>;                    //下载接口需要传入的参数
    onComplete?: () => void;                        //组件完成函数
}
interface StateStruct {
}
export default class LwDownloadFile extends React.Component<PropStruct, StateStruct>{
    downloadRef: any = null;
    //生成提交参数Dom
    getParamDomList = () => {
        let { params } = this.props;
        let result: Array<JSX.Element> = [];
        for (let key of params.keys()) {
            let value = params.get(key);
            result.push(<input key={key} type="hidden" name={key} value={value} />)
        }
        return result;
    };
    //下载文件
    onDownloadFile = () => {
        this.downloadRef && this.downloadRef.submit();
    }

    constructor(props: PropStruct) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.onComplete && this.props.onComplete();
    }

    //获取点击Dom
    getOperDom = () => {
        return this.props.children ? this.props.children : <Button type="primary">导出文件</Button>;
    }

    render() {
        let { url } = this.props;
        return <div className="lwDownloadFile" onClick={this.onDownloadFile}>
            {this.getOperDom()}
            <form target="_self" method="post" name="downloadFile" action={url} ref={(ref) => { this.downloadRef = ref; }}>
                {this.getParamDomList()}
            </form>
        </div>;
    }
}