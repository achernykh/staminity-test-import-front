import './activity-header-overview.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ActivityHeaderCtrl} from "../activity-header/activity-header.component";
import {Activity} from "../activity.datamodel";

class ActivityHeaderOverviewCtrl implements IComponentController {

    private header: ActivityHeaderCtrl;
    public mode: string;
    public activity: Activity;
    static $inject = [];

    constructor() {

    }

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        //this.parent = this.calendarActivity; // предполагаем, что в дальнейшем может быть зависимость с другими компонентами
        this.mode = this.header.mode;
        this.activity = this.header.activity;
    }
}

const ActivityHeaderOverviewComponent:IComponentOptions = {
    require: {
        header: '^activityHeader'
    },
    controller: ActivityHeaderOverviewCtrl,
    template: require('./activity-header-overview.component.html') as string
};

export default ActivityHeaderOverviewComponent;