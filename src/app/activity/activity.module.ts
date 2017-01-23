import { module } from 'angular';
import ActivityService from './activity.service';
import MeasureMainButtonComponent from './measure-main-button/measure-main-button.component';
import MeasuresAvgTableComponent from './measures-avg-table/measures-avg-table.component';
//import configure from './auth.config';

const Activity = module('staminity.activity', [])
    .service('ActivityService', ActivityService)
	.component('measureMainButton',MeasureMainButtonComponent)
	.component('measuresAvgTable',MeasuresAvgTableComponent)
    //.config(configure)
    .name;

export default Activity;