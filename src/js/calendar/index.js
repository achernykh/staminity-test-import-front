import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js';
import { CalendarTotal } from './total/calendar.total.component.js';
import { CalendarActivity } from './item/calendar.activity.component.js';
import { CalendarActivityChart } from './activity-chart/activity.chart.component.js';
import { CalendarTotalChart } from './total-chart/total.chart.component.js';

export const calendar  = angular.module('staminity.calendar',[])
                            .component('calendarActivityChart', CalendarActivityChart)
                            .component('calendarTotalChart', CalendarTotalChart)
                            .component('calendarDay', CalendarDay)
                            .component('calendarTotal', CalendarTotal)
                            .component('calendarActivity', CalendarActivity)
                            .component('calendar', Calendar);

export default calendar;