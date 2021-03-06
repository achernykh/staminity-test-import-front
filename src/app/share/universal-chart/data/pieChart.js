export const chart_example_09 = {
    "options": {
        "legend": {
            "vertical-align": "bottom",
            "horizontal-align": "right",
            "type": "row"
        }
    },
    "series" : [{
        "label" : "Месяцы",
        "unit" : "",
        "xAxis" : true,
        "tooltipType" : "label",
        "legend": true,
        "idx" : 0,
        "fillColor": "rgba(255, 0, 0, 0.5)",
        "measureName" : "month",
        "valueType" : "value",
        "groupBy" : "month",
        "groupByIntervalLength" : 1
    }],
    "measures" : [{
        "label" : "Калории",
        "unit" : "кКал",
        "chartType" : "pie",
        "stacked" : false,
        "cumulative": false,
        "smoothSettings" : "curveMonotoneX",
        "tooltipType" : "color",
        "legend": false,
        "visible" : true,
        "avgValueLine": true,
        "scaleVisible": true,
        "calculateTotals": "",
        "lineColor": "steelblue",
        "lineStyle": "dashed",
        "fillType": "solid",
        "fillColor": "rgba(255, 0, 0, 0.5)",
        "markerColor": "#5677fc",
        "avgValueLineColor": "red",
        "avgValueLineStyle": "dotted",
        "idx" : 1,
        "measureName" : "calories",
        "measureSource" : "..tbd...",
        "valueType" : "value",
        "aggMethod" : "sum"
    }],
    "metrics" : [
        ["Иванов Василий", 20],
        ["Петров Сергей", 10],
        ["Сидоров Петр", 17],
        ["Васечкин Иван", 35],
        ["Друзь Александр", 21],
        ["Поташов Максим", 27],
        ["Бурда Борис", 14],
        ["Блинов Алексей", 31]
    ]
};
