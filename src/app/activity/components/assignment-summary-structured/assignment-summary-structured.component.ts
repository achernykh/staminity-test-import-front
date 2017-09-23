import './assignment-summary-structured.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class AssignmentSummaryStructuredCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    private readonly structuredMeasure: any = {
        movingDuration: {
            length: 'movingDurationLength',
            approx: 'movingDurationApprox'
        },
        distance: {
            length: 'distanceLength',
            approx: 'distanceApprox'
        }
    };

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

const AssignmentSummaryStructuredComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: AssignmentSummaryStructuredCtrl,
    template: require('./assignment-summary-structured.component.html') as string
};

export default AssignmentSummaryStructuredComponent;