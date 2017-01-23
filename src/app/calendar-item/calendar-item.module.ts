import { module } from 'angular';
import CalendarItemActivityComponent from './calendar-item-activity/calendar-item-activity.component';
import CalendarItemMeasurementComponent from './calendar-item-measurement/calendar-item-measurement.component.js';
import {_measurement} from './calendar-item-measurement/calendar-item-measurement.translate';

const CalendarItemMeasurement = module('staminity.calendar-item-measurement', [])
    .component('calendarItemActivity', CalendarItemActivityComponent)
    .component('calendarItemMeasurement', CalendarItemMeasurementComponent)
    .config(['$translateProvider',($translateProvider) => {
        $translateProvider.translations('ru', {measurement: _measurement.ru});
        $translateProvider.translations('en', {measurement: _measurement.en});
    }])
    .name;

export default CalendarItemMeasurement;
