import * as React from "react";
import { Select, Icon } from "antd";
import './lwDatePicker.less';
const Option = Select.Option;

interface PropsStruct {
    renderExtraHeader?: () => JSX.Element | null;               //绘制额外的日历头
    renderExtraFooter?: () => JSX.Element | null;               //绘制额外的日历尾
    renderDate?: (date: PanelDayStruct) => JSX.Element | null;  //绘制日历单元格
    className?: string;                                         //外部传入的日历样式
    onSelectDate?: (date: PanelDayStruct) => void;              //日历单元格点击事件
    onChange?: (year: string, month: string) => void;
    initYear?: number;                                          //初始年份
    initMonth?: number;                                         //初始月份
    isSignWeekends?: boolean;                                   //是否标记周六周日
}
interface PanelDayStruct {
    date: number;          //日期
    dateStr: string;
    month: number;         //月份
    monthStr: string;
    year: number;          //年
    yearStr: string;
    dayOfWeek?: string | number;    //日期是周几
    isOldYear?: boolean;            //是否属于之前的年份
    isInOtherMonth?: boolean;       //是否属于其它月份
    isPastDate?: boolean;           //是否是当前日期前的某一天
    isWeekends?: boolean;           //是否是周六周日
    isToday?: boolean;              //是否是今天
}
interface StateStruct {
    selectYear: number;                          //当前面板选中年份
    selectMonth: number;                         //当前面板选中月份
}
export default class LwDatePicker extends React.Component<PropsStruct, StateStruct> {
    //初始化当前年份
    private currentYear = new Date().getFullYear();
    //初始化当前月份
    private currentMonth = new Date().getMonth();
    //初始化当前日
    private currentDate = new Date().getDate();
    //每个月中的天数
    private MonthDays: Array<number> = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    //每个月面板中的空格数
    private MonthSpaceNumMap: any = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };

    //构造函数初始化数据
    constructor(props: PropsStruct) {
        super(props);
        let date = new Date();
        let year = props.initYear ? props.initYear : date.getFullYear();
        let month = props.initMonth ? props.initMonth - 1 : date.getMonth();
        this.state = { selectYear: year, selectMonth: month };
    }

    //年操作事件
    onReduceYear = () => {
        let { selectYear, selectMonth } = this.state;
        selectYear = selectYear - 1;
        this.setState({ selectYear });
        this.props.onChange && this.props.onChange(selectYear.toString(), (selectMonth + 1).toString());
    };
    onAddYear = () => {
        let { selectYear, selectMonth } = this.state;
        selectYear = selectYear + 1;
        this.setState({ selectYear });
        this.props.onChange && this.props.onChange(selectYear.toString(), (selectMonth + 1).toString());
    };
    //月操作事件
    onReduceMonth = () => {
        let { selectMonth, selectYear } = this.state;
        if (selectMonth == 0) {
            selectYear = selectYear - 1;
            selectMonth = 11;
        } else {
            selectMonth = selectMonth - 1;
        }
        this.setState({ selectMonth, selectYear });
        this.props.onChange && this.props.onChange(selectYear.toString(), (selectMonth + 1).toString());
    };
    onAddMonth = () => {
        let { selectMonth, selectYear } = this.state;
        if (selectMonth == 11) {
            selectYear = selectYear + 1;
            selectMonth = 0;
        } else {
            selectMonth = selectMonth + 1;
        }
        this.setState({ selectMonth, selectYear });
        this.props.onChange && this.props.onChange(selectYear.toString(), (selectMonth + 1).toString());
    };
    //日历头部
    renderHeader = () => {
        let { selectYear, selectMonth } = this.state;
        return <div className="lwDateHeader">
            <Icon type="double-left" onClick={this.onReduceYear} />
            <Icon type="left" onClick={this.onReduceMonth} />
            <span>{`${selectYear}年${selectMonth + 1}月`}</span>
            <Icon type="right" onClick={this.onAddMonth} />
            <Icon type="double-right" onClick={this.onAddYear} />
        </div>;
    }

    //日历主体
    renderBody = () => {
        let { selectYear, selectMonth } = this.state;
        let panelDayList = this.getPanelDayList(selectYear, selectMonth);
        let { renderDate } = this.props;
        let dateDomList: Array<any> = [];
        for (let i = 0; i < panelDayList.length; i++) {
            //根据数组展示日历，每7天换行一次
            let clasName = "";
            if (panelDayList[i].isWeekends) {
                clasName += "weekends ";
            }
            if (panelDayList[i].isToday) {
                clasName += "today ";
            }
            if (panelDayList[i].isOldYear || panelDayList[i].isPastDate) {
                clasName += "pastDate ";
            }
            if (panelDayList[i].isInOtherMonth) {
                clasName = "otherMonthDate";
            }
            let textDom: any = <i>&nbsp;</i>;
            if (panelDayList[i]) {
                textDom = renderDate ? renderDate(panelDayList[i]) : panelDayList[i].date;
            }
            dateDomList.push(<React.Fragment key={i}>
                <span className={clasName} onClick={() => this.onPanelDayClick(panelDayList[i])}>
                    {textDom}
                </span>
                {(i + 1) % 7 === 0 ? <br /> : null}
            </React.Fragment>);
        }
        return <div className="lwDateBody">
            <div className="weekdays">
                <span>一</span>
                <span>二</span>
                <span>三</span>
                <span>四</span>
                <span>五</span>
                <span>六</span>
                <span>日</span>
            </div>
            <div className="panelDate"> {dateDomList} </div>
        </div>;
    }

    //日历核心：初始化日历方法：通过传入一个日期字符串，生成该日期当月的数据
    getPanelDayList = (year: number, month: number) => {
        //若当年为闰年，则2月为29天
        if (this.isLeapYear(year)) {
            this.MonthDays[1] = 29;
        } else {
            this.MonthDays[1] = 28;
        }
        //日历渲染逻辑，设置当前月的第一天。
        let date = new Date(year, month);
        date.setDate(1);
        //这个存的是当前月的一号前面有多少空位，得到当前月1号前的空格数
        let spaceNum = this.MonthSpaceNumMap[date.getDay().toString()];
        //初始化42个长度的一维矩阵
        let panelDayList: Array<PanelDayStruct> = [];
        for (let i = 0; i < 42; i++) {
            panelDayList.push({ date: 1, dateStr: "01", month: month, monthStr: month.toString(), year: year, yearStr: year.toString() });
        }
        //得到当月的天数
        let monthDays = this.MonthDays[month];
        //得到上月的天数
        let preMonth = month ? month - 1 : 11;
        let preMonthDays = this.MonthDays[preMonth];
        //得到下个月的天数
        let nextMonth = month == 11 ? 1 : month + 1;
        let nextMonthDays = this.MonthDays[nextMonth];
        //遍历生成当月日历
        let { isSignWeekends = true } = this.props;
        for (let i = 1; i <= monthDays; i++) {
            date.setDate(i);
            //若为0 或者 6 代表为周末，默认是非工作日
            let isWorkends = isSignWeekends && (date.getDay() === 0 || date.getDay() === 6);
            panelDayList[spaceNum + i - 1] = {
                date: i,
                dateStr: i.toString().length <= 1 ? "0" + i : i.toString(),
                month: month,
                monthStr: (month + 1).toString().length <= 1 ? "0" + (month + 1).toString() : (month + 1).toString(),
                year: year,
                yearStr: year.toString(),
                dayOfWeek: date.getDay(),
                isWeekends: isWorkends,
                isOldYear: year < this.currentYear,
                isInOtherMonth: false,
                isPastDate: (month < this.currentMonth && year === this.currentYear) || (i < this.currentDate && month === this.currentMonth && year === this.currentYear),
                isToday: i === this.currentDate && month === this.currentMonth && year === this.currentYear, //若为当前日期，则标记
            };
        }

        //填充跨月日期： 上月日期
        for (let j = spaceNum; j >= 0; j--) {
            let preDate = preMonthDays--;
            panelDayList[j - 1] = {
                date: preDate, //上月的号数
                dateStr: preDate.toString().length <= 1 ? "0" + preDate : preDate.toString(),
                month: preMonth,
                monthStr: (preMonth + 1).toString().length <= 1 ? "0" + (preMonth + 1).toString() : (preMonth + 1).toString(),
                year: year,
                yearStr: year.toString(),
                isInOtherMonth: true,
                isToday: false,
                isOldYear: year < this.currentYear,
            };
        }
        //填充跨月日期： 下月日期
        let diffDays = spaceNum + monthDays;
        for (let k = 1; k <= panelDayList.length - diffDays; k++) {
            panelDayList[diffDays + k - 1] = {
                date: k, //下月的号数
                dateStr: k.toString().length <= 1 ? "0" + k : k.toString(),
                month: nextMonth,
                monthStr: (nextMonth + 1).toString().length <= 1 ? "0" + (nextMonth + 1).toString() : (nextMonth + 1).toString(),
                year: year,
                yearStr: year.toString(),
                isInOtherMonth: true,
                isToday: false,
                isOldYear: year < this.currentYear,
            };
        }
        return panelDayList;
    }

    //日期点击事件(其它月份日期不接受点击事件)
    onPanelDayClick = (panelDay: PanelDayStruct) => {
        if (panelDay.isInOtherMonth) {
            return;
        }
        if (panelDay.isPastDate) {
            return;
        }
        if (panelDay.isOldYear) {
            return;
        }
        this.props.onSelectDate && this.props.onSelectDate(panelDay);
    }

    //工具函数：判断闰年
    isLeapYear = (year: number) => {
        //每4年一闰，百年不闰，四百年又闰
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) return true;
        return false;
    }

    render() {
        let { className, renderExtraHeader, renderExtraFooter } = this.props;
        return <div className={`lwDatePanel ${className ? className : ""}`}>
            {renderExtraHeader && renderExtraHeader()}
            {this.renderHeader()}
            {this.renderBody()}
            {renderExtraFooter && renderExtraFooter()}
        </div>;
    }
}
export {
    PanelDayStruct,
}
