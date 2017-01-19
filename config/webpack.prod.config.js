const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const fileName = "[name].[chunkhash]";
const hostEndPoint = {
    dist: "https://george3447.github.io/angular-webpack-material-lazyload-typescript-starter-template/",
    distLocal: "http://localhost:75/",
    dev1: "http://dev1.staminity.com"
};

const contentBase = {
    dist: './dist',
    distLocal: './distLocal',
    dev1: './dev1'
};

var cwd = process.cwd();
var ENV = process.env.npm_lifecycle_event;
var outputPath = path.join(cwd, '/', ENV);

module.exports = {
    output: {
        path: outputPath,
        publicPath: hostEndPoint[ENV],
        filename: `assets/js/${fileName}.js`,
        chunkFilename: `assets/js/${fileName}.js`
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader!sass-loader' })
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css-loader')
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$/,
                loader: [`url-loader`,`file-loader?name=assets/images/[name].[hash].[ext]`]
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin([ENV], { root: cwd }),
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true
                },
                sassLoader: {},
                context: '',
                resolve: {}
            }
        }),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin(`assets/css/${fileName}.css`),
        new webpack.optimize.CommonsChunkPlugin({
            names: ["vendor", "manifest"]
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    devServer: {
        contentBase: contentBase[ENV],
        stats: 'minimal',
        /*stats: {
         colors: true,
         modules: false,
         cached: false,
         chunk: false
         },*/
        historyApiFallback: true
    }
};