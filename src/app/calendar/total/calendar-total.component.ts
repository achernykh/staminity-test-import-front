import { copy, IComponentController, IComponentOptions, IFormController, IPromise, IScope} from "angular";
import moment from "moment/src/moment.js";
import {ICalendarWeek} from "../calendar.interface";
import "./calendar-total.component.scss";
import {
    calculateCalendarSummary, calculateCalendarTotals,
    ICalendarWeekSummary, ICalendarWeekTotal,
} from "./calendar-total.function";
import {CalendarWeekData} from "./calendar-week-total.datamodel";

const searchMeasure = (point, interval) => {
    if (point === "plan") {
        if (interval.durationMeasure === "movingDuration") {
            return [0, interval.durationValue];
        } else {
            return [interval.durationValue, 0];
        }
    } else {
        return [
            (interval.calcMeasures.distance.hasOwnProperty("value") && interval.calcMeasures.distance.value) || 0,
            (interval.calcMeasures.movingDuration.hasOwnProperty("value") && interval.calcMeasures.movingDuration.value) ||
            (interval.calcMeasures.duration.hasOwnProperty("value") && interval.calcMeasures.duration.value) || 0];
    }
};

class CalendarTotalCtrl implements IComponentController {

    public week: ICalendarWeek;
    public selected: boolean;

    private data: CalendarWeekData;
    private title: string;
    private items: any[] = [];
    private checked: boolean = false;
    private total: ICalendarWeekTotal;
    //private totalTemplate: ICalendarTotals;
    private summary: ICalendarWeekSummary;

    private shoMenu: boolean = false;

    private readonly primarySport: [string] = ["run", "bike", "swim"];

    public static $inject = ["$mdDialog"];

    constructor(private $mdDialog: any) {
    }

    public $onInit() {
        this.title = moment(this.week.week, "YYYY-WW").week();
    }

    public onToggle() {
        this.selected = !this.selected;
        this.week.subItem.forEach((day) => day.selected = !day.selected);
    }

    public $onChanges(changes) {

        if (changes.update) {
            this.data = new CalendarWeekData(this.week);
            this.items = [];
            if (this.week.hasOwnProperty("subItem") && this.week.subItem && this.week.subItem.length > 0) {
                this.week.subItem.forEach((day) => day.data.calendarItems && day.data.calendarItems.length > 0 && this.items.push(...day.data.calendarItems));
            }
            this.total = calculateCalendarTotals(this.week.subItem);

            // Итоги по всем активностям недели
            this.summary = calculateCalendarSummary(this.total);
        }
    }
}

const CalendarTotalComponent: IComponentOptions =  {
    bindings: {
        week: "<",
        update: "<",
        selected: "<",
        accent: "<", //,
        trainingPlan: "<",
        //onToggle: '&'
    },
    require: {
        //calendar: '^calendar'
    },
    controller: CalendarTotalCtrl,
    template: require("./calendar-total.component.html") as string,
};

export default CalendarTotalComponent;
