import {IComponentController, IComponentOptions, IPromise} from "angular";
import {
    calculateCalendarSummary, calculateCalendarTotals,
    ICalendarWeekSummary, ICalendarWeekTotal,
} from "../../calendar/total/calendar-total.function";
import "./dashboard-total.component.scss";

class DashboardTotalCtrl implements IComponentController {

    public week: any;
    public total: ICalendarWeekTotal;
    public summary: ICalendarWeekSummary;
    public onEvent: (response: Object) => IPromise<void>;
    public static $inject = [];

    constructor() {

    }

    public $onInit() {

    }

    public $onChanges(changes) {
        if (changes.update) {
            this.total = calculateCalendarTotals(this.week.subItem);
            this.summary = calculateCalendarSummary(this.total);
        }
    }
}

const DashboardTotalComponent: IComponentOptions = {
    bindings: {
        week: "<",
        update: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: DashboardTotalCtrl,
    template: require("./dashboard-total.component.html") as string,
};

export default DashboardTotalComponent;
