import Calendar from './calendar.component';

let calendarModule = angular.module('staminity.calendar',[]);
    calendarModule.component('calendar', Calendar);

export default calendarModule;