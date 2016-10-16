import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js'
import { CalendarActivity } from './item/calendar.activity.component.js'

let calendarModule = angular.module('staminity.calendar',[]);
    calendarModule.component('calendarDay', CalendarDay);
    calendarModule.component('calendarActivity', CalendarActivity);
    calendarModule.component('calendar', Calendar);

export default calendarModule;