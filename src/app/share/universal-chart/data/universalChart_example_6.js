[{
    "options": {
        "legend": {
            "vertical-align": "top",
            "horizontal-align": "right"
        },
        "tooltip": {
            "combined": true
        },
        "currentPositionLine": {
            "enabled": true,
            "color": "red",
            "style": "dashed"
        }
    },
    "series" : [{
        "label" : "Круги",
        "xAxis" : true,
        "tooltipType" : "label",
        "tooltipLabel" : "Круг",
        "legend": false,
        "idx" : 0,
        "measureName" : "laps"
    }],
    "measures" : [{
        "id": 0,
        "label" : "Мощность",
        "unit" : "вт",
        "chartType" : "bar",
        "cumulative": true,
        "tooltipType" : "icon",
        "legend": true,
        "lineColor": "#633456",
        "lineStyle": "solid",
        "fillType": "solid",
        "fillColor": "red",
        "markerColor": "red",
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
        "markerColor": "green",
        "idx" : 2,
        "measureName" : "heartRate"
    }],
    "metrics" : [
        [1, 210, 0],
        [2, 140, 40],
        [3, 240, 20],
        [4, 150, 0]
    ]
}, {
    "options": {
        "legend": {
            "vertical-align": "top",
            "horizontal-align": "right"
        },
        "tooltip": {
            "combined": true
        },
        "currentPositionLine": {
            "enabled": true,
            "color": "red",
            "style": "dashed"
        }
    },
    "series" : [{
        "label" : "Круги",
        "xAxis" : true,
        "tooltipType" : "label",
        "tooltipLabel" : "Круг",
        "legend": false,
        "idx" : 0,
        "measureName" : "laps"
    }],
    "measures" : [{
        "id": 2,
        "label" : "Скорость",
        "unit" : "км/ч",
        "chartType" : "bar",
        "tooltipType" : "icon",
        "legend": true,
        "lineColor": "#FF9999",
        "lineStyle": "dotted",
        "fillType": "solid",
        "fillColor": "blue",
        "markerColor": "blue",
        "idx" : 1,
        "measureName" : "speed"
    }],
    "metrics" : [
        [1, 0],
        [2, 0],
        [3, 480],
        [4, 310]
    ]
}]
