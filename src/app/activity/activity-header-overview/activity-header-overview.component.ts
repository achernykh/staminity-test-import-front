import './activity-header-overview.component.scss';
import {IComponentOptions, IComponentController, IPromise, INgModelController} from 'angular';
import {Activity} from "../activity-datamodel/activity.datamodel";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {ActivityIntervalPW} from "../activity-datamodel/activity.interval-pw";
import {ActivityIntervalW} from "../activity-datamodel/activity.interval-w";
import { IActivityIntervalPW, ICalcMeasures } from "../../../../api/activity/activity.interface";

export class ActivityHeaderOverviewCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    public intervalPW: ActivityIntervalPW;
    public intervalW: ActivityIntervalW;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.mode = this.item.mode;
        this.activity = this.item.activity;
        this.intervalPW = this.item.activity.intervals.PW;
        this.intervalW = this.item.activity.intervals.W;
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }

    onChangeForm( plan: IActivityIntervalPW ,actual: ICalcMeasures, form: INgModelController) {

    }
}

const ActivityHeaderOverviewComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderOverviewCtrl,
    template: require('./activity-header-overview.component.html') as string
};

export default ActivityHeaderOverviewComponent;