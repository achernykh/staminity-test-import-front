[{
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
  }],
  "metrics" : [
		["1s", 190],
		["2s", 189],
		["5s", 186],
		["10s", 185],
		["20s", 183],
		["60s", 180],
		["2min", 175],
		["5min", 173],
		["10min", 172],
		["20min", 171]
  ]
}, {
  "series" : [{
    "label" : "Пики",
    "xAxis" : true,
    "tooltipType" : "label",
    "legend": false,
    "currentPositionLine": true,
    "idx" : 0,
    "measureSource" : "...StartDate....",
    "measureName" : "peaks"
  }],
  "measures" : [{
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
    "gradient": [{"offset": "0%","color": "rgba(0, 0, 0, 0.2)"},
				 {"offset": "100%","color": "rgba(255, 0, 0, 0.8)" }],
    "markerColor": "rgba(255, 0, 0, 0.8)",
    "idx" : 1,
    "measureName" : "heartRate"
  }],
  "metrics" : [
		["1s", 195],
		["2s", 194],
		["5s", 192],
		["10s", 192],
		["20s", 190],
		["60s", 190],
		["2min", 188],
		["5min", 184],
		["10min", 183],
		["20min", 182],
		["30min", 180],
		["40min", 179],
		["1hour", 178]
  ]
}
]
