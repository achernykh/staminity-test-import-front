import {module} from "angular";
import CalendarActivityChart from "./activity-chart/activity-chart.component.js";
import CalendarActivityComponent from "./activity/calendar-activity.component";
import CalendarComponent from "./calendar.component";
import configure from "./calendar.config";
import {CalendarService} from "./calendar.service";
import CalendarDayComponent from "./day/calendar-day.component";
import { onScrollHitBottom, onScrollHitTop, scrollContainer, scrollKeepPosition } from "./scroll.directives.js";
import CalendarTotalChart from "./total-chart/total-chart.component.js";
import CalendarTotalComponent from "./total/calendar-total.component";

const Calendar = module("staminity.calendar", [])
    .service("CalendarService", ["SocketService", "RESTService", CalendarService])
    .component("calendarActivityChart", CalendarActivityChart)
    .component("calendarTotalChart", CalendarTotalChart)
    .component("calendarDay", CalendarDayComponent)
    .component("calendarTotal", CalendarTotalComponent)
    .component("calendarActivity", CalendarActivityComponent)
    .component("calendar", CalendarComponent)
    .directive("scrollContainer", scrollContainer)
    .directive("onScrollHitTop", onScrollHitTop)
    .directive("onScrollHitBottom", onScrollHitBottom)
    .directive("scrollKeepPosition", scrollKeepPosition)
    .config(configure)
    .name;

export default Calendar;