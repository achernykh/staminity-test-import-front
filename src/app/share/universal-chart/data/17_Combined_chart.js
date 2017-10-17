{
    "options": {
        "tooltip": {
            "combined": true
        },
        "currentPositionLine": {
            "enabled": true
        },
        "legend": {
            "vertical-align": "top",
            "horizontal-align": "right",
            "type": "row"
        }
    },
    "series" : [{
        "label" : "Месяцы",
        "scaleLabel": "Месячишки (ось)",
        "xAxis" : false,
        "tooltipType" : "label",
        "tooltipLabel" : "Месяц",
        "legend": false,
        "fillColor": "red",
        "idx" : 0,
        "measureName" : "month"
    }],
    "measures" : [{
        "label" : "Калории",
        "scaleLabel": "Калории (ось)",
        "unit" : "кКал",
        "chartType" : "dot",
        "tooltipType" : "color",
        "legend": true,
        "fillType": "solid",
        "fillColor": "rgba(0, 255, 0, 0.5)",
        "markerColor": "red",
        "idx" : 1,
        "measureName" : "calories"
    }, {
        "label" : "Время",
        "scaleLabel": "Время (ось)",
        "unit" : "час",
        "chartType" : "line",
        "tooltipType" : "color",
        "legend": true,
        "lineColor": "steelblue",
        "lineStyle": "dashed",
        "lineWidth": 2,
        "fillType": "solid",
        "fillColor": "rgba(255, 0, 0, 0.5)",
        "markerColor": "blue",
        "idx" : 2,
        "measureName" : "time",
        "dataType": "time",
        "dateFormat": "HH:mm:ss",
        "minValue": 0
    }, {
        "label" : "Темп",
        "scaleLabel": "Темп (ось)",
        "unit" : "мин/км",
        "chartType" : "area",
        "tooltipType" : "color",
        "legend": true,
        "fillType": "gradient",
        "fillColor": "orange",
        "gradient": [{
            "offset": "0%",
            "color": "rgba(0, 102, 204, 0.8)"
        }, {
            "offset": "50%",
            "color": "rgba(0, 202, 204, 0.2)"
        }],
        "markerColor": "green",
        "idx" : 3,
        "measureName" : "speed",
        "dataType": "time",
        "dateFormat": "mm:ss",
        "aggMethod" : "sum",
        "reverse": true,
        "minValue": 0
    }, {
        "label" : "Мощность",
        "scaleLabel": "Калории (ось)",
        "unit" : "Вт",
        "chartType" : "bar",
        "tooltipType" : "color",
        "legend": true,
        "avgValueLine": true,
        "fillType": "solid",
        "fillColor": "grey",
        "markerColor": "grey",
        "avgValueLineColor": "grey",
        "avgValueLineStyle": "dashed",
        "idx" : 4,
        "measureName" : "power"
    }, {
        "label" : "Расстояние",
        "scaleLabel": "Расстояние (ось)",
        "unit" : "км",
        "chartType" : "bar",
        "tooltipType" : "color",
        "legend": true,
        "fillType": "solid",
        "fillColor": "rgba(0, 0, 255, 0.2)",
        "markerColor": "orange",
        "avgValueLineColor": "steelblue",
        "avgValueLineStyle": "dotted",
        "idx" : 5,
        "measureName" : "distance"
    }],
    "metrics" : [
        ["31-01-2017", 2000, 12100, 366, 160,  18.3],
        ["01-02-2017", 1000, 22400, 325, 187, 27.2],
        ["02-02-2017", 1700, 10700, 340,  190,  18.38],
        ["03-02-2017", 3500, 9900,  400,  214,  12.14],
        ["04-02-2017", 2100, 30100, 300, 176,  17],
        ["05-02-2017", 2700, 12800, 312,  160,  19],
        ["06-02-2017", 1400, 24000, 387, 150,  21],
        ["07-02-2017", 3100, 20300, 415, 152,  16]
    ]
}
