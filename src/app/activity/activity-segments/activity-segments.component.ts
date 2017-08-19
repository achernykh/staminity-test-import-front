import './activity-segments.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Interval} from "../activity.datamodel";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import {ActivityIntervalG} from "../activity-datamodel/activity.interval-g";
import {ActivityIntervalFactory} from "../activity-datamodel/activity.functions";
import {ActivityIntervals} from "../activity-datamodel/activity.intervals";

class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    private durationMeasure: string = 'movingDuration';
    private intensityMeasure: string = 'heartRate';
    private intervals: ActivityIntervals;
    private select: Array<number> = [];

    static $inject = [];

    constructor() {

    }

    $onInit() {

        this.intervals = this.item.activity.intervals;

        // Добавляем интервалы для теста
        let interval: ActivityIntervalP;
        let group: ActivityIntervalG;

        /**group = <ActivityIntervalG>ActivityIntervalFactory('G');
        group.repeatCount = 3;
        this.item.activity.intervals.add([group]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 2000,
            movingDurationLength: 540,
            movingDurationApprox: true,
            distanceLength: 1000,
            distanceApprox: false,
            intensityLevelFrom: 160,
            intensityLevelTo: 165,
            intensityByFtpFrom: 0.80,
            intensityByFtpTo: 0.85,
            parentGroup: group.code,
            pos: 4,
            repeatPos: 0
        });
        this.item.activity.intervals.add([interval]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            durationValue: 120,
            movingDurationLength: 120,
            movingDurationApprox: false,
            distanceLength: 300,
            distanceApprox: true,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.70,
            intensityByFtpTo: 0.75,
            parentGroup: group.code,
            pos: 5,
            repeatPos: 0
        });
        this.item.activity.intervals.add([interval]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 2000,
            movingDurationLength: 540,
            movingDurationApprox: true,
            distanceLength: 1000,
            distanceApprox: false,
            intensityLevelFrom: 160,
            intensityLevelTo: 165,
            intensityByFtpFrom: 0.80,
            intensityByFtpTo: 0.85,
            parentGroup: group.code,
            pos: 6,
            repeatPos: 1
        });
        this.item.activity.intervals.add([interval]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            durationValue: 120,
            movingDurationLength: 120,
            movingDurationApprox: false,
            distanceLength: 300,
            distanceApprox: true,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.70,
            intensityByFtpTo: 0.75,
            parentGroup: group.code,
            pos: 7,
            repeatPos: 1
        });
        this.item.activity.intervals.add([interval]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 2000,
            movingDurationLength: 540,
            movingDurationApprox: true,
            distanceLength: 1000,
            distanceApprox: false,
            intensityLevelFrom: 160,
            intensityLevelTo: 165,
            intensityByFtpFrom: 0.80,
            intensityByFtpTo: 0.85,
            parentGroup: group.code,
            pos: 8,
            repeatPos: 2
        });
        this.item.activity.intervals.add([interval]);

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            durationValue: 120,
            movingDurationLength: 120,
            movingDurationApprox: false,
            distanceLength: 300,
            distanceApprox: true,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.70,
            intensityByFtpTo: 0.75,
            parentGroup: group.code,
            pos: 9,
            repeatPos: 2
        });
        this.item.activity.intervals.add([interval]);

        // Отдых после первой группы

        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'movingDuration',
            intensityMeasure: 'heartRate',
            durationValue: 600,
            movingDurationLength: 600,
            movingDurationApprox: false,
            distanceLength: 2000,
            distanceApprox: true,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.60,
            intensityByFtpTo: 0.65,
            pos: 10
        });
        this.item.activity.intervals.add([interval]);

        // Вторая группа с ускорения по 400 метров + 800 метров, через 400 метров отдыха x 2

        group = <ActivityIntervalG>ActivityIntervalFactory('G');
        group.repeatCount = 2;
        this.item.activity.intervals.add([group]);

        //400м
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 400,
            movingDurationLength: 90,
            movingDurationApprox: true,
            distanceLength: 400,
            distanceApprox: false,
            intensityLevelFrom: 190,
            intensityLevelTo: 190,
            intensityByFtpFrom: 1.05,
            intensityByFtpTo: 1.05,
            parentGroup: group.code,
            pos: 11,
            repeatPos: 0
        });
        this.item.activity.intervals.add([interval]);

        //800м
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 800,
            movingDurationLength: 190,
            movingDurationApprox: true,
            distanceLength: 800,
            distanceApprox: false,
            intensityLevelFrom: 185,
            intensityLevelTo: 185,
            intensityByFtpFrom: 1.00,
            intensityByFtpTo: 1.00,
            parentGroup: group.code,
            pos: 12,
            repeatPos: 0
        });
        this.item.activity.intervals.add([interval]);

        //400м отдыха
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 400,
            movingDurationLength: 160,
            movingDurationApprox: true,
            distanceLength: 400,
            distanceApprox: false,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.60,
            intensityByFtpTo: 0.70,
            parentGroup: group.code,
            pos: 13,
            repeatPos: 0
        });
        this.item.activity.intervals.add([interval]);

        //400м
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 400,
            movingDurationLength: 90,
            movingDurationApprox: true,
            distanceLength: 400,
            distanceApprox: false,
            intensityLevelFrom: 190,
            intensityLevelTo: 190,
            intensityByFtpFrom: 1.05,
            intensityByFtpTo: 1.05,
            parentGroup: group.code,
            pos: 14,
            repeatPos: 1
        });
        this.item.activity.intervals.add([interval]);

        //800м
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 800,
            movingDurationLength: 190,
            movingDurationApprox: true,
            distanceLength: 800,
            distanceApprox: false,
            intensityLevelFrom: 185,
            intensityLevelTo: 185,
            intensityByFtpFrom: 1.00,
            intensityByFtpTo: 1.00,
            parentGroup: group.code,
            pos: 15,
            repeatPos: 1
        });
        this.item.activity.intervals.add([interval]);

        //400м отдыха
        interval = <ActivityIntervalP>ActivityIntervalFactory('P', {
            durationMeasure: 'distance',
            intensityMeasure: 'heartRate',
            durationValue: 400,
            movingDurationLength: 160,
            movingDurationApprox: true,
            distanceLength: 400,
            distanceApprox: false,
            intensityLevelFrom: 140,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.60,
            intensityByFtpTo: 0.70,
            parentGroup: group.code,
            pos: 16,
            repeatPos: 1
        });

        this.item.activity.intervals.add([interval]);
        this.intervals = this.item.activity.intervals.intervalP; **/

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
        let params = {
            pos: this.intervals.lastPos() + 1,
            durationMeasure: this.durationMeasure,
            intensityMeasure: this.intensityMeasure,
            durationValue: 30*60,
            movingDurationLength: 30*60,
            intensityLevelFrom: 150,
            intensityLevelTo: 150,
            intensityByFtpFrom: 0.70,
            intensityByFtpTo: 0.70
        };

        this.intervals.add([ActivityIntervalFactory('P', params)]);
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

}

const ActivitySegmentsComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivitySegmentsCtrl,
    template: require('./activity-segments.component.html') as string
};

export default ActivitySegmentsComponent;