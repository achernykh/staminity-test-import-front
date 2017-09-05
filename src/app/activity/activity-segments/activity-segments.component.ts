import './activity-segments.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Interval} from "../activity.datamodel";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import {ActivityIntervalG} from "../activity-datamodel/activity.interval-g";
import {ActivityIntervalFactory} from "../activity-datamodel/activity.functions";
import {ActivityIntervals} from "../activity-datamodel/activity.intervals";
import {FtpState} from "../components/assignment/assignment.component";
import {segmentTemplate, getChanges} from "./activity-segments.constants";
import {getFTP} from "../../core/user.function";
import {IActivityInterval} from "../../../../api/activity/activity.interface";


class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    public viewPlan: boolean = true;
    public viewActual: boolean = false;
    public viewGroup: boolean = true;

    private durationMeasure: string = 'movingDuration';
    private intensityMeasure: string = 'heartRate';
    private intervals: ActivityIntervals;
    private select: Array<number> = [];

    public ftpMode: number;

    static $inject = [];

    constructor() {

    }

    $onInit() {
        this.prepareIntervals();
    }

    $onChanges():void {
        this.prepareIntervals();
    }

    prepareIntervals(): void {
        this.intervals = this.item.activity.intervals;
    }

    /**
     * @description Обновление модели данных
     */
    update() {
        this.intervals = this.item.activity.intervals;
        this.item.changeStructuredAssignment ++;
    }

    onChartSelection(id: number){
        if(this.intervals[id]){
            //this.intervals[id].isSelected = true;
        }
    }

    /**
     *
     */
    addInterval() {
        debugger;
        let template: IActivityInterval = segmentTemplate(this.intervals.lastPos() + 1, this.item.activity.sportBasic);
        let interval: ActivityIntervalP = new ActivityIntervalP('P', template);
        let ftp: number = getFTP(this.item.currentUser.trainingZones,interval.intensityMeasure,this.item.activity.sportBasic);

        this.intervals.add([interval.complete(ftp, FtpState.On, getChanges(interval))]);
        this.intervals.PW.calculate(this.intervals.P);
        this.update();
    }

    delete() {
        this.intervals.P.filter(interval => interval.isSelected)
            .map(interval => this.intervals.splice(interval.type, interval.pos));
        this.intervals.PW.calculate(this.intervals.P);
        this.update();
    }

    isKey():boolean {
        return this.selectedInterval().length === this.selectedKeyInterval().length;
    }

    isIndeterminate():boolean {
        console.log(this.selectedInterval().length, this.selectedKeyInterval().length);
        //return false;
        return this.selectedKeyInterval().length !== 0 && this.selectedInterval().length !== this.selectedKeyInterval().length;
    }

    toggleKey(){
        if(this.selectedInterval().length === this.selectedKeyInterval().length){
            this.intervals.P.filter(interval => interval.isSelected).forEach(interval => interval.keyInterval = false);
        } else if(this.selectedKeyInterval().length === 0 || this.selectedKeyInterval().length > 0){
            this.intervals.P.filter(interval => interval.isSelected).forEach(interval => interval.keyInterval = true);
        }
        this.update();
        //this.updatePW();
    }

    selectedInterval():Array<any> {
        return this.intervals.P.filter(interval => interval.isSelected);
    }

    selectedKeyInterval():Array<any> {
        return this.intervals.P.filter(interval => interval.isSelected && interval.keyInterval);
    }

    updatePW(){
        this.item.activity.calculateInterval('pW');
        this.item.changeStructuredAssignment ++;
    }

    ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.item.ftpMode = mode;
    }

}

const ActivitySegmentsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        hasImport: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivitySegmentsCtrl,
    template: require('./activity-segments.component.html') as string
};

export default ActivitySegmentsComponent;