import {module} from "angular";
import { StateProvider } from "@uirouter/angularjs";
import AnalyticsChartFilterComponent from "./analytics-chart-filter/analytics-chart-filter.component";
import AnalyticsChartSettingsComponent from "./analytics-chart-settings/analytics-chart-settings.component";
import AnalyticsChartComponent from "./analytics-chart/analytics-chart.component";
import AnalyticsManagementPanelComponent from "./analytics-management-panel/analytics-management-panel.component";
import AnalyticsComponent from "./analytics.component";
import configure from "./analytics.config";
import {DefaultAnalyticsSettings} from "./analytics.default";
import {AnalyticsChartPmcComponent} from "./analytics-chart-pmc/analytics-chart-pmc.component";
import { analyticsPageState } from "./analytics.state";
import { translateAnalytics } from "./analytics.translate";
import { supportLng } from "../core/display.constants";
import { AnalyticsService } from "./analytics.service";
import { analyticsConfig } from "./analytics.constants";
import { AnalyticsChartDataComponent } from "./analytics-chart-data/analytics-chart-data.component";

const Analytics = module("staminity.analytics", [])
    .component("analytics", AnalyticsComponent)
    .component("stAnalytics", AnalyticsComponent)
    .component("analyticsManagementPanel", AnalyticsManagementPanelComponent)
    .component("analyticsChart", AnalyticsChartComponent)
    .component("analyticsChartFilter", AnalyticsChartFilterComponent)
    .component("analyticsChartSettings", AnalyticsChartSettingsComponent)
    .component("analyticsChartPmc", AnalyticsChartPmcComponent)
    .component('stAnalyticsChartData', AnalyticsChartDataComponent)
    .service('AnalyticsService', AnalyticsService)
    .constant("analyticsDefaultSettings", DefaultAnalyticsSettings)
    .constant('analyticsConfig', analyticsConfig)
    //.config(configure)
    .config(['$stateProvider', ($stateProvider: StateProvider) => analyticsPageState.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', $translate =>
        supportLng.map(lng => $translate.translations(lng, {analytics: translateAnalytics[lng]}))])
    .name;

export default Analytics;
