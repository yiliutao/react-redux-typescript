import * as React from 'react';
import { Table, Pagination } from 'antd';
import { PaginationConfig } from 'antd/lib/pagination';
import './lwTable.less';

enum SortStatusCode { ascend = "ascend", descend = "descend", asc = "asc", desc = "desc" };
const SortStatus = {
    ascend: { code: "ascend", name: "升序", alias: "asc" },
    descend: { code: "descend", name: "降序", alias: "desc" },
};
interface ColumnStruct {
    code: string;
    name: string;
    key?: string;
    dataIndex?: string;
    title?: string;
    sorter?: boolean;
    sortOrder?: any;
    sortDirections?: Array<any>;
}
interface PropStruct {
    dataList: Array<any>;   //表格数据列表
    columns: Array<ColumnStruct>;    //表格列信息
    total?: number;         //总的数据量
    pageNum?: number;       //页码
    pageSize?: number;      //每页数据量
    isPaging?: boolean;     //是否分页
    checkType?: "radio" | "checkbox" | null | undefined; //是否显示勾选框以及勾选框类型
    onSelect?: (selected: any, selectedRows: Array<any>, excludeRows?: Array<any>) => void; //分页勾选事件
    onPaging?: (pageNum: number, pageSize: any) => void;                          //分页点击事件
    selectRowKeys?: Array<string>;  //勾选行设置，类似于Input中的value属性，只要外部有涉及，则全部由外部控制
    className?: string;             //传入组件的样式
    pagingText?: any;               //分页器处的提示文本
    isCrossPageCheck?: boolean;     //默认不支持跨页勾选
    showSizeChanger?: boolean;      //是否改变页面显示数量
    onShowSizeChange?: (current: number, size: number) => void; //改变页面显示数量回调函数
    hideCheckAll?: boolean;         //是否隐藏全选勾选框
    pageSizeOptions?: Array<string>;//每页数据量下拉选项
    highLightField?: string;        //控制行高亮显示的字段
    isHighLight?: boolean;          //是否具有高亮功能
    onColSort?: (field: string, order: string) => void; //排序过滤的回调函数
    sortField?: string;             //排序字段
    sortOrder?: string;             //排序规则
    clearSelectRows?: boolean;      //清除所有勾选
}
export default class BaseTable extends React.Component<PropStruct, {}>{
    state: any = {
        selectRowKeys: [],      //勾选行key列表
        redrawFlag: false,      //重绘标记
    };
    //是否全选
    isSelectAll = false;
    //选中的行
    selectedRows: Array<any> = [];
    //排除的行
    excludeRows: Array<any> = [];
    //数据列表标识
    dataKey = "[]";

    //设置表格行样式
    setRowClassName = (record: any, index: number) => {
        let className = "", { isHighLight = false, highLightField = "highLight" } = this.props;
        if (record.disableCheck) {
            className = "disableCheck "
        }
        if (index % 2 == 0) {
            className = className + "odd";
        } else {
            className = className + "even";
        }
        //设置了高亮以及高亮字段
        if (isHighLight && record[highLightField]) {
            className = "highLight";
        }
        //设置了高亮以及高亮类型
        if (isHighLight && record["highLightClass"]) {
            className = "highLight " + record["highLightClass"];
        }
        return className;
    }

    //分页页码点击事件
    onPaging = (pageNum: number, pageSize: any) => {
        let { onPaging } = this.props;
        onPaging && onPaging(pageNum, pageSize);
    };
    //生成分页器设置
    getPagination = () => {
        let { total = 0, pageNum = 1, pageSize = 10, isPaging = true, showSizeChanger = false, onShowSizeChange, pagingText, pageSizeOptions } = this.props;
        if (!isPaging) {
            return null;
        }
        let showTotalText = pagingText ? pagingText : `总共${total}条记录`;
        return <Pagination current={pageNum} pageSize={pageSize} total={total} showQuickJumper={true} showTotal={(total: number) => { return showTotalText; }}
            onChange={this.onPaging} showSizeChanger={showSizeChanger} onShowSizeChange={onShowSizeChange} pageSizeOptions={pageSizeOptions} />;
    };

    //根据勾选项获取勾选行的key
    getSelectedRowKeys = () => {
        let selectedRowKeys: Array<string> = [];
        for (let row of this.selectedRows || []) {
            selectedRowKeys.push(row.key);
        }
        return selectedRowKeys;
    };

