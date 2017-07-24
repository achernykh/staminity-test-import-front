{
  "options": {
    "tooltip": {
        "combined": true
    },
    "currentPositionLine": {
        "enabled": true
    }
  },
  "series" : [{
    "label" : "Пики",
    "xAxis" : true,
    "tooltipType" : "label",
    "legend": false,
    "currentPositionLine": true,
    "idx" : 0,
    "measureName" : "peaks"
  }],
  "measures" : [{
    "id": 0,
    "label" : "Пики ЧСС за 2017 год",
    "unit" : "чсс",
    "chartType" : "area",
    "smoothSettings" : "curveCatmullRom",
    "tooltipType" : "label",
    "legend": true,
    "lineColor": "#449999",
    "lineStyle": "dotted",
    "fillType": "gradient",
    "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
				 {"offset": "100%","color": "rgba(0, 255, 0, 0.8)" }],
    "markerColor": "rgba(0, 255, 0, 0.8)",
    "idx" : 1,
    "measureName" : "heartRate"
  }, {
    "id": 1,
    "label" : "Пики ЧСС за 2016 год",
    "unit" : "чсс",
    "chartType" : "area",
    "smoothSettings" : "curveCatmullRom",
    "tooltipType" : "label",
    "legend": true,
    "lineColor": "#aa9999",
    "lineStyle": "dotted",
    "fillType": "gradient",
    "fillColor": "",
    "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
				 {"offset": "100%","color": "rgba(255, 0, 0, 0.8)" }],
    "markerColor": "rgba(255, 0, 0, 0.8)",
    "idx" : 2,
    "measureName" : "heartRate"
  }],
  "metrics" : [
		["1s", 190, 195],
		["2s", 189, 194],
		["5s", 186, 192],
		["10s", 185, 192],
		["20s", 183, 190],
		["60s", 180, 190],
		["2min", 175, 188],
		["5min", 173, 184],
		["10min", 172, 183],
		["20min", 171, 182],
    ["30min", null, 180],
    ["40min", null, 179],
    ["1hour", null, 178]
  ]
}
