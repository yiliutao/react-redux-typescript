import * as React from 'react';
import { Row, Col } from 'antd';
import './lwDetailDisplay.less';

interface Field {
    note: string;           //字段备注
    value: any;             //字段值
    key: string;            //字段唯一标识符，react特性
    span?: number;          //字段占用的行空间
};
interface PropStruct {
    colNum: number;         //列数
    fields: Array<Field>;   //字段列表
    noteWidth: number;      //标注宽度
}
export default class LwDetailDisplay extends React.Component<PropStruct, {}>{
    //获取明细行数据DOM
    getFieldRows = () => {
        let result: Array<any> = [];
        //计算每一行列宽
        let { colNum, fields, noteWidth } = this.props;
        let calcSpan = 24 / colNum;
        let rowFields: Array<any> = [];
        let rowKey = 1;
        let rowSpan = 0;
        //标注样式
        let noteStyle = { width: noteWidth + "px" };
        for (let field of fields) {
            let { note, value, key, span = calcSpan } = field;
            //可以兼容自定义宽度的字段
            if (rowFields.length >= 3 || (rowSpan + span) > 24) {
                result.push(<Row key={rowKey}>{rowFields}</Row>);
                rowKey++;
                rowFields = [];
                rowSpan = 0;
            }
            rowSpan = rowSpan + span;
            rowFields.push(
                <Col span={span} key={key}>
                    <span className="lwNote" style={noteStyle}>{note}</span>
                    <span className="lwValue" title={value}>{value}</span>
                </Col>);
        }
        //如果rowFileds中还有Dom，则需要再加一行
        if (rowFields.length >= 0) {
            result.push(<Row key={rowKey}>{rowFields}</Row>);
        }
        return result;
    };

    render() {
        return <div className="lwDetailDisplay">
            {this.getFieldRows()}
        </div>;
    }
};