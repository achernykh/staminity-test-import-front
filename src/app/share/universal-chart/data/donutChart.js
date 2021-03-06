export const chart_example_08 = {
    "options": {
        "legend": {
            "vertical-align": "top",
            "horizontal-align": "left",
            "type": "row"
        },
        "palette": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f"]
    },
    "series" : [{
        "label" : "Месяцы",
        "unit" : "",
        "xAxis" : true,
        "tooltipType" : "label",
        "tooltipLabel": "Знаток",
        "legend": true,
        "idx" : 0,
        "colorPalette": true,
        "measureName" : "month",
        "valueType" : "value",
        "groupBy" : "month",
        "groupByIntervalLength" : 1
    }],
    "measures" : [{
        "label" : "Калории",
        "unit" : "кКал",
        "chartType" : "donut",
        "tooltipType" : "color",
        "legend": false,
        "colorPalette": true,
        "markerColor": "#5677fc",
        "idx" : 1,
        "measureName" : "calories"
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