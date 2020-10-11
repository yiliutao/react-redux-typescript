import * as React from 'react';
import { Dropdown, Input, Menu, Icon, Modal } from 'antd';
import './lwMulSelect.less';

const MenuItem = Menu.Item;
interface NodeStruct {
    code: string;
    name: string;
}
interface PropsStruct {
    dataList: Array<NodeStruct>;
    selectCodes?: Array<string>;
    placeholder?: string;
    width?: number;
    height?: number;
    dlgWidth?: number;
    dlgHeight?: number;
    noDataTips?: string;
    onSelect?: (selectCodes: Array<string>) => void;
    getPopupContainer?: () => HTMLElement;
}
interface StateStruct {
    visible: boolean;
    selectCodes: Array<string>;
    showSettingDlg: boolean;
}
export default class LwMulSelect extends React.Component<PropsStruct, StateStruct>{
    //根据数据生成下拉列表
    dataList: Array<NodeStruct> = [];
    //数据映射表
    dataMap: Map<string, NodeStruct> = new Map<string, NodeStruct>();

    //生成数据列表和映射表
    getDataListMap = (props: PropsStruct) => {
        let { dataList } = props;
        this.dataList = dataList;
        //如果有数据列表且列表长达大于1，则需要添加全部选项
        if (this.dataList && this.dataList.length > 1) {
            this.dataList = [{ code: "all", name: "全部" }].concat(this.dataList);
        }
        //生成映射表
        for (let data of dataList) {
            !this.dataMap.has(data.code) && this.dataMap.set(data.code, data);
        }
    };

    //菜单点击事件
    onMenuClick = (e: any) => {
        let { selectCodes } = this.state;
        let index = selectCodes.findIndex((code: string) => { return code == e.key; });
        if (index != -1) {
            selectCodes.splice(index, 1);
        } else {
            selectCodes.push(e.key);
        }
        //如果勾选项中有全部，则将所有项都标记为勾选
        if (index == -1 && e.key == "all") {
            for (let data of this.dataList) {
                !selectCodes.includes(data.code) && selectCodes.push(data.code);
            }
        }
        //如果取消勾选项为全部，则取消全部勾选
        if (index != -1 && e.key == "all") {
            selectCodes = [];
        }
        //如果勾选个数小于选项个数，则取消全部项的勾选状态
        if (selectCodes.length < this.dataList.length) {
            if (selectCodes.includes("all")) {
                let indexAll = selectCodes.findIndex((code: string) => { return code == "all"; });
                selectCodes.splice(indexAll, 1);
            }
        }
        //如果勾选了除了all以外的其它选项，all自动勾选
        if (selectCodes.length == (this.dataList.length - 1)) {
            let indexAll = this.dataList.findIndex((data: NodeStruct) => { return data.code == "all"; });
            if (indexAll != -1 && !selectCodes.includes("all")) {
                selectCodes.push("all");
            }
        }
        this.setState({ selectCodes });
        this.props.onSelect && this.props.onSelect(selectCodes);
    };

    getOverLay = () => {
        if (this.dataList.length <= 0) {
            return <div className="lwMulSelectNoData">{
                this.props.noDataTips ? this.props.noDataTips : "暂无数据"
            }</div>;
        }
        let { selectCodes } = this.state;
        return <Menu onClick={this.onMenuClick}>
            {
                this.dataList.map((data: NodeStruct) => {
                    return <MenuItem key={data.code} className="lwMulSelectItem">
                        <input type="checkbox" className="lwMulSelectCheckBox" checked={selectCodes.includes(data.code) ? true : false} />
                        <span className="lwMulSelectItemName">{data.name}</span>
                    </MenuItem>;
                })
            }
        </Menu>;
    };

    onVisibleChange = (visible: boolean) => {
        this.setState({ visible });
    };

    constructor(props: PropsStruct) {
        super(props);
        this.state = { visible: false, selectCodes: props.selectCodes || [], showSettingDlg: false };
        this.getDataListMap(props);
    }
    componentWillReceiveProps(nextProps: PropsStruct) {
        if (nextProps.selectCodes && JSON.stringify(nextProps.selectCodes) != JSON.stringify(this.props.selectCodes)) {
            this.setState({ selectCodes: nextProps.selectCodes });
        }
        this.getDataListMap(nextProps);
    }

    getPopupContainer = () => {
        let element = this.props.getPopupContainer ? this.props.getPopupContainer() : document.body;
        return element;
    };

    //点击勾选项后面的小X事件
    onCloseSelectItem = (node: NodeStruct) => {
        let { selectCodes } = this.state;
        let index = selectCodes.findIndex((code: string) => { return code == node.code; });
        if (index != -1) {
            selectCodes.splice(index, 1);
        }
        this.setState({ selectCodes });
    }
    //绘制单个展示块
    getDisplayBlock = (node: NodeStruct) => {
        return <span key={node.code} className="lwMulSelectDisplayItem">
            {node.name}
            <Icon type="close" onClick={() => { this.onCloseSelectItem(node); }} />
        </span>;
    };
    //绘制展示块列表
    getDisplayBlocks = () => {
        let result: Array<JSX.Element> = [];
        let { selectCodes } = this.state;
        for (let code of selectCodes) {
            let selectNode: NodeStruct | undefined = this.dataMap.get(code);
            if (!selectNode) {
                continue;
            }
            let node = selectNode as NodeStruct;
            result.push(this.getDisplayBlock(node));
        }
        return result;
    };
    onShowSettingDlg = () => {
        this.setState({ showSettingDlg: true });
    }
    //绘制展示内容
    getDisplayDom = () => {
        let { selectCodes } = this.state;
        let { placeholder, width = 140, height = 32 } = this.props;
        if (selectCodes.length <= 0) {
            let style = { width: width + "px", height: height + "px" };
            return <Input placeholder={placeholder} style={style} />;
        }
        let spanWidth = 60;
        let spanCount = Math.floor(width / spanWidth);
        if (selectCodes.length <= spanCount) {
            return <span className="lwMulSelectDisplay" style={{ width: width + "px" }}>{this.getDisplayBlocks()}</span>;
        }
        return <span className="lwMulSelectDisplay" style={{ width: width + "px" }}>
            {this.getDisplayBlocks()}
            <Icon type="lwMulSelectDlgIcon" onClick={this.onShowSettingDlg} />
        </span>;
    };

    onSettingDlgOk = () => {
        this.setState({ showSettingDlg: false });
    };
    onSettingDlgCancel = () => {
        this.setState({ showSettingDlg: false });
    };
    render() {
        let { visible, selectCodes, showSettingDlg } = this.state;
        return <React.Fragment>
            <Dropdown overlay={this.getOverLay()} className="lwMulSelect" visible={visible} onVisibleChange={this.onVisibleChange} overlayClassName="lwMulSelectDlg"
                trigger={["click"]} getPopupContainer={this.getPopupContainer}>
                <div style={{ display: "inline-block" }}>
                    {this.getDisplayDom()}
                    {selectCodes.length <= 0 ? <Icon className="lwMulSelectIcon" type="down" /> : null}
                </div>
            </Dropdown>
            <Modal className="lwMulSelectSettingDlg" visible={showSettingDlg} onOk={this.onSettingDlgOk} onCancel={this.onSettingDlgCancel} closable={false}>
                <div>{this.getDisplayBlocks()}</div>
            </Modal>
        </React.Fragment>;
    }
}