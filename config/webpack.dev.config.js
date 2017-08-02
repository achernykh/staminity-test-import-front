const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;

console.log('env', process.env.HOST, process.env.PORT);

module.exports = {
    output: {
        // publicPath: 'http://localhost:8080/',
        filename: 'assets/js/[name].js',
        chunkFilename: 'assets/js/[name].js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap!sass-loader' })
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
            },
            {
                test: /\.jpe?g$|\.ico$|\.gif$|\.png$|\.svg$/,
                loader: 'file-loader?name=assets/images/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({ filename: "assets/css/[name].css", allChunks: false }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'assets/js/[name].js' })
    ],
    devServer: {
        host: process.env.HOST || '0.0.0.0',
        port: +process.env.PORT || 8080,
        contentBase: './src',
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