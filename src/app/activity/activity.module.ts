import { module } from "angular";
import { StateProvider } from "angular-ui-router/lib/index";
import ActivityHeaderChatComponent from "./activity-header-chat/activity-header-chat.component";
import ActivityHeaderDetailsComponent from "./activity-header-details/activity-header-details.component";
import ActivityHeaderOverviewComponent from "./activity-header-overview/activity-header-overview.component";
import ActivityHeaderSplitsComponent from "./activity-header-splits/activity-header-splits.component";
import ActivityHeaderZonesComponent from "./activity-header-zones/activity-header-zones.component";
import ActivityHeaderComponent from "./activity-header/activity-header.component";
import ActivityIntervalOverviewComponent from "./activity-interval-overview/activity-interval-overview.component";
import ActivityMetricsDetailsComponent from "./activity-metrics-details/activity-metrics-details.component";
import ActivitySegmentsTableComponent from "./activity-segments-table/activity-segments-table.component";
import ActivitySegmentsComponent from "./activity-segments/activity-segments.component";
import ActivityComponent from "./activity.component";
import configure from "./activity.config";
import ActivityService from "./activity.service";
import { activityState } from "./activity.state";
import ActivityAssignmentButtonsComponent from "./components/assignment-buttons/activity-assignment-buttons.component";
import ActivityAssignmentHeaderComponent from "./components/assignment-header/activity-assignment-header.component";
import AssignmentSummaryNonStructuredComponent from "./components/assignment-summary-non-structured/assignment-summary-non-structured.component";
import AssignmentSummaryStructuredComponent from "./components/assignment-summary-structured/assignment-summary-structured.component";
import ActivityAssignmentComponent from "./components/assignment/assignment.component";
import chartComponent from "./components/measure-chart/chart.component";
import chartSettings from "./components/measure-chart/settings/settings.default";
import MeasureSplitTableComponent from "./components/measure-split-table/measure-split-table.component";
import ActivityPeaksComponent from "./components/peaks/activity-peaks.component";
import ActivityRouteComponent from "./components/route/activity-route.component";
import PlanChartComponent from "./components/segment-chart/segmentsChart.component";
import DefaultPlanChartSettings from "./components/segment-chart/settings/settings.default";
import StructuredAssignmentComponent from "./components/structured-assignment/structured-assignment.component";
import {StructuredGroupComponent} from "./components/structured-group/structured-group.component";
import StructuredIntervalComponent from "./components/structured-interval/structured-interval.component";
import ActivitySummaryInfoComponent from "./components/summary-info/summary-info.component";
import MeasureMainButtonComponent from "./measure-main-button/measure-main-button.component";
import MeasuresAvgTableComponent from "./measures-avg-table/measures-avg-table.component";

export const ActivityModule = module("staminity.activity", [])
    .service("ActivityService", ActivityService)
    .component("activity", ActivityComponent)
    .component("activityHeader", ActivityHeaderComponent)
    .component("activityHeaderOverview", ActivityHeaderOverviewComponent)
    .component("activityHeaderDetails", ActivityHeaderDetailsComponent)
    .component("activityHeaderSplits", ActivityHeaderSplitsComponent)
    .component("activityHeaderZones", ActivityHeaderZonesComponent)
    .component("activityHeaderChat", ActivityHeaderChatComponent)
    .component("activityMetricsDetails", ActivityMetricsDetailsComponent)
    .component("activitySummaryInfo", ActivitySummaryInfoComponent)
    .component("activitySegments", ActivitySegmentsComponent)
    .component("structuredInterval", StructuredIntervalComponent)
    .component("structuredAssignment", StructuredAssignmentComponent)
    .component("structuredGroup", StructuredGroupComponent)
    .component("measureMainButton", MeasureMainButtonComponent)
    .component("measuresAvgTable", MeasuresAvgTableComponent)
    .component("measureSplitTable", MeasureSplitTableComponent)
    .component("activityRoute", ActivityRouteComponent)
    .component("activityAssignment", ActivityAssignmentComponent)
    .component("activityPeaks", ActivityPeaksComponent)
    .constant("activityChartSettings", chartSettings)
    .component("activityMetricsChar", chartComponent)
    .constant("segmentChartSettings", DefaultPlanChartSettings)
    .component("activitySegmentChart", PlanChartComponent)
    .component("activitySegmentsTable", ActivitySegmentsTableComponent)
    .component("activityAssignmentButtons", ActivityAssignmentButtonsComponent)
    .component("activityAssignmentHeader", ActivityAssignmentHeaderComponent)
    .component("assignmentSummaryNonStructured", AssignmentSummaryNonStructuredComponent)
    .component("assignmentSummaryStructured", AssignmentSummaryStructuredComponent)
    .component("activityIntervalOverview", ActivityIntervalOverviewComponent)
    /*.config(['$stateProvider', ($stateProvider: StateProvider) => $stateProvider.state(activityState)])
    .config(['$translateProvider', ($translate) =>
        $translate.useStaticFilesLoader({prefix: '/assets/i18n/activity/', suffix: '.json'})])*/
    .run(["$timeout", "leafletData", ($timeout, leafletData) => {
        $timeout(() => {
            leafletData.getMap().then((map) => {
                map.invalidateSize();
            });
        });
    }])
    .config(configure)
    .name;