    //从勾选列表中删除指定行
    deleteRowFromSelectRows = (row: any) => {
        let index = this.selectedRows.findIndex((selectRow: any) => { return selectRow.key == row.key; });
        if (index != -1) {
            this.selectedRows.splice(index, 1);
        }
    };

    //向勾选列表中添加指定行，如果原来selectRows中不存在，返回值为新行数据，存在返回null
    addRowToSelectRows = (row: any) => {
        let index = this.selectedRows.findIndex((selectRow: any) => { return selectRow.key == row.key; });
        if (index == -1) {
            this.selectedRows.push(row);
            return row;
        }
        return null;
    };

    //从排除列表中删除指定行，如果原来selectRows中存在，返回值为新行数据，不存在返回null
    deleteRowFromExcludeRows = (row: any) => {
        let index = this.excludeRows.findIndex((excludeRow: any) => { return excludeRow.key == row.key; });
        if (index != -1) {
            this.excludeRows.splice(index, 1);
            return row;
        }
        return null;
    };

    //向排除列表中添加指定行
    addRowToExcludeRows = (row: any) => {
        let index = this.excludeRows.findIndex((excludeRow: any) => { return excludeRow.key == row.key; });
        if (index == -1) {
            this.excludeRows.push(row);
        }
    };

    //设置表格勾选属性
    rowSelection: any = null;
    setRowSelection = () => {
        let { checkType, hideCheckAll, isCrossPageCheck } = this.props;
        if (!checkType) {
            this.rowSelection = null;
            return;
        }
        if (checkType == "checkbox" && !hideCheckAll && isCrossPageCheck) {
            let domList = document.querySelectorAll(".ant-table-thead .ant-table-selection-column .ant-checkbox-input");
            for (let dom of domList) {
                dom.setAttribute("title", "跨页全选/反选");
            }
        }
        //设置表格勾选项
        let { selectRowKeys } = this.state;
        this.rowSelection["selectedRowKeys"] = selectRowKeys;
    };
    //全部勾选事件，单选和不选择情况下不存在全部勾选
    onSelectAll = (selected: boolean, selectedRows: Array<any>) => {
        let { isCrossPageCheck, onSelect, dataList } = this.props;
        this.isSelectAll = selected;
        //如果是全选
        if (this.isSelectAll) {
            this.selectedRows = JSON.parse(JSON.stringify(dataList)) || [];
            this.excludeRows = [];
            let selectRowKeys = this.getSelectedRowKeys();
            this.setState({ selectRowKeys: selectRowKeys }, () => {
                let selectRowsClone = JSON.parse(JSON.stringify(this.selectedRows));
                let excludeRowsClone = JSON.parse(JSON.stringify(this.excludeRows));
                onSelect && onSelect(isCrossPageCheck ? "all" : selected, selectRowsClone, excludeRowsClone);
            });
            return;
        }
        //如果是取消全选
        this.selectedRows = [];
        this.excludeRows = [];
        let selectRowKeys = this.getSelectedRowKeys();
        this.setState({ selectRowKeys: selectRowKeys }, () => {
            let selectRowsClone = JSON.parse(JSON.stringify(this.selectedRows));
            onSelect && onSelect(selected, selectRowsClone, []);
        });
    };
    //普通勾选事件
    onSelect = (row: any, selected: boolean, selectedRows: Array<any>, ) => {
        let { isCrossPageCheck, onSelect, checkType } = this.props;
        //如果是单选，则需要先清空之前的勾选项
        if (checkType == "radio") {
            this.selectedRows = [];
        }
        //如果是取消勾选
        if (!selected) {
            this.deleteRowFromSelectRows(row);
            isCrossPageCheck && this.addRowToExcludeRows(row);
        } else {
            this.addRowToSelectRows(row);
            isCrossPageCheck && this.deleteRowFromExcludeRows(row);
        }
        let selectRowKeys = this.getSelectedRowKeys();
        this.setState({ selectRowKeys: selectRowKeys }, () => {
            //勾选行要JSON化一下，避免外部变量引用
            let selectRowsClone = JSON.parse(JSON.stringify(this.selectedRows));
            let excludeRowsClone = this.isSelectAll ? JSON.parse(JSON.stringify(this.excludeRows)) : [];
            let selectFlag = this.isSelectAll && isCrossPageCheck ? "all" : selected;
            onSelect && onSelect(selectFlag, selectRowsClone, excludeRowsClone);
        });
    };
    //表格勾选设置以及初始化
    constructor(props: PropStruct) {
        super(props);
        let { checkType, selectRowKeys = [], columns } = props;
        //只有checkbox不为空时才会触发表格勾选设置
        if (checkType) {
            this.rowSelection = {
                type: checkType,
                onSelect: this.onSelect,
                onSelectAll: this.onSelectAll,
            };
            //设置勾选属性，当数据行中有disableCheck的时候，需要将勾选框置灰
            this.rowSelection["getCheckboxProps"] = (record: any) => {
                return { disabled: record.disableCheck ? true : false };
            }
            //设置默认勾选项
            this.state.selectRowKeys = selectRowKeys;
            //根据默认勾选项找到勾选数据
            this.selectedRows = this.getSelectRows(selectRowKeys, props.dataList || []);
        }
    }

