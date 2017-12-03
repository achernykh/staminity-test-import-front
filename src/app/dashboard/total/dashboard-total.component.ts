import {IComponentController, IComponentOptions, IPromise} from "angular";
import {
    calculateCalendarSummary, calculateCalendarTotals,
    ICalendarWeekSummary, ICalendarWeekTotal,
} from "../../calendar/total/calendar-total.function";
import "./dashboard-total.component.scss";

class DashboardTotalCtrl implements IComponentController {

    week: any;
    total: ICalendarWeekTotal;
    summary: ICalendarWeekSummary;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    $onChanges(changes) {
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
