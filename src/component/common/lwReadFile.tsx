import * as React from 'react';
import { Button } from 'antd';
import './lwReadFile.less';

interface PropStruct {
    btnText?: string;                              //按钮文本
    onFileLoaded?: (content: any) => void;      //读取文件完成后的回调
}
interface StateStruct { }
export default class LwUploadFile extends React.Component<PropStruct, StateStruct>{
    //静态变量方便生成唯一的标识符
    static count: number = 0;
    uuid: string = "";
    constructor(props: PropStruct) {
        super(props);
        //生成唯一标识符
        this.uuid = "lwUpload" + LwUploadFile.count;
        LwUploadFile.count++;
    }
    onOrgUploadClick = (e: any) => {
        let file = e.target.files[0];
        let fileReader = new FileReader();
        fileReader.readAsText(file);
        let { onFileLoaded } = this.props;
        let elementId = this.uuid;
        fileReader.onload = function () {
            console.log(this.result);
            onFileLoaded && onFileLoaded(this.result);
            let element: any = document.getElementById(elementId);
            element.value = "";
        }
    };
    onUploadClick = () => {
        //通过第三方按钮触发上传
        let element = document.getElementById(this.uuid);
        element && element.click();
    }

    render() {
        let { btnText = "导入CSV" } = this.props;
        return <span className="lwUploadFile">
            <input type="file" id={this.uuid} className="orgUploadBtn" onChange={this.onOrgUploadClick} />
            <Button type="primary" onClick={this.onUploadClick}>{btnText}</Button>
        </span>;
    }
}