    //如果selectRowKeys为组件自动管理，需要判断数据是否有变化
    isDataChanged = (props: PropStruct, nextProps: PropStruct): boolean => {
        //获取数据判断列
        let { columns } = props;
        let orgDataList: Array<any> = [];
        let newDataList: Array<any> = [];
        //根据数据列生成判断数据
        for (let data of props.dataList) {
            let orgData: any = {};
            for (let column of columns) {
                orgData[column.code] = data[column.code];
            }
            orgDataList.push(orgData);
        }
        for (let data of nextProps.dataList) {
            let newData: any = {};
            for (let column of columns) {
                newData[column.code] = data[column.code];
            }
            newDataList.push(newData);
        }
        if (JSON.stringify(orgDataList) != JSON.stringify(newDataList)) {
            return true;
        }
        return false;
    };
    //判断表格列是否发生变化
    isColumnsChange = (props: PropStruct, nextProps: PropStruct) => {
        //获取之前列信息
        let preColumns: Array<any> = [];
        for (let column of props.columns) {
            preColumns.push({ code: column.code || column.dataIndex, name: column.name || column.title });
        }
        //获取新属性中的列信息
        let curColumns: Array<any> = [];
        for (let column of nextProps.columns) {
            curColumns.push({ code: column.code || column.dataIndex, name: column.name || column.title });
        }
        if (JSON.stringify(preColumns) != JSON.stringify(curColumns)) {
            return true;
        }
        return false;
    };
    //根据选中的key，从数据列表中找出选中的数据
    getSelectRows = (selectKeys: Array<string>, dataList: Array<any>) => {
        let selectRows: Array<any> = [];
        for (let data of dataList) {
            if (selectKeys.includes(data.key)) {
                selectRows.push(data);
            }
        }
        return selectRows;
    };

    //添加补充行数据到selectRows
    addMakeUpRows = (makeUpRows: Array<any>) => {
        for (let row of makeUpRows) {
            this.addRowToSelectRows(row);
        }
    };

    //从选中行里面删除不存在的行
    deleteUselessRows = (selectRowKeys: Array<string>) => {
        let tmpSelectRows: Array<any> = [];
        for (let row of this.selectedRows) {
            let isRowValid: boolean = false;
            for (let key of selectRowKeys) {
                if (row.key == key) {
                    isRowValid = true;
                    break;
                }
            }
            isRowValid && tmpSelectRows.push(row);
        }
        this.selectedRows = tmpSelectRows;
    };

