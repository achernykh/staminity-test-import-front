import './summary-info.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {Activity} from "../../activity.datamodel";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";

class ActivitySummaryInfoCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    private durationInfo: string = '';
    private intensityInfo: string = '';

    static $inject = ['$filter'];

    constructor(private $filter: any) {

    }

    $onInit() {
        /**
         * Если статус тренировки плановая или пропущена, то выводятся только плановые показатели, по которым задан план
         * В противном случае выводится файтические значения как по длительности (время, расстояние) и интенсиности по
         * базовым показателям (пульс, скорость, темп)
         * @type {string}
         */
        let sportBasic:string = this.item.activity.sportBasic;
        let durationValue:number = this.item.activity.durationValue;
        let durationMeasure:string =  this.item.activity.durationMeasure;
        let intensityValue: number | {} = this.item.activity.intensityValue;
        let intensityMeasure: string = this.item.activity.intensityMeasure;
        let duration: number = this.item.activity.duration;
        let distance: number = this.item.activity.distance;

        let heartRate: number = ((this.item.activity.intervalW.calcMeasures.hasOwnProperty('heartRate')
            && this.item.activity.intervalW.calcMeasures.heartRate.hasOwnProperty('avgValue'))
            && this.item.activity.intervalW.calcMeasures.heartRate.avgValue) || null;

        let speed: number = ((this.item.activity.intervalW.calcMeasures.hasOwnProperty('speed')
            && this.item.activity.intervalW.calcMeasures.speed.hasOwnProperty('avgValue'))
            && this.item.activity.intervalW.calcMeasures.speed.avgValue) || null;

        let power: number = ((this.item.activity.intervalW.calcMeasures.hasOwnProperty('power')
            && this.item.activity.intervalW.calcMeasures.power.hasOwnProperty('avgValue'))
            && this.item.activity.intervalW.calcMeasures.power.avgValue) || null;

        switch (this.item.activity.status) {
            case 'coming' || 'dismiss': {

                this.durationInfo = this.$filter('measureCalc')(durationValue, sportBasic, durationMeasure)+' '+
                    this.$filter('measureUnit')(durationMeasure, sportBasic);

                this.intensityInfo = (this.item.activity.intensityValue.hasOwnProperty('from')
                    && this.$filter('measureCalc')(intensityValue['from'], sportBasic, intensityMeasure)+'-'+
                    this.$filter('measureCalc')(intensityValue['to'], sportBasic, intensityMeasure)+' '+
                    this.$filter('measureUnit')(intensityMeasure, sportBasic)) ||
                    this.$filter('measureCalc')(intensityValue, sportBasic, intensityMeasure)+' '+
                    this.$filter('measureUnit')(intensityMeasure, sportBasic);

                break;
            }
            default: {

                this.durationInfo += (duration
                    && this.$filter('measureCalc')(duration, sportBasic, 'movingDuration') + ' ') || '';

                this.durationInfo += (distance
                    && this.$filter('measureCalc')(distance, sportBasic, 'distance')+' '+
                    this.$filter('measureUnit')('distance', sportBasic)) || '';

                this.intensityInfo += (heartRate
                    && this.$filter('measureCalc')(heartRate, sportBasic, 'heartRate')+' '+
                    this.$filter('measureUnit')('heartRate', sportBasic)+' ') || '';

                this.intensityInfo += (speed
                    && this.$filter('measureCalc')(speed, sportBasic, 'speed')+' '+
                    this.$filter('measureUnit')('speed', sportBasic)+' ') || '';

                this.intensityInfo += (power
                    && this.$filter('measureCalc')(power, sportBasic, 'power')+' '+
                    this.$filter('measureUnit')('power', sportBasic)+' ') || '';

            }
        }
    }
}

const ActivitySummaryInfoComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivitySummaryInfoCtrl,
    template: require('./summary-info.component.html') as string
};

export default ActivitySummaryInfoComponent;