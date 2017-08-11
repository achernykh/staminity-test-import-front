import './activity-segments.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Interval} from "../activity.datamodel";
import {ActivityIntervalFactory, ActivityIntervalG, ActivityIntervalP} from "../activity.datamodel-function";

class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    private duration: string = 'movingDuration';
    private intensity: string = 'heartRate';

    static $inject = [];

    constructor() {

    }

    $onInit() {

        // Добавляем интервалы для теста
        let interval: ActivityIntervalP;
        let group: ActivityIntervalG;

        group = <ActivityIntervalG>ActivityIntervalFactory('G');
        group.repeatCount = 3;
        this.item.activity.completeInterval(group);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

        // Вторая группа с ускорения по 400 метров + 800 метров, через 400 метров отдыха x 2

        group = <ActivityIntervalG>ActivityIntervalFactory('G');
        group.repeatCount = 2;
        this.item.activity.completeInterval(group);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);

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
        this.item.activity.completeInterval(interval);
        this.item.activity.intervals.add([interval]);



        console.log('interval',interval);


        /*let interval1: Interval = new Interval('P');
        interval1.durationMeasure = this.duration;
        interval1.intensityMeasure = this.intensity;
        interval1.durationValue = 3600;
        interval1.movingDurationLength = 3600;
        interval1.distanceLength = 10000;
        interval1.intensityLevelFrom = 140;
        interval1.intensityLevelTo = 150;
        interval1.intensityByFtpFrom = 0.70;
        interval1.intensityByFtpTo = 0.75;
        interval1.movingDurationApprox = false;
        interval1.distanceApprox = true;

        this.item.activity.completeInterval(interval1);

        let interval2: Interval = new Interval('P');
        interval2.durationMeasure = this.duration;
        interval2.intensityMeasure = this.intensity;
        interval2.durationValue = 1800;
        interval2.movingDurationLength = 1800;
        interval2.distanceLength = 5000;
        interval2.intensityLevelFrom = 160;
        interval2.intensityLevelTo = 170;
        interval2.intensityByFtpFrom = 0.80;
        interval2.intensityByFtpTo = 0.85;
        interval1.movingDurationApprox = false;
        interval1.distanceApprox = true;
        this.item.activity.completeInterval(interval2);

        let interval3: Interval = new Interval('P');
        interval3.durationMeasure = this.duration;
        interval3.intensityMeasure = this.intensity;
        interval3.durationValue = 300;
        interval3.movingDurationLength = 300;
        interval3.distanceLength = 1000;
        interval3.intensityLevelFrom = 180;
        interval3.intensityLevelTo = 185;
        interval3.intensityByFtpFrom = 0.87;
        interval3.intensityByFtpTo = 0.90;
        interval1.movingDurationApprox = false;
        interval1.distanceApprox = true;
        this.item.activity.completeInterval(interval3);*/
    }

    /**
     *
     */
    addInterval() {
        let interval: Interval = new Interval('P', {isSelected: false, keyInterval: false, pos: this.item.activity.intervalP.length});
        interval.durationMeasure = this.duration;
        interval.intensityMeasure = this.intensity;
        this.item.activity.completeInterval(interval);
    }

    deleteInterval() {
        this.item.activity.intervalP.map((interval,i) => interval.isSelected && this.item.activity.spliceInterval('P',i));
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
            this.item.activity.intervalP.filter(interval => interval.isSelected).forEach(interval => interval.keyInterval = false);
        } else if(this.selectedKeyInterval().length === 0 || this.selectedKeyInterval().length > 0){
            this.item.activity.intervalP.filter(interval => interval.isSelected).forEach(interval => interval.keyInterval = true);
        }
        this.updatePW();
    }

    selectedInterval():Array<any> {
        return this.item.activity.intervalP.filter(interval => interval.isSelected);
    }

    selectedKeyInterval():Array<any> {
        return this.item.activity.intervalP.filter(interval => interval.isSelected && interval.keyInterval);
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