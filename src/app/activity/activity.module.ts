import { module } from 'angular';
import ActivityService from './activity.service';
import MeasureMainButtonComponent from './measure-main-button/measure-main-button.component';
import MeasuresAvgTableComponent from './measures-avg-table/measures-avg-table.component';
import MeasureSplitTableComponent from "./components/measure-split-table/measure-split-table.component";
import ActivityRouteComponent from './components/route/activity-route.component';
import ActivityAssignmentComponent from './components/assignment/assignment.component';
import ActivityPeaksComponent from "./components/peaks/activity-peaks.component";
import chartSettings from './components/measure-chart/settings/settings.default';
import chartComponent from './components/measure-chart/chart.component';
import ActivityHeaderComponent from "./activity-header/activity-header.component";
import ActivityMetricsDetailsComponent from "./activity-metrics-details/activity-metrics-details.component";
import ActivityHeaderOverviewComponent from "./activity-header-overview/activity-header-overview.component";
import ActivitySummaryInfoComponent from "./components/summary-info/summary-info.component";
//import configure from './activity.config';

const Activity = module('staminity.activity', [])
    .service('ActivityService', ActivityService)
	.component('activityHeader', ActivityHeaderComponent)
	.component('activityHeaderOverview', ActivityHeaderOverviewComponent)
	.component('activityMetricsDetails', ActivityMetricsDetailsComponent)
	.component('activitySummaryInfo', ActivitySummaryInfoComponent)
	.component('measureMainButton',MeasureMainButtonComponent)
	.component('measuresAvgTable',MeasuresAvgTableComponent)
	.component('measureSplitTable', MeasureSplitTableComponent)
	.component('activityRoute',ActivityRouteComponent)
	.component('activityAssignment', ActivityAssignmentComponent)
	.component('activityPeaks', ActivityPeaksComponent)
	.constant('activityChartSettings', chartSettings)
	.component('activityMetricsChar', chartComponent)
	.run(['$timeout','leafletData',($timeout, leafletData)=> {
		$timeout(()=> {
			leafletData.getMap().then((map) => {
				map.invalidateSize();
			});
		});
	}])
    //.config(configure)
    .name;

export default Activity;