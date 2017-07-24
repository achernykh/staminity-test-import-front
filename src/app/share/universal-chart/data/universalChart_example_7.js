{
    "options": {
        "legend": {
            "vertical-align": "top",
            "horizontal-align": "right"
        },
        "tooltip": {
            "combined": true
        },
        "currentPositionLine": {
            "enabled": true
        }
    },
    "series" : [{
        "label" : "Круги",
        "unit" : "",
        "xAxis" : false,
        "tooltipType" : "label",
        "tooltipLabel" : "Круг",
        "legend": true,
        "idx" : 0,
        "measureSource" : "...tbd....",
        "measureName" : "laps",
        "valueType" : "value",
        "groupBy" : "day",
        "groupByIntervalLength" : 1
    }],
    "measures" : [{
        "id": 0,
        "label" : "Мощность",
        "unit" : "вт",
        "chartType" : "bar",
        "tooltipType" : "icon",
        "legend": true,
        "lineColor": "#633456",
        "lineStyle": "solid",
        "fillType": "solid",
        "fillColor": "rgba(255, 0, 0, 0.5)",
        "markerColor": "#633456",
        "idx" : 1,
        "measureName" : "power"
    }, {
        "id": 1,
        "label" : "Пульс",
        "unit" : "чсс",
        "chartType" : "bar",
        "tooltipType" : "icon",
        "legend": true,
        "lineColor": "#449999",
        "lineStyle": "solid",
        "fillType": "solid",
        "fillColor": "green",
        "markerColor": "",
        "idx" : 2,
        "measureName" : "heartRate"
    }, {
        "id": 3,
        "label" : "Скорость",
        "unit" : "км/ч",
        "chartType" : "bar",
        "tooltipType" : "icon",
        "legend": true,
        "lineColor": "#FF9999",
        "lineStyle": "dotted",
        "fillType": "solid",
        "fillColor": "blue",
        "markerColor": "#FF9999",
        "idx" : 3,
        "measureName" : "speed"
    }],
    "metrics" : [
        [1, 210, 0, 0],
        [2, 140, 40, 0],
        [3, 240, 20, 480],
        [4, 150, 0, 310]
    ]
}
