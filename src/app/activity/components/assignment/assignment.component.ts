import {IComponentOptions, IComponentController, IQService, IFilterService, IPromise, INgModelController, copy} from 'angular';
import './assignment.component.scss';
import {IActivityMeasure, ICalcMeasures, IActivityIntervalPW} from "../../../../../api/activity/activity.interface";
import {isDuration, isPace, measurementUnit, measurementUnitDisplay, validators} from "../../../share/measure/measure.constants";
import {Activity} from "../../activity.datamodel";
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import moment from 'moment/src/moment.js';
import {IAuthService} from "../../../auth/auth.service";



export enum FtpState {
    On,
    Off
}

class ActivityAssignmentCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public onChange: (result: {plan: IActivityIntervalPW, actual: ICalcMeasures, form: INgModelController}) => IPromise<void>;

    private selected:Array<number> = [];
    private percentComplete: Object = {};

    static $inject = [];

    constructor() {
    }

    $onInit() {
    }


}

const ActivityAssignmentComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    bindings: {
        sport: '<',
        form: '<',
        editable: '<',
        ftpMode: '<',
        change: '<',
        onChange: '&'
    },
    controller: ActivityAssignmentCtrl,
    template: require('./assignment.component.html') as string
};

export default ActivityAssignmentComponent;