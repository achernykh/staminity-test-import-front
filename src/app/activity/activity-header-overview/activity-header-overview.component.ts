import {IComponentController, IComponentOptions, INgModelController, IPromise} from "angular";
import { IActivityIntervalPW, ICalcMeasures } from "../../../../api/activity/activity.interface";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {ActivityIntervalPW} from "../activity-datamodel/activity.interval-pw";
import {ActivityIntervalW} from "../activity-datamodel/activity.interval-w";
import {Activity} from "../activity.datamodel";
import "./activity-header-overview.component.scss";

class ActivityHeaderOverviewCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    public intervalPW: ActivityIntervalPW;
    public intervalW: ActivityIntervalW;

    public static $inject = [];

    constructor() {

    }

    public $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.mode = this.item.mode;
        this.activity = this.item.activity;
        this.intervalPW = this.item.activity.intervals.PW;
        this.intervalW = this.item.activity.intervals.W;
    }

    public onChangeForm( plan: IActivityIntervalPW , actual: ICalcMeasures, form: INgModelController) {

    }
}

const ActivityHeaderOverviewComponent: IComponentOptions = {
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityHeaderOverviewCtrl,
    template: require("./activity-header-overview.component.html") as string,
};

export default ActivityHeaderOverviewComponent;
