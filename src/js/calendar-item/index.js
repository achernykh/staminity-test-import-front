import {CalendarItemMeasurement} from './calendar-item-measurement/calendar-item-measurement.component'
import {_measurement} from './calendar-item-measurement/calendar-item-measurement.translate'

export let CalendarItemModule = angular.module('staminity.calendar-item', ['smDateTimeRangePicker'])

// Перевод показателей и едениц измерений
CalendarItemModule.config($translateProvider => {
    $translateProvider.translations('ru', {measurement: _measurement.ru});
    $translateProvider.translations('en', {measurement: _measurement.en});
})

CalendarItemModule.component('calendarItemMeasurement',CalendarItemMeasurement)
