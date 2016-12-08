import { CalendarService } from './calendar.service.ts';
import Calendar from './calendar.component';
import { CalendarDay } from './day/calendar.day.component.js';
import { CalendarTotal } from './total/calendar.total.component.js';
import { CalendarActivity } from './item/calendar.activity.component.js';
import { CalendarActivityChart } from './activity-chart/activity.chart.component.js';
import { CalendarTotalChart } from './total-chart/total.chart.component.js';
import { scrollCurrentItem, scrollFire, keepScrollPosition } from './scroll.directives';


export const calendar  = angular.module('staminity.calendar',[])
                            .service('CalendarService', ['SocketService',CalendarService])
                            .component('calendarActivityChart', CalendarActivityChart)
                            .component('calendarTotalChart', CalendarTotalChart)
                            .component('calendarDay', CalendarDay)
                            .component('calendarTotal', CalendarTotal)
                            .component('calendarActivity', CalendarActivity)
                            .component('calendar', Calendar)
                            .directive('scrollFire', scrollFire)
                            .directive('keepScrollPosition', keepScrollPosition)
                            .directive('scrollCurrentItem', scrollCurrentItem);

export default calendar;