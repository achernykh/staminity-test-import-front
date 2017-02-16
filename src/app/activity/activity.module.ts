import { module } from 'angular';
import ActivityService from './activity.service';
import MeasureMainButtonComponent from './measure-main-button/measure-main-button.component';
import MeasuresAvgTableComponent from './measures-avg-table/measures-avg-table.component';
import MeasureSplitTableComponent from "./measure-split-table/measure-split-table.component";
import ActivityRouteComponent from './activity-route/activity-route.component';
import ActivityAssignmentComponent from './assignment/assignment.component';
import ActivityPeaksComponent from "./peaks/activity-peaks.component";
import chartSettings from './measure-chart/settings/settings.default';
import chartComponent from './measure-chart/chart.component';
//import configure from './activity.config';

const Activity = module('staminity.activity', [])
    .service('ActivityService', ActivityService)
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