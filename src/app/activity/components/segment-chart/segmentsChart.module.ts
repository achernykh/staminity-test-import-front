import { module } from 'angular';
import segmentsChartSettings from './settings/settings.default';
import segmentsChart from './segmentsChart.component';

const SegmentsChart = module('app.segments', [])
    .constant('chartSettings', segmentsChartSettings)
    .component('segmentsChart', segmentsChart)
    .name;

export default SegmentsChart;