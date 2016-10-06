import Calendar from './calendar.component';

let calendarModule = angular.module('staminity.calendar',['ui.scroll', 'ui.scroll.jqlite']);
    calendarModule.component('calendar', Calendar);

export default calendarModule;