export const chart_example_06 = {
  "options": {
    "tooltip": {
      "combined": true
    },
    "legend": {
      "vertical-align": "top",
      "horizontal-align": "left"
    }
  },
  "series" : [{
    "label" : "Дни",
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
    "label" : "Средний пульс",
    "unit" : "чсс",
    "chartType" : "area",
    "stacked" : null,
    "cumulative": false,
    "smoothSettings" : "curveMonotoneX",
    "tooltipType" : "color",
    "legend": true,
    "visible" : true,
    "avgValueLine": true,
    "scaleVisible": true,
    "calculateTotals": "",
    "lineColor": "#449999",
    "lineStyle": "solid",
    "fillType": "gradient",
    "fillColor": "",
    "gradient": [
        {"offset": "0%", "color": "#449999" },
        {"offset": "100%", "color": "rgba(175, 191, 255, 0)" }
    ],
    "markerColor": "#449999",
    "avgValueLineColor": "#4499BB",
    "avgValueLineStyle": "dotted",
    "idx" : 1,
    "measureName" : "heartRate",
    "dataType": "number",
    "dateFormat": "",
    "measureSource" : "..tbd...",
    "valueType" : "value",
    "aggMethod" : "avg"
  }, {
    "label" : "Средний темп",
    "unit" : "мин/км",
    "chartType" : "line",
    "stacked" : null,
    "cumulative": false,
    "smoothSettings" : "curveMonotoneX",
    "tooltipType" : "color",
    "legend": true,
    "visible" : true,
    "avgValueLine": false,
    "scaleVisible": true,
    "calculateTotals": "",
    "lineColor": "#FF9999",
    "lineStyle": "solid",
    "fillType": "",
    "fillColor": "",
    "gradient": [{},{}],
    "markerColor": "#FF9999",
    "avgValueLineColor": "",
    "avgValueLineStyle": "",
    "idx" : 2,
    "measureName" : "pace",
    "dataType": "time",
    "dateFormat": "mm:ss",
    "measureSource" : "..tbd...",
    "valueType" : "value",
    "aggMethod" : "avg",
    "reverse": true
  }],
  "metrics" : [
    ["01-31-2017", null, null],
    ["02-01-2017", null, null],
    ["02-02-2017", null, null],
    ["02-03-2017", 166, 265],
    ["02-04-2017", null, null],
    ["02-05-2017", 166, 265],
    ["02-06-2017", 151, 267],
    ["02-07-2017", null, null],
    ["02-08-2017", null, null],
    ["02-09-2017", 140, 386],
    ["02-10-2017", 151, 379],
    ["02-11-2017", null, null],
    ["02-12-2017", null, null],
    ["02-13-2017", 163, 264],
    ["02-14-2017", null, null],
    ["02-15-2017", 169, 265],
    ["02-16-2017", 164, 260],
    ["02-17-2017", 166, 253],
    ["02-18-2017", null, null],
    ["02-19-2017", 157, 270],
    ["02-20-2017", null, null],
    ["02-21-2017", null, null],
    ["02-22-2017", 147, 376],
    ["02-23-2017", 150, 253],
    ["02-24-2017", 145, 298],
    ["02-25-2017", null, null],
    ["02-26-2017", 142, 368],
    ["02-27-2017", null, null],
    ["02-28-2017", null, null],
    ["03-01-2017", 150, 365],
    ["03-02-2017", 150, 266],
    ["03-03-2017", null, null],
    ["03-04-2017", 147, 302],
    ["03-05-2017", 155, 280],
    ["03-06-2017", 155, 375],
    ["03-07-2017", null, null],
    ["03-08-2017", 160, 252],
    ["03-09-2017", null, null],
    ["03-10-2017", null, null],
    ["03-11-2017", 159, 342],
    ["03-12-2017", null, null],
    ["03-13-2017", 169, 260],
    ["03-14-2017", null, null],
    ["03-15-2017", 159, 357],
    ["03-16-2017", 143, 392],
    ["03-17-2017", 146, 336],
    ["03-18-2017", 163, 273],
    ["03-19-2017", null, null],
    ["03-20-2017", 159, 351],
    ["03-21-2017", 169, 373],
    ["03-22-2017", null, null],
    ["03-23-2017", null, null],
    ["03-24-2017", null, null],
    ["03-25-2017", 148, 350],
    ["03-26-2017", 148, 353],
    ["03-27-2017", 152, 338],
    ["03-28-2017", 165, 265],
    ["03-29-2017", null, null],
    ["03-30-2017", 141, 323],
    ["03-31-2017", 147, 299],
    ["04-01-2017", 148, 270],
    ["04-02-2017", null, null],
    ["04-03-2017", 153, 279],
    ["04-04-2017", null, null],
    ["04-05-2017", null, null],
    ["04-06-2017", 157, 311],
    ["04-07-2017", null, null],
    ["04-08-2017", 140, 358],
    ["04-09-2017", null, null],
    ["04-10-2017", null, null],
    ["04-11-2017", null, null],
    ["04-12-2017", null, null],
    ["04-13-2017", 142, 287],
    ["04-14-2017", null, null],
    ["04-15-2017", null, null],
    ["04-16-2017", 143, 375],
    ["04-17-2017", 146, 303],
    ["04-18-2017", null, null],
    ["04-19-2017", 150, 311],
    ["04-20-2017", null, null],
    ["04-21-2017", 156, 331],
    ["04-22-2017", 165, 255],
    ["04-23-2017", 143, 375],
    ["04-24-2017", null, null],
    ["04-25-2017", 141, 281],
    ["04-26-2017", null, null],
    ["04-27-2017", 159, 368],
    ["04-28-2017", 164, 264],
    ["04-29-2017", 167, 292],
    ["04-30-2017", 167, 271],
    ["05-01-2017", 156, 288],
    ["05-02-2017", 148, 323],
    ["05-03-2017", null, null],
    ["05-04-2017", 167, 257],
    ["05-05-2017", null, null],
    ["05-06-2017", 160, 342],
    ["05-07-2017", null, null],
    ["05-08-2017", null, null],
    ["05-09-2017", 144, 327],
    ["05-10-2017", 144, 301],
    ["05-11-2017", 169, 397],
    ["05-12-2017", null, null],
    ["05-13-2017", 145, 283],
    ["05-14-2017", 165, 340],
    ["05-15-2017", null, null],
    ["05-16-2017", 145, 293],
    ["05-17-2017", null, null],
    ["05-18-2017", null, null],
    ["05-19-2017", 159, 394],
    ["05-20-2017", 142, 370],
    ["05-21-2017", 166, 338],
    ["05-22-2017", null, null],
    ["05-23-2017", null, null],
    ["05-24-2017", 141, 341],
    ["05-25-2017", 141, 370],
    ["05-26-2017", null, null],
    ["05-27-2017", null, null],
    ["05-28-2017", null, null],
    ["05-29-2017", null, null],
    ["05-30-2017", null, null],
    ["05-31-2017", null, null],
    ["06-01-2017", 144, 394],
    ["06-02-2017", 161, 376],
    ["06-03-2017", 166, 299],
    ["06-04-2017", null, null],
    ["06-05-2017", 146, 400],
    ["06-06-2017", 162, 377],
    ["06-07-2017", null, null],
    ["06-08-2017", null, null],
    ["06-09-2017", null, null],
    ["06-10-2017", null, null],
    ["06-11-2017", 155, 383],
    ["06-12-2017", 151, 313],
    ["06-13-2017", null, null],
    ["06-14-2017", 146, 270],
    ["06-15-2017", null, null],
    ["06-16-2017", null, null],
    ["06-17-2017", null, null],
    ["06-18-2017", null, null],
    ["06-19-2017", null, null],
    ["06-20-2017", null, null],
    ["06-21-2017", 170, 377],
    ["06-22-2017", null, null],
    ["06-23-2017", 163, 257],
    ["06-24-2017", 143, 380],
    ["06-25-2017", 153, 382],
    ["06-26-2017", 162, 256],
    ["06-27-2017", 157, 316],
    ["06-28-2017", null, null],
    ["06-29-2017", 157, 327],
    ["06-30-2017", 142, 262],
    ["07-01-2017", null, null],
    ["07-02-2017", 157, 391],
    ["07-03-2017", 144, 328],
    ["07-04-2017", null, null],
    ["07-05-2017", 141, 325],
    ["07-06-2017", 160, 261],
    ["07-07-2017", null, null],
    ["07-08-2017", 142, 325],
    ["07-09-2017", 146, 319],
    ["07-10-2017", null, null],
    ["07-11-2017", null, null],
    ["07-12-2017", null, null],
    ["07-13-2017", 165, 338],
    ["07-14-2017", 140, 284],
    ["07-15-2017", 151, 348],
    ["07-16-2017", null, null],
    ["07-17-2017", null, null],
    ["07-18-2017", 144, 258],
    ["07-19-2017", null, null],
    ["07-20-2017", 158, 347],
    ["07-21-2017", 163, 368],
    ["07-22-2017", 163, 283],
    ["07-23-2017", 143, 306],
    ["07-24-2017", 162, 292],
    ["07-25-2017", null, null],
    ["07-26-2017", 168, 282],
    ["07-27-2017", 153, 310],
    ["07-28-2017", null, null],
    ["07-29-2017", 151, 251],
    ["07-30-2017", null, null]
  ]
};
