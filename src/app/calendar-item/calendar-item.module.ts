import { module } from 'angular';
import CalendarItemMeasurementComponent from './calendar-item-measurement/calendar-item-measurement.component.js';
import {_measurement} from './calendar-item-measurement/calendar-item-measurement.translate';

const CalendarItemMeasurement = module('staminity.calendar-item-measurement', [])
    .component('calendarItemMeasurement', CalendarItemMeasurementComponent)
    .config(['$translateProvider',($translateProvider) => {
        $translateProvider.translations('ru', {measurement: _measurement.ru});
        $translateProvider.translations('en', {measurement: _measurement.en});
    }])
    .name;

export default CalendarItemMeasurement;
