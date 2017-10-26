const webpack = require('webpack');
const chalk = require('chalk');
const moment = require('moment');

const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;

module.exports = {

    entry: {
        vendor: [
            'angular',
            'angular-aria',
            'angular-animate',
            'angular-messages',
            'angular-sanitize',
            'angular-material',
            'angular-material/angular-material.scss',
            'angular-translate',
            'moment',
            'moment-timezone/builds/moment-timezone-with-data',
            'angular-scroll',
            'satellizer',
            'rxjs',
            'angular-material-data-table',
            'angular-material-data-table/dist/md-data-table.css',
            'smdatetimerangepicker',
            'smdatetimerangepicker/src/picker.css',
            'angular-simple-logger', // какая-то хрень для ui-leaflet
            'leaflet',
            'leaflet/dist/leaflet.css',
            'ui-leaflet',
            'd3',
            'angular-dynamic-locale',
            'angularjs-toaster',
            'angularjs-toaster/toaster.css',
            'animate.css/animate.css',
            //'angular-read-more'
            'animate.css',
            'angular-carousel',
            'angular-carousel/dist/angular-carousel.css',
            'angular-touch', // not supported when use angular-material, but need for angular-carousel
            'angular-drag-and-drop-lists',
            'angular-read-more',
            'angularjs-scroll-glue',
            'drag-drop-webkit-mobile',
            'angular-ui-router',
            'lodash'
            //'unichart/dist/uchart.min.js'
        ],
        // вход для приложения
        app: './src/app/app.module.ts'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader?cacheDirectory=true',
                exclude: [/node_modules/,/bower_components/],
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.ts$/,
                enforce: "pre",
                loader: "tslint-loader"
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/node_modules/,/bower_components/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader?interpolate'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=assets/fonts/[name].[ext]'
            }
        ]
    },

    plugins: [

        new webpack.LoaderOptionsPlugin({
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
        new webpack.DefinePlugin({
            __ENV: JSON.stringify(ENV)
        }),
        new ProgressBarPlugin({
            format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds) on ' + moment().format('MMMM Do YYYY, h:mm a') +
                ' ',
            clear: false
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body'
        })/*,
        new ngAnnotatePlugin({
            add: true
            // other ng-annotate options here
        })*/
    ],
    resolve: {
        extensions: [".webpack.js", ".web.js", '.ts', '.tsx', '.js', '.jsx', '.json']
    },
    performance: {
        hints: false
    }
};