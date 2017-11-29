import { module } from "angular";
import segmentsChart from "./segmentsChart.component";
import segmentsChartSettings from "./settings/settings.default";

const SegmentsChart = module("app.segments", [])
    .constant("chartSettings", segmentsChartSettings)
    .component("segmentsChart", segmentsChart)
    .name;

export default SegmentsChart;