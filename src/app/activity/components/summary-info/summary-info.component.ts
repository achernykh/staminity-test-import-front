import './summary-info.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {ActivityHeaderCtrl} from "../../activity-header/activity-header.component";
import {Activity} from "../../activity-datamodel/activity.datamodel";
import {CalendarItemActivityCtrl} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Measure} from "../../../share/measure/measure.constants";

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
        let sportBasic:string = this.item.activity.header.sportBasic;
        let durationValue:number = this.item.activity.durationValue;
        let durationMeasure:string =  this.item.activity.durationMeasure;
        let intensityValue: number | {} = this.item.activity.intensityValue;
        let intensityMeasure: string = this.item.activity.intensityMeasure;
        let movingDuration: number = this.item.activity.movingDuration;
        let distance: number = this.item.activity.distance;

        let heartRate: number = ((this.item.activity.intervals.W.calcMeasures.hasOwnProperty('heartRate')
            && this.item.activity.intervals.W.calcMeasures.heartRate.hasOwnProperty('avgValue'))
            && this.item.activity.intervals.W.calcMeasures.heartRate.avgValue) || null;

        let speed: number = ((this.item.activity.intervals.W.calcMeasures.hasOwnProperty('speed')
            && this.item.activity.intervals.W.calcMeasures.speed.hasOwnProperty('avgValue'))
            && this.item.activity.intervals.W.calcMeasures.speed.avgValue) || null;

        let power: number = ((this.item.activity.intervals.W.calcMeasures.hasOwnProperty('power')
            && this.item.activity.intervals.W.calcMeasures.power.hasOwnProperty('avgValue'))
            && this.item.activity.intervals.W.calcMeasures.power.avgValue) || null;

        let measure: Measure;

        if (intensityMeasure) {
            measure = new Measure(intensityMeasure, sportBasic, intensityValue);
        }

        switch (this.item.activity.status) {
            case 'coming': case 'dismiss': { // показываем плановые значения

                if(this.item.activity.isStructured) { // для структурированных тренировок
                    this.durationInfo =
                        `${this.item.activity.movingDurationApprox ? '~' : ''}` +
                        `${this.$filter('measureCalc')(this.item.activity.movingDuration, sportBasic, 'movingDuration')}` +
                        ' ' + `${this.item.activity.distanceApprox ? '~' : ''}` +
                        `${this.$filter('measureCalc')(this.item.activity.distance, sportBasic, 'distance')}` +
                        '\xA0' + `${this.$filter('translate')(this.$filter('measureUnit')('distance', sportBasic))}`;

                    this.intensityInfo = null;
                } else {
                    this.durationInfo = this.$filter('measureCalc')(durationValue, sportBasic, durationMeasure)+' '+
                        this.$filter('translate')(this.$filter('measureUnit')(durationMeasure, sportBasic));

                    if (intensityMeasure) {
                        if (intensityValue['to'] === intensityValue['from']) {// если значение
                            this.intensityInfo = (this.item.activity.intensityValue.hasOwnProperty('from') && this.$filter('measureCalc')(intensityValue['from'], sportBasic, intensityMeasure)) || '';
                        } else { // если интервал
                            if (measure.isPace()) {
                                this.intensityInfo = (this.item.activity.intensityValue.hasOwnProperty('to') && this.$filter('measureCalc')(intensityValue['to'], sportBasic, intensityMeasure) || '') +
                                    '-' + (this.$filter('measureCalc')(intensityValue['from'], sportBasic, intensityMeasure) || '');
                            } else {
                                this.intensityInfo = (this.item.activity.intensityValue.hasOwnProperty('from') && this.$filter('measureCalc')(intensityValue['from'], sportBasic, intensityMeasure) || '') +
                                    '-' + (this.$filter('measureCalc')(intensityValue['to'], sportBasic, intensityMeasure) || '');
                            }
                        }
                        this.intensityInfo += ' ' + this.$filter('translate')(this.$filter('measureUnit')(intensityMeasure, sportBasic));
                    }
                }

                break;
            }
            default: { // показываем фактические значения
                this.durationInfo += (movingDuration
                    && this.$filter('measureCalc')(movingDuration, sportBasic, 'movingDuration') + ' ') || '';

                this.durationInfo += (distance
                    && this.$filter('measureCalc')(distance, sportBasic, 'distance')+' '+
                    this.$filter('translate')(this.$filter('measureUnit')('distance', sportBasic))) || '';

                this.intensityInfo += (heartRate
                    && this.$filter('measureCalc')(heartRate, sportBasic, 'heartRate')+'\xA0'+
                    this.$filter('translate')(this.$filter('measureUnit')('heartRate', sportBasic))+' ') || '';

                this.intensityInfo += (speed
                    && this.$filter('measureCalc')(speed, sportBasic, 'speed')+'\xA0'+
                    this.$filter('translate')(this.$filter('measureUnit')('speed', sportBasic))+' ') || '';

                this.intensityInfo += (power
                    && this.$filter('measureCalc')(power, sportBasic, 'power')+'\xA0'+
                    this.$filter('translate')(this.$filter('measureUnit')('power', sportBasic))+' ') || '';

            }
        }
    }

    view(id:number) {
        //debugger;
        //window.open(`${window.location.origin}/activity/${id}`);
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