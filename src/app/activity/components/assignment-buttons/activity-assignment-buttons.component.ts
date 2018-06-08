import './activity-assignment-buttons.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivityAssignmentButtonsCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    onEvent: (response: Object) => IPromise<void>;
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    onReset () {
        this.item.onReset();
    }

    onSave(){
        this.item.options.templateMode ? this.item.onSaveTemplate() : this.item.onSave();
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }
}

const ActivityAssignmentButtonsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        isFormValid: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityAssignmentButtonsCtrl,
    template: require('./activity-assignment-buttons.component.html') as string
};

export default ActivityAssignmentButtonsComponent;