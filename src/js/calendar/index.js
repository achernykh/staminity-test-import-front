import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js'
import { CalendarTotal } from './total/calendar.total.component.js'
import { CalendarActivity } from './item/calendar.activity.component.js'

export const calendar  = angular.module('staminity.calendar',[])
                            .component('calendarDay', CalendarDay)
                            .component('calendarTotal', CalendarTotal)
                            .component('calendarActivity', CalendarActivity)
                            .component('calendar', Calendar);

export default calendar;