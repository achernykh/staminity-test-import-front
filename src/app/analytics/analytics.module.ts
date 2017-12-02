import {module} from "angular";
import AnalyticsChartFilterComponent from "./analytics-chart-filter/analytics-chart-filter.component";
import AnalyticsChartSettingsComponent from "./analytics-chart-settings/analytics-chart-settings.component";
import AnalyticsChartComponent from "./analytics-chart/analytics-chart.component";
import AnalyticsManagementPanelComponent from "./analytics-management-panel/analytics-management-panel.component";
import AnalyticsComponent from "./analytics.component";
import configure from "./analytics.config";
import {DefaultAnalyticsSettings} from "./analytics.default";

const Analytics = module("staminity.analytics", [])
    .component("analytics", AnalyticsComponent)
    .component("analyticsManagementPanel", AnalyticsManagementPanelComponent)
    .component("analyticsChart", AnalyticsChartComponent)
    .component("analyticsChartFilter", AnalyticsChartFilterComponent)
    .component("analyticsChartSettings", AnalyticsChartSettingsComponent)
    .constant("analyticsDefaultSettings", DefaultAnalyticsSettings)
    .config(configure)
    .name;

export default Analytics;
