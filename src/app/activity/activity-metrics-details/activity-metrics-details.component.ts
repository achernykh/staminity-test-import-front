import './activity-metrics-details.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";

class ActivityMetricsDetailsCtrl implements IComponentController {

    private parent: CalendarItemActivityCtrl;
    private calendarActivity: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;
    private showMap: boolean = true;
    private showChart: boolean = true;
    private showTable: boolean = true;

    constructor(private $mdMedia: any) {
    }

    static $inject = ['$mdMedia'];

    $onInit() {
        // для удобства верстки создаем быстрый путь к данным
        this.parent = this.calendarActivity; // предполагаем, что в дальнейшем может быть зависимость с другими компонентами
        this.mode = this.parent.mode;
        this.activity = this.parent.activity;
    }

    toggleMap(){
        return this.showMap = !this.showMap;
    }

    toggleChart(){
        return this.showChart = !this.showChart;
    }

    toggleTable(){
        return this.showTable = !this.showTable;
    }
}

const ActivityMetricsDetailsComponent:IComponentOptions = {
    require: {
        calendarActivity: '^calendarItemActivity'
    },
    controller: ActivityMetricsDetailsCtrl,
    template: require('./activity-metrics-details.component.html') as string
};

export default ActivityMetricsDetailsComponent;