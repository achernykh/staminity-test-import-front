import {module} from 'angular';
import {CalendarService} from './calendar.service.ts';
import CalendarComponent from './calendar.component';
import CalendarDay from './day/calendar-day.component.js';
import CalendarTotal from './total/calendar-total.component.js';
import CalendarActivity from './activity/calendar-activity.component.js';
import CalendarActivityChart from './activity-chart/activity-chart.component.js';
import CalendarTotalChart from './total-chart/total-chart.component.js';
import { scrollContainer, onScrollHitTop, onScrollHitBottom, scrollHitPadding, onScrollContainerNotOverflown, scrollItem, onScrollCurrentItem, scrollKeepPosition, scrollSuspendWhenOut } from './scroll.directives.js';
import configure from './calendar.config';

const Calendar = module('staminity.calendar', [])
    .service('CalendarService', ['SocketService', CalendarService])
    .component('calendarActivityChart', CalendarActivityChart)
    .component('calendarTotalChart', CalendarTotalChart)
    .component('calendarDay', CalendarDay)
    .component('calendarTotal', CalendarTotal)
    .component('calendarActivity', CalendarActivity)
    .component('calendar', CalendarComponent)
    .directive('scrollContainer', scrollContainer)
    .directive('onScrollHitTop', onScrollHitTop)
    .directive('onScrollHitBottom', onScrollHitBottom)
    .directive('scrollHitPadding', scrollHitPadding)
    .directive('onScrollContainerNotOverflown', onScrollContainerNotOverflown)
    .directive('scrollItem', scrollItem)
    .directive('onScrollCurrentItem', onScrollCurrentItem)
    .directive('scrollKeepPosition', scrollKeepPosition)
    .directive('scrollSuspendWhenOut', scrollSuspendWhenOut)
    .config(configure)
    .name;

export default Calendar;