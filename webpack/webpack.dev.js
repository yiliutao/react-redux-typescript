/**开发环境webpack配置 */
const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let finalCfg = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname + "/../", "build"),
        hot: true,
        compress: false,
        host: '127.0.0.1',
        port: 8090,
        open: true,
        publicPath: "/",
        inline: true, //开启页面自动刷新
        progress: true, //显示打包的进度
        proxy: {
            "/api": {
                target: "",
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': '/api'
                }
            }

        },
        index: "index.html"
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: "css-loader" },
                    { loader: "less-loader" }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/pages/main/index.html",
            filename: 'index.html',
            inject: true,
            hash: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
    ]
});
module.exports = finalCfg;