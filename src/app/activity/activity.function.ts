import {Measure, getSportLimit} from "../share/measure/measure.constants";
import {
    ICalcMeasures, IActivityDetails, IActivityIntervalP,
    IActivityIntervalPW
} from "../../../api/activity/activity.interface";
import {copy} from 'angular';
import {ICalendarItem} from "../../../api/calendar/calendar.interface";

export class MeasureChartData {

    public measures: {} = {}; // Перечень показателей, которые будут показаны на графике
    public data: Array<{}> = []; // Массив данных для показа на графике
    public maxValue: {} = {}; // Максимальные/минимальные значения для таблицы показателей...

    public measuresX: Array<string> = ['distance', 'elapsedDuration'];
    public measuresY: Array<string> = ['heartRate', 'speed', 'power','altitude'];
    private measuresSecondary: Array<string> = ['timestamp'];

    /**
     *
     * @param sportBasic
     * @param calcMeasure
     * @param details
     */
    constructor(private sportBasic: string, private calcMeasure: ICalcMeasures, private details: IActivityDetails) {

        let array: Array<string>;

        array = copy(this.measuresY);
        array.forEach(key => {
            if (this.details.measures.hasOwnProperty(key) &&
                (this.calcMeasure.hasOwnProperty(key) && this.calcMeasure[key].value > 0)) {
                this.measures[key] = this.details.measures[key];
                this.measures[key]['show'] = true;
                if(this.calcMeasure[key] && this.calcMeasure[key].hasOwnProperty('minValue')) {
                    this.maxValue[key] = {
                        max: this.calcMeasure[key].maxValue,
                        min: this.calcMeasure[key].minValue
                    };
                }
            } else {
                this.measuresY.splice(this.measuresY.indexOf(key), 1);
            }
        });

        array = copy(this.measuresX);
        array.forEach(key => {
            if (this.details.measures.hasOwnProperty(key) &&
                (!this.calcMeasure.hasOwnProperty(key) || (this.calcMeasure.hasOwnProperty(key) && this.calcMeasure[key].value > 0))) {
                this.measures[key] = this.details.measures[key];
                this.measures[key]['show'] = true;
            } else {
                this.measuresX.splice(this.measuresX.indexOf(key), 1);
            }
        });

        this.measuresSecondary.forEach(key => {
            this.measures[key] = this.details.measures[key];
            this.measures[key]['show'] = true;
        });

        this.details.metrics.forEach(info => {
            let cleaned = {};
            for (let key in this.measures) {
                let measure: Measure = new Measure(key,this.sportBasic);
                cleaned[key] = measure.isPace() ?
                    Math.max(info[this.measures[key]['idx']], getSportLimit(this.sportBasic,key)['min']) :
                    info[this.measures[key]['idx']];
            }
            this.data.push(cleaned);
        });

    }
}

/**
 * Тренировка имеет план?
 * @param item
 */
export const isSpecifiedActivity = (item: ICalendarItem):boolean => {
    let intervalP: Array<IActivityIntervalP> = <Array<IActivityIntervalP>>item.activityHeader.intervals.filter(i => i.type === 'P');
    let intervalPW: IActivityIntervalPW = <IActivityIntervalPW>item.activityHeader.intervals.filter(i => i.type === 'pW')[0];
    return (!!intervalP && intervalP.length > 0) ||
        (!!intervalPW && (intervalPW.durationValue > 0 || intervalPW.intensityLevelFrom > 0));
};

/**
 * Тренировака является выполненной?
 * @param item
 * @returns {boolean}
 */
export const isCompletedActivity = (item: ICalendarItem):boolean => {
    let intervalW: IActivityIntervalPW = <IActivityIntervalPW>item.activityHeader.intervals.filter(i => i.type === 'W')[0];
    return (!!intervalW && Object.keys(intervalW.calcMeasures)
            .filter(m => intervalW.calcMeasures[m]['value'] || intervalW.calcMeasures[m]['minValue'] ||
                intervalW.calcMeasures[m]['maxValue'] || intervalW.calcMeasures[m]['avgValue']).length > 0);
};

/**
 * Очиащем фактические данные по тренировке
 * @param item
 * @returns {ICalendarItem}
 */
export const clearActualDataActivity = (item: ICalendarItem): ICalendarItem => {
    item.activityHeader.intervals = item.activityHeader.intervals.filter(i => i.type === 'pW' || i.type === 'P');
    delete item.activityHeader.intervals.filter(i => i.type === 'pW')[0].calcMeasures.completePercent.value;
    return item;
};