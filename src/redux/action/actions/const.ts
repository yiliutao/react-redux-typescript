interface ActStruct {
    code: string,               //请求标识符
    url: string,                //请求的url
    reqMode?: string,           //本地请求还是网络请求，默认为网络请求
    showSuccessMsg?: boolean,   //是否显示成功信息
    successMsg?: string,        //成功信息
    showErrorMsg?: boolean,     //是否显示错误信息
    errorMsg?: string,          //错误信息
    isStatical?: boolean,       //是否为全局统计请求，默认为全局统计请求
}

export {
    ActStruct,
}