    componentWillReceiveProps(nextProps: PropStruct) {
        //只有存在勾选框的情况下才会存在下面这些问题
        let { checkType, isCrossPageCheck, clearSelectRows } = nextProps;
        if (!checkType) {
            return;
        }
        if (clearSelectRows) {
            this.selectedRows = [];
            this.excludeRows = [];
            this.isSelectAll = false;
            this.setState({ selectRowKeys: [] });
            return;
        }
        //如果是跨页全选
        if (isCrossPageCheck && this.isSelectAll) {
            let dataFilter = nextProps.dataList.filter((data) => {
                return this.excludeRows.findIndex((item) => { return item.key == data.key }) == -1;
            });
            this.selectedRows = dataFilter;
            let selectRowKeys = this.getSelectedRowKeys();
            this.setState({ selectRowKeys });
            return;
        }
        //将外部勾选行的key设置进来
        let { selectRowKeys, dataList } = nextProps;
        if (selectRowKeys) {
            //跨页勾选涉及到保留每一页的勾选痕迹，因此不能将原来保存的数据用过滤后的数据覆盖
            //其它情况下，如果selectRowKeys有值,需要根据根据勾选的key,查找勾选行数据做选中行数据设置
            if (!isCrossPageCheck) {
                this.selectedRows = this.getSelectRows(selectRowKeys, dataList);
            } else {
                let curSelectRows = this.getSelectRows(selectRowKeys, dataList);
                this.addMakeUpRows(curSelectRows);
                this.deleteUselessRows(selectRowKeys);
                //如果有新的补充勾选行，则需要调用onselect函数，保证外面能够获取到正常的selectRows
                // newRows && newRows.length > 0 && onSelect && onSelect(true, this.selectedRows, [], null);
            }
            this.setState({ selectRowKeys });
        } else {
            if (!isCrossPageCheck && this.isDataChanged(this.props, nextProps)) {
                this.selectedRows = [];
                this.setState({ selectRowKeys: [] });
            }
        }
    }
    //列信息处理，兼容一些特殊字段
    getColumns = () => {
        let { sortField, sortOrder } = this.props;
        //防止引用污染，这里做列拷贝，防止函数丢失，做属性逐个拷贝
        let cloneCols: Array<any> = [];
        for (let column of this.props.columns) {
            let cloneCol: any = {};
            let col: any = column;
            for (let key of Object.keys(col)) {
                cloneCol[key] = col[key];
            }
            cloneCols.push(cloneCol);
        }
        for (let column of cloneCols) {
            //code字段的优先级高于dataIndex
            //code字段的优先级高于key
            if (column.code) {
                column.dataIndex = column.code;
                column.key = column.code;
            }
            //name字段的优先级高于title
            if (column.name) {
                column.title = column.name;
            }
            column.sortOrder = false;
            if (column.code == sortField) {
                if (sortOrder == SortStatusCode.asc) {
                    column.sortOrder = SortStatusCode.ascend;
                }
                if (sortOrder == SortStatusCode.desc) {
                    column.sortOrder = SortStatusCode.descend;
                }
            }
        }
        return cloneCols;
    };

    //表格过滤或排序变化事件
    preSortFiled = "";
    onTableChange = (pagination: PaginationConfig, filter: any, sorter: any) => {
        if (!sorter.field) {
            this.props.onColSort && this.props.onColSort(this.preSortFiled, SortStatus.ascend.alias);
            return;
        }
        if (sorter.order == SortStatusCode.ascend) {
            if (sorter.column.sortReverse && sorter.field != this.preSortFiled) {
                this.props.onColSort && this.props.onColSort(sorter.field, SortStatus.descend.alias);
            } else {
                this.props.onColSort && this.props.onColSort(sorter.field, SortStatus.ascend.alias);
            }
        }
        if (sorter.order == SortStatusCode.descend) {
            if (sorter.column.sortReverse && sorter.field != this.preSortFiled) {
                this.props.onColSort && this.props.onColSort(sorter.field, SortStatus.ascend.alias);
            } else {
                this.props.onColSort && this.props.onColSort(sorter.field, SortStatus.descend.alias);
            }
        }
        this.preSortFiled = sorter.field;
    };

    //控制全选勾选框的状态
    componentDidUpdate() {
        let { checkType, hideCheckAll, isCrossPageCheck } = this.props;
        if (checkType != "checkbox" || hideCheckAll || !isCrossPageCheck) {
            return;
        }
        if (this.isSelectAll && this.excludeRows.length > 0) {
            let domList = document.querySelectorAll(".ant-table-thead .ant-table-selection-column .ant-checkbox");
            for (let dom of domList) {
                dom.setAttribute("class", "ant-checkbox ant-checkbox-indeterminate");
            }
        }
    }

    render() {
        let { dataList, hideCheckAll, className } = this.props;
        this.setRowSelection();
        let columns = this.getColumns();
        return <div className={`lwTable ${hideCheckAll ? "hideHeaderCheckBox" : ""}`}>
            <Table columns={columns} dataSource={dataList} rowClassName={this.setRowClassName} pagination={false}
                rowSelection={this.rowSelection} className={className} onChange={this.onTableChange} />
            {this.getPagination()}
        </div>
    }
}
export {
    SortStatus,
}
