import axios from 'axios';
import { message } from 'antd';
import { getActByCode } from '../../redux/action/actions';
import { ReqStatus, ReqStruct, RspStruct } from '../biz/bizCommon';

//创建axios请求实例 
let axiosInst = axios.create({
    timeout: 5 * 60 * 1000,
    withCredentials: true,
    headers: { "Content-Type": "application/json; charset=UTF-8" }
});

//解析后台返回的数据
function parseRsp(type: string, rsp: any) {
    let result: RspStruct = { type: type, status: ReqStatus.Success };
    //能够整除1000为后台正常返回，其他均为异常
    if (rsp.returnCode && rsp.returnCode % 1000 === 0) {
        result.status = ReqStatus.Success;
    } else {
        result.status = ReqStatus.Failed;
    }
    result.data = rsp.data || rsp.items;
    result.items = rsp.items || [];
    result.rspDesc = rsp.returnDesc;
    result.rspCode = rsp.returnCode;
    return result;
}
//请求发送
function ajax(request: ReqStruct) {
    let {
        params = {}, type = "", actModule = "", onSuccess = null, onFailed = null,
        onProcess = null, isForm = false, showProcess = false, method = "POST"
    } = request;
    if (!type) {
        console.log("传入非法的操作行为！");
        return;
    }
    let actInfo: any = getActByCode(type, actModule);
    //请求内容
    let ajaxReq: any = {
        data: params,
        url: "/api" + actInfo.url,
        method: method || "POST",
    };
    //表单提交数据处理
    if (isForm) {
        ajaxReq.headers = { "Content-Type": "multipart/form-data" };
        let formData = new FormData();
        for (let key in params) {
            formData.append(key, params[key])
        }
        ajaxReq.data = formData;
    }
    //如果要显示请求过程
    if (showProcess) {
        ajaxReq["onDownloadProgress"] = (e: any) => {
            if (!e.currentTarget || !e.currentTarget.response) {
                return;
            }
            let result: RspStruct = { type: type, data: e.currentTarget.response, status: ReqStatus.Success };
            onProcess && onProcess(result);
        }
    }
    //返回时一定要先调用回调函数，在调用对应的正常或者异常回调函数
    axiosInst(ajaxReq).then((rsp: any) => {
        //返回错误码是否要登出
        if (rsp.data.returnCode == 601002) {
            let hash = location.hash;
            if (hash != "#/login") {
                location.hash = "#/login";
            }
            return;
        }
        let result = parseRsp(type, rsp.data);
        if (result.status == ReqStatus.Success) {
            onSuccess && onSuccess(result);
            return;
        }
        onFailed && onFailed(result);
    }).catch((error: any) => {
        let result: RspStruct = { type: type, data: error, status: ReqStatus.Failed, items: [], rspCode: error.response && error.response.status || 0, rspDesc: /*JSON.stringify(error)*/"请求异常" };
        onFailed && onFailed(result);
    });
}

export {
    ajax,
}