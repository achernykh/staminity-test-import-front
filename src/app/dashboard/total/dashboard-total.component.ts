import './dashboard-total.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {
    calculateCalendarTotals, calculateCalendarSummary,
    ICalendarTotals
} from '../../calendar/total/calendar-total.function';

class DashboardTotalCtrl implements IComponentController {

    public week: any;
    public total: any;
    public summary: ICalendarTotals;
    public onEvent: (response: Object) => IPromise<void>;
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

const DashboardTotalComponent:IComponentOptions = {
    bindings: {
        week: '<',
        update: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: DashboardTotalCtrl,
    template: require('./dashboard-total.component.html') as string
};

export default DashboardTotalComponent;