const webpack = require('webpack');

var ENV = process.env.npm_lifecycle_event;

console.log('env', process.env.HOST, process.env.PORT);

module.exports = {
    output: {
        // publicPath: 'http://localhost:8080/',
        filename: 'assets/js/[name].[hash].js',
        chunkFilename: 'assets/js/[name].[hash].js'
    },
    devtool: 'source-map',
    module: {
        rules: [
        ]
    },
    plugins: [

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