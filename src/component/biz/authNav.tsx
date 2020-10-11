import * as React from "react";
import { Menu } from "antd";
import "./authNav.less";

const { SubMenu } = Menu;
//菜单的数据结构
interface MenuStruct {
    code: string,                   //菜单唯一标识
    name: string,                   //菜单名称
    children?: Array<MenuStruct>,   //子菜单项标识是否是叶节点
    url: string,                    //url
    isHidden?: boolean,             //是否为可见节点
    parentCode?: string | null,     //父节点
}
interface PropStruct {
    menus: Array<MenuStruct>;                   //传入的菜单列表
    selectMenuCode?: string;                    //选中的菜单节点
    onClick?: (menu: MenuStruct) => void;       //菜单点击事件
    onInit?: (menu: MenuStruct) => void;        //菜单组件初始化事件
}
interface StateStruct {
    selectMenuCode: string;                    //选中节点
    openCodes: Array<string>;                  //展开的父节点
}
//这里只支持两级菜单，两级菜单也是产品定好的，不会有多级菜单
export default class AuthNav extends React.Component<PropStruct, StateStruct> {
    //菜单映射表
    MenuMap: any = {};
    //判断是否是叶节点
    isLeafNode = (menu: MenuStruct): boolean => {
        if (menu.children && menu.children.length > 0) {
            return false;
        }
        return true;
    }
    //遍历所有节点生成映射表(需要递归遍历)
    getMenuMapLoop = (parentCode: string | null, menuList: Array<MenuStruct>, firstLeafCode: string, callback?: (menuCode: string) => void) => {
        for (let menu of menuList) {
            if (menu.isHidden) {
                continue;
            }
            menu.parentCode = parentCode;
            this.MenuMap[menu.code] = menu;
            if (this.isLeafNode(menu)) {
                !firstLeafCode && (firstLeafCode = menu.code) && callback && callback(firstLeafCode);
                continue;
            }
            this.getMenuMapLoop(menu.code, menu.children || [], firstLeafCode, callback);
        }
    };
    getMenuMap = (props: PropStruct, callback?: any) => {
        let { selectMenuCode = "" } = props;
        //记录第一个叶节点
        let firstLeafCode: string = "";
        //遍历菜单节点
        this.MenuMap = {};
        //鉴于menus是引用需要解除引用属性
        let menus = JSON.parse(JSON.stringify(props.menus));
        this.getMenuMapLoop(null, menus, firstLeafCode, (menuCode: string) => {
            !firstLeafCode && (firstLeafCode = menuCode);
        });
        //判断传入的选中节点是否有效
        if (!selectMenuCode || !this.MenuMap[selectMenuCode]) {
            selectMenuCode = firstLeafCode;
        }
        //设置展开的父节点
        let parentCodes: Array<string> = [];
        this.getParentMenuCodes(selectMenuCode, parentCodes);
        this.setState({ selectMenuCode: selectMenuCode, openCodes: parentCodes }, () => {
            callback && callback();
        });
    };
    //根据节点code找到所有的父节点
    getParentMenuCodes = (code: string, parentCodes: Array<string>) => {
        let menu = this.MenuMap[code];
        if (!menu || !menu.parentCode) {
            return;
        }
        parentCodes.push(menu.parentCode);
        this.getParentMenuCodes(menu.parentCode, parentCodes);
    }

    constructor(props: PropStruct) {
        super(props);
        this.state = { selectMenuCode: "", openCodes: [] };
    }
    componentDidMount() {
        this.getMenuMap(this.props, () => {
            let { selectMenuCode } = this.state;
            let menu = this.MenuMap[selectMenuCode];
            this.props.onInit && this.props.onInit(menu);
        });
    }

    //判断数据是否发生了变化
    isDataChanged = (props: PropStruct, nextProps: PropStruct) => {
        let menus = JSON.stringify(props.menus);
        let nextMenus = JSON.stringify(nextProps.menus);
        if (menus != nextMenus || props.selectMenuCode != nextProps.selectMenuCode) {
            return true;
        }
        return false;
    };
    componentWillReceiveProps(nextProps: PropStruct) {
        if (this.isDataChanged(this.props, nextProps)) {
            this.getMenuMap(nextProps);
        }
    }

    //绘制导航栏(递归绘制)
    drawNavLoop = (menuList: Array<MenuStruct>) => {
        let menuListDom: Array<any> = [];
        for (let menu of menuList) {
            if (menu.isHidden) {
                continue;
            }
            if (!menu.children || menu.children.length <= 0) {
                menuListDom.push(<Menu.Item key={menu.code} title={menu.name}>{menu.name}</Menu.Item>);
                continue;
            }
            let subMenuListDom = this.drawNavLoop(menu.children);
            let subMenu = <SubMenu key={menu.code} title={menu.name}>{subMenuListDom}</SubMenu>;
            menuListDom.push(subMenu);
        }
        return menuListDom;
    };
    drawNav = () => {
        let { menus } = this.props;
        let menuDoms: Array<any> = this.drawNavLoop(menus);
        return menuDoms;
    }

    //切换菜单
    onSelectMenu = (e: any) => {
        let menuCode = e.key;
        let menu = this.MenuMap[menuCode]
        this.props.onClick && this.props.onClick(menu);
        this.setState({ selectMenuCode: e.key });
    }

    //点击展开闭合事件
    onOpenMenuChange = (openKeys: Array<string>) => {
        this.setState({ openCodes: openKeys });
    };

    render() {
        let { selectMenuCode, openCodes } = this.state;
        return <Menu mode="inline" onClick={this.onSelectMenu} selectedKeys={[selectMenuCode]} openKeys={openCodes}
            onOpenChange={this.onOpenMenuChange}>
            {this.drawNav()}
        </Menu>
    }
}