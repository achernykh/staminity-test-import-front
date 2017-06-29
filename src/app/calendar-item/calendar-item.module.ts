import { module } from 'angular';
import CalendarItemActivityComponent from './calendar-item-activity/calendar-item-activity.component';
import CalendarItemMeasurementComponent from './calendar-item-measurement/calendar-item-measurement.component';
import CalendarItemEventsComponent from './calendar-item-events/calendar-item-events.component';
import {_measurement} from './calendar-item-measurement/calendar-item-measurement.translate';
import {_events} from './calendar-item-events/calendar-item-events.translate';
import CalendarItemWizardComponent from "./calendar-item-wizard/calendar-item-wizard.component";
import {_translateActivity} from "./calendar-item-activity/calendar-item-activity.translate";
import {_translateWizard} from "./calendar-item-wizard/calendar-item-wizard.translate";

const CalendarItemMeasurement = module('staminity.calendar-item-measurement', [])
    .component('calendarItemActivity', CalendarItemActivityComponent)
    .component('calendarItemMeasurement', CalendarItemMeasurementComponent)
    .component('calendarItemEvents', CalendarItemEventsComponent)
    .component('calendarItemWizard', CalendarItemWizardComponent)
    .config(['$translateProvider',($translateProvider) => {
        $translateProvider.translations('ru', {activity: _translateActivity.ru});
        $translateProvider.translations('en', {activity: _translateActivity.en});
        $translateProvider.translations('ru', {measurement: _measurement.ru});
        $translateProvider.translations('en', {measurement: _measurement.en});
        $translateProvider.translations('ru', {event: _events.ru});
        $translateProvider.translations('en', {event: _events.en});
        $translateProvider.translations('ru', {wizard: _translateWizard.ru});
        $translateProvider.translations('en', {wizard: _translateWizard.en});
    }])
    .name;

export default CalendarItemMeasurement;
