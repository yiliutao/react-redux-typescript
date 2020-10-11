import * as React from 'react';
import { Dropdown, Menu, Icon } from 'antd';
import './lwDropdown.less';

interface MenuStruct {
    code: string,
    name: string,
}
const MenuItem = Menu.Item;
interface propStruct {
    className?: string;
    onSelect: (code: string) => void;               //点击下拉菜单事件，code为点击菜单项代码
    menus: Array<MenuStruct>;                       //需要展示的菜单列表
    visibleDom?: JSX.Element;                       //下拉菜单可见时的dom
    hideDom?: JSX.Element;                          //下拉菜单不可见时的dom
    text?: string,
    onVisibleChange?: (visible: boolean) => void;   //可视状态变化函数
    getPopupContainer?: () => any;                  //依附Dom设置
}
export default class LwDropdown extends React.Component<propStruct, {}>{
    state = { visible: false };

    //下拉菜单的点击事件
    onSelect = (e: any) => {
        this.setState({ visible: false });
        this.props.onSelect && this.props.onSelect(e.key);
    };

    //根据传入的菜单数据生成菜单选项
    getMenus = () => {
        let { menus = [] } = this.props;
        return (<Menu onClick={this.onSelect}>
            {
                menus.map((menu) => {
                    return <MenuItem key={menu.code}>{menu.name}</MenuItem>
                })
            }
        </Menu>);
    };

    //当菜单可见状态发生变化的时候调用
    onVisibleChange = (visible: boolean) => {
        this.setState({ visible });
        this.props.onVisibleChange && this.props.onVisibleChange(visible);
    };

    //根据传入的图标样式生成下拉菜单图标和文本
    getClickIcon = () => {
        let { visibleDom = <Icon type="up-square" />, hideDom = <Icon type="down-square" />, text } = this.props;
        if (this.state.visible) {
            return <span className="lwDropdown">
                {text}
                {visibleDom}
            </span>;
        } else {
            return <span className="lwDropdown">
                {text}
                {hideDom}
            </span>;
        }
    };

    //获取弹框依赖父节点
    getPopupContainer = () => {
        if (this.props.getPopupContainer) {
            let container = this.props.getPopupContainer();
            return container ? container : document.body;
        } else {
            return document.body;
        }
    };

    render() {
        let menu = this.getMenus();
        let clickIcon = this.getClickIcon();
        let { className } = this.props;
        return (<Dropdown overlay={menu} trigger={["click"]} onVisibleChange={this.onVisibleChange} getPopupContainer={this.getPopupContainer} overlayClassName={`lwDropdownDlg ${className}`}>
            {clickIcon}
        </Dropdown>);
    }
}