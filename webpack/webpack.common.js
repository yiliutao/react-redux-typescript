/**webpack配置公共模块 */
const path = require('path')
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}
module.exports = {
    entry: {
        index: './src/pages/main/index.tsx',
    },
    output: {
        path: path.join(__dirname + "/../", "build"),
        filename: '[name].js',
        chunkFilename: 'js/[chunkhash:8].chunk.js'
    },
    performance: {
        hints: false
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.scss', '.less'],
        alias: {
            "@public": `${process.cwd()}/public`,
            "@static": `${process.cwd()}/src/static`,
            "@pages": `${process.cwd()}/src/pages/main/views/biz`,
            "@middleware": `${process.cwd()}/src/middleware`,
            "@lwRedux": `${process.cwd()}/src/redux`,
            "@component": `${process.cwd()}/src/component`,
            "@bizRouter": `${process.cwd()}/src/static/biz/moduleAuth`,
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader?cacheDirectory=true', // 使用cache提升编译速度
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')],
                options: {
                    presets: ["env", "react", "es2015", "stage-2"],
                    plugins: [
                        ["import", { libraryName: "antd", style: "css" }]
                    ]
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                use: [{
                    loader: "url-loader?limit=8192&name=common/imgs/[hash].[ext]",
                    options: {
                        esModule: false
                    }
                }]
            },
            {
                test: /\.svg$/,
                loader: "svg-url-loader?limit=8192&name=common/imgs/[hash].[ext]"
            },
            {
                test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
                loader: "file-loader?name=common/fonts/[name].[ext]"
            },
            {
                test: /\.json$/i,
                type: 'javascript/auto',
                loader: 'json-loader',
            },
            { test: /\.(tsx|ts)?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10
                },
                default: {
                    minChunks: 2,
                    priority: 20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
        }),
    ]
}