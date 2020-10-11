import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css';
import { initStore } from '@lwRedux/store/index';
import { loadGlobalVar } from '../../static/common/global';
import AppRouter from './views/router';
import './index.less';

let store = initStore();
//加载全局变量
loadGlobalVar();
render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
            <AppRouter />
        </ConfigProvider>
    </Provider>,
    document.getElementById('App')
);
