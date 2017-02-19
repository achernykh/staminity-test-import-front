import './activity-header.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";

export class ActivityHeaderCtrl implements IComponentController {

    public parent: CalendarItemActivityCtrl;
    public calendarActivity: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;

    constructor(private $mdMedia: any) {
    }

    static $inject = ['$mdMedia'];

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.parent = this.calendarActivity; // предполагаем, что в дальнейшем может быть зависимость с другими компонентами
        this.mode = this.parent.mode;
        this.activity = this.parent.activity;
    }
}

const ActivityHeaderComponent:IComponentOptions = {
    require: {
        calendarActivity: '^calendarItemActivity'
    },
    controller: ActivityHeaderCtrl,
    template: require('./activity-header.component.html') as string
};

export default ActivityHeaderComponent;