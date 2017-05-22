import {module} from 'angular';
import {CalendarService} from './calendar.service';
import CalendarComponent from './calendar.component';
import CalendarDayComponent from './day/calendar-day.component';
import CalendarTotal from './total/calendar-total.component.js';
import CalendarActivityComponent from './activity/calendar-activity.component';
import CalendarActivityChart from './activity-chart/activity-chart.component.js';
import CalendarTotalChart from './total-chart/total-chart.component.js';
import { scrollContainer, onScrollHitTop, onScrollHitBottom, scrollKeepPosition } from './scroll.directives.js';
import configure from './calendar.config';

const Calendar = module('staminity.calendar', [])
    .service('CalendarService', ['SocketService', CalendarService])
    .component('calendarActivityChart', CalendarActivityChart)
    .component('calendarTotalChart', CalendarTotalChart)
    .component('calendarDay', CalendarDayComponent)
    .component('calendarTotal', CalendarTotal)
    .component('calendarActivity', CalendarActivityComponent)
    .component('calendar', CalendarComponent)
    .directive('scrollContainer', scrollContainer)
    .directive('onScrollHitTop', onScrollHitTop)
    .directive('onScrollHitBottom', onScrollHitBottom)
    .directive('scrollKeepPosition', scrollKeepPosition)
    .config(configure)
    .name;

export default Calendar;