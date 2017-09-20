import {module} from 'angular';
import configure from './analytics.config';
import AnalyticsComponent from "./analytics.component";
import AnalyticsManagementPanelComponent from "./analytics-management-panel/analytics-management-panel.component";
import AnalyticsChartComponent from "./analytics-chart/analytics-chart.component";
import {DefaultAnalyticsSettings} from "./analytics.default";
import AnalyticsChartFilterComponent from "./analytics-chart-filter/analytics-chart-filter.component";

const Analytics = module('staminity.dashboard', [])
    .component('analytics', AnalyticsComponent)
    .component('analyticsManagementPanel', AnalyticsManagementPanelComponent)
    .component('analyticsChart', AnalyticsChartComponent)
    .component('analyticsChartFilter', AnalyticsChartFilterComponent)
    .constant('analyticsDefaultSettings', DefaultAnalyticsSettings)
    .config(configure)
    .name;


export default Analytics;