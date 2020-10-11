const ReqMode = {
    Network: "network",     //网络请求
    Local: "local",         //本地请求
};

//请求状态
const ReqStatus = {
    Pending: "Pending",     //正在发送
    Success: "Success",     //请求成功
    Failed: "Failed",       //请求失败
};

//定义回调函数
interface CallbackFunc {
    (rsp?: RspStruct): void;
}
//请求数据结构
interface ReqStruct {
    method?: string,                 //请求方式（POST或者GET）
    type?: string,                    //行为动作
    actModule?: string,              //属于哪一个模块，避免同一个type在不同模块中都存在的情况
    params?: any,                    //传入的参数
    onSuccess?: CallbackFunc,        //成功回调函数
    onFailed?: CallbackFunc,         //失败回调函数
    onProcess?: CallbackFunc,        //过程回调函数
    isForm?: boolean,                //是否是表单
    showProcess?: boolean,           //是否展示中间过程
}
//返回数据结构
interface RspDataStruct {
    list?: Array<any>,              //数据列表
    pageSize?: number,              //每页数据量
    pageNum?: number,               //页码
    hasNextPage?: boolean,          //是否还有下一页
    total?: number,                 //数据总量
}
interface RspStruct {
    type: string,                                                  //请求标识符
    actModule?: string,                                             //请求所属模块
    status: string,                                                //请求状态
    params?: any,                                                   //请求参数
    data?: RspDataStruct | Array<any> | string | number | null,     //后台返回数据
    rspCode?: number,                                               //返回码
    items?: Array<any>,                                             //返回数据
    rspDesc?: string,                                               //返回错误信息描述
}
interface ContextStruct {
    type: string,
    actModule?: string,
    request: ReqStruct,
    response: RspStruct,
}

const RegExp = {
    userName: /^.{1,20}$/,
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
    phone: /^1\d{10}$/,
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    groupName: /^[A-Za-z0-9\u4e00-\u9fa5]{1,64}$/,
    verifyCode: /^(?=.*[0-9]).{6}$/,
    contractNum: /^[a-zA-Z0-9\!\"\#\$\%\&\'\(\)\*\+\,\.\/\:\;\<\=\>\?\@\[\]\^\_\`\{\|\}\~\*]{1,}$/,
    buyer: /^[A-Za-z0-9\u4e00-\u9fa5]{1,30}$/,
    invoiceCode: /^[0-9]{1,12}$/,
    invoiceNumber: /^[0-9]{1,12}$/,
    pretaxAmount: /^(\d{1,12}|\d{1,9}\.\d{1,2})?$/,
    amount: /^(\d{1,12}|\d{1,9}\.\d{1,2})?$/,
    baseName: /^[A-Za-z0-9\u4e00-\u9fa5]{1,20}$/,
    baseCode: /^[A-Za-z0-9]{1,20}$/,
};
const ErrorTips = {
    userName: "格式为中文、大小写字母且不超过20字符",
    password: "长度8-16位，包含大小写字母、数字",
    phone: "格式为数字且长度为11位",
    email: "输入的邮箱格式不对",
    groupName: "格式为汉字、字母、数字且不超过64位",
    verifyCode: "验证码不正确",
    buyer: "格式为汉字、字母、数字且不可超过30字符",
    invoiceCode: "格式为数字且不可超过12字符",
    invoiceNumber: "格式为数字且不可超过12字符",
    pretaxAmount: "格式为保留两位小数且不可超过12字符",
    amount: "格式为保留两位小数且不可超过12字符",
    baseName: "格式为字母、数字、汉字且不超过20字符",
    baseCode: "格式为字母、数字且不超过20字符",
};

export {
    ReqMode,
    ReqStatus,
    ReqStruct,
    RspStruct,
    ContextStruct,
    RegExp,
    ErrorTips,
}