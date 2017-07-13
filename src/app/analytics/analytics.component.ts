import './analytics.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';

class AnalyticsCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.data = [{
            "options": {
                "tooltip": {
                    "combined": true
                },
                "legend": {
                    "vertical-align": "top",
                    "horizontal-align": "right"
                },
                "currentPositionLine": {
                    "enabled": true
                }
            },
            "series" : [{
                "label" : "Дни",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "icon",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "dataType": "date",
                "dateFormat": "DD.MM"
            }],
            "measures" : [{
                "id": "tl",
                "label" : "TL",
                "unit" : "",
                "chartType" : "dot",
                "tooltipType" : "color",
                "legend": true,
                "fillType": "",
                "fillColor": "rgba(255, 0, 0, 0.5)",
                "markerColor": "rgb(255, 0, 0)",
                "idx" : 1,
                "measureName" : "trainingLoad",
                "dataType": "number",
                "dateFormat": ""
            }, {
                "label" : "ATL",
                "chartType" : "dot",
                "legend": false,
                "fillColor": "lightblue",
                "markerColor": "lightblue",
                "idx" : 2,
                "measureName" : "atl"
            }, {
                "id": 1,
                "label" : "ATL",
                "chartType" : "line",
                "stacked" : null,
                "smoothSettings" : "curveMonotoneX",
                "tooltipType" : "color",
                "legend": true,
                "visible" : true,
                "lineColor": "lightblue",
                "lineStyle": "solid",
                "fillType": "none",
                "fillColor": "",
                "markerColor": "#ff3399",
                "idx" : 2,
                "measureName" : "atl"
            }, {
                "id": 2,
                "label" : "CTL",
                "chartType" : "bar",
                "tooltipType" : "color",
                "legend": true,
                "lineColor": "blue",
                "lineStyle": "solid",
                "fillType": "solid",
                "fillColor": "rgba(255, 165, 0, 0.5)",
                "markerColor": "rgb(255, 165, 0)",
                "idx" : 3,
                "measureName" : "ctl"
            }, {
                "label" : "TSB",
                "chartType" : "dot",
                "legend": false,
                "lineStyle": "solid",
                "fillType": "solid",
                "fillColor": "lightgrey",
                "idx" : 4,
                "measureName" : "TSB"
            }, {
                "id": 3,
                "label" : "TSB",
                "chartType" : "area",
                "stacked" : null,
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "color",
                "legend": true,
                "lineColor": {"color": "rgb(247, 153, 131)", "opacity": 0},
                "lineStyle": "solid",
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [
                    { "offset": "0%", "color": "rgba(247, 153, 131, 0)" },
                    { "offset": "100%", "color": "rgba(175, 191, 255, 0.5)" }
                ],
                "markerColor": "#449999",
                "idx" : 4,
                "measureName" : "TSB"
            }
            ],
            "metrics" : [
                ["07-02-2017", 92, 66, 0, -6],
                ["07-03-2017", 80, 68, 0, -8],
                ["07-04-2017", 0, 59, 9, 0],
                ["07-05-2017", 78, 62, 9, -3],
                ["07-06-2017", null, null, null, null],
                ["07-07-2017", null, null, null, null],
                ["07-08-2017", null, null, null, null],
                ["07-09-2017", 101, 67, 0, -7],
                ["07-10-2017", 0, 58, 9, 1],
                ["07-11-2017", 0, 50, 8, 8],
                ["07-12-2017", 0, 43, 7, 14],
                ["07-13-2017", 172, 60, 6, 0],
                ["07-14-2017", 68, 61, 4, -1],
                ["07-15-2017", 125, 70, 2, -8],
                ["07-16-2017", 0, 61, 1, 0]
            ]
        }, {
            "series" : [{
                "label" : "Дни",
                "unit" : "",
                "xAxis" : true,
                "tooltipType" : "icon",
                "legend": false,
                "currentPositionLine": true,
                "idx" : 0,
                "measureName" : "days",
                "dataType": "date",
                "dateFormat": "DD.MM"
            }],
            "measures" : [{
                "id": "tl",
                "label" : "TL",
                "unit" : "",
                "chartType" : "dot",
                "tooltipType" : "color",
                "legend": true,
                "fillType": "",
                "fillColor": "rgba(0, 0, 255, 0.5)",
                "idx" : 1,
                "measureName" : "trainingLoad",
                "dataType": "number",
                "dateFormat": ""
            }, {
                "id": 1,
                "label" : "ATL",
                "chartType" : "line",
                "stacked" : null,
                "smoothSettings" : "curveMonotoneX",
                "tooltipType" : "color",
                "legend": true,
                "visible" : true,
                "lineColor": "green",
                "lineStyle": "dashed",
                "fillType": "none",
                "fillColor": "",
                "markerColor": "#ff3399",
                "idx" : 2,
                "measureName" : "atl"
            }, {
                "id": 2,
                "chartType" : "bar",
                "lineColor": "red",
                "lineStyle": "dashed",
                "fillType": "solid",
                "fillColor": "rgba(255, 255, 0, 0.5)",
                "idx" : 3,
                "measureName" : "ctl"
            }, {
                "id": 3,
                "label" : "TSB",
                "chartType" : "area",
                "stacked" : null,
                "smoothSettings" : "curveCatmullRom",
                "tooltipType" : "color",
                "legend": true,
                "lineColor": {"color": "rgb(247, 153, 131)", "opacity": 0},
                "lineStyle": "solid",
                "fillType": "gradient",
                "fillColor": "",
                "gradient": [
                    { "offset": "0%", "color": "rgba(0, 0, 0, 0)" },
                    { "offset": "100%", "color": "rgba(255, 0, 0, 0.5)" }
                ],
                "markerColor": "#449999",
                "idx" : 4,
                "measureName" : "TSB"
            }
            ],
            "metrics" : [
                ["07-17-2017", 0, 53, 2, 7],
                ["07-18-2017", 63, 54, 1, 6],
                ["07-19-2017", 0, 47, 9, 12],
                ["07-20-2017", 104, 55, 2, 5],
                ["07-21-2017", 72, 57, 3, 3]
            ]
        }];
    }
}

const AnalyticsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsCtrl,
    template: require('./analytics.component.html') as string
};

export default AnalyticsComponent;