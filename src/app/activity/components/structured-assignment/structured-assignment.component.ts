import './structured-assignment.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {IActivityIntervalP} from "../../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class StructuredAssignmentCtrl implements IComponentController {

    public plan: Array<IActivityIntervalP>;
    public item: CalendarItemActivityCtrl;

    public onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    change(index: number, interval: IActivityIntervalP) {
        this.plan[index] = interval;
        this.item.changeStructuredAssignment ++;
    }

    splice(id: number) {
        debugger;
        this.item.activity.spliceInterval('P',id);
    }
}

const StructuredAssignmentComponent:IComponentOptions = {
    bindings: {
        plan: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: StructuredAssignmentCtrl,
    template: require('./structured-assignment.component.html') as string
};

export default StructuredAssignmentComponent;