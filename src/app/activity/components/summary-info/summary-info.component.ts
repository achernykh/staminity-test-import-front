import './summary-info.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {Activity} from "../../activity.datamodel";

class ActivitySummaryInfoCtrl implements IComponentController {

    private header: ActivityHeaderCtrl;
    public mode: string;
    public activity: Activity;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.mode = this.header.mode;
        this.activity = this.header.activity;
    }
}

const ActivitySummaryInfoComponent:IComponentOptions = {
    require: {
        header: '^activityHeader'
    },
    controller: ActivitySummaryInfoCtrl,
    template: require('./summary-info.component.html') as string
};

export default ActivitySummaryInfoComponent;