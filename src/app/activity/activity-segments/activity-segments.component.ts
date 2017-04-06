import './activity-segments.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Interval} from "../activity.datamodel";

class ActivitySegmentsCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public onEvent: (response: Object) => IPromise<void>;

    private duration: string = 'movingDuration';
    private intensity: string = 'heartRate';

    static $inject = [];

    constructor() {

    }

    $onInit() {
        let interval1: Interval = new Interval('P');
        interval1.durationMeasure = this.duration;
        interval1.intensityMeasure = this.intensity;
        interval1.durationValue = 3600;
        interval1.movingDurationLength = 3600;
        interval1.distanceLength = 10000;
        interval1.intensityLevelFrom = 140;
        interval1.intensityLevelTo = 150;
        interval1.intensityByFtpFrom = 0.70;
        interval1.intensityByFtpTo = 0.75;
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
        this.item.activity.completeInterval(interval3);
    }

    addInterval() {
        let interval: Interval = new Interval('P');
        interval.durationMeasure = this.duration;
        interval.intensityMeasure = this.intensity;
        this.item.activity.completeInterval(interval);
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