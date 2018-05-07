import {Measure, getSportLimit} from "../share/measure/measure.constants";
import {
    ICalcMeasures, IActivityDetails, IActivityIntervalP,
    IActivityIntervalPW, IActivityMeasure
} from "../../../api/activity/activity.interface";
import {copy} from 'angular';
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {ITrainingZonesType, IUserProfile, ITrainingZones} from "../../../api/user/user.interface";
import {getFTP, profileShort} from "../core/user.function";
import moment from 'moment/min/moment-with-locales.js';
import {IActivityInterval, IActivityIntervals} from "@api/activity";

export class MeasureChartData {

    public measures: {} = {}; // Перечень показателей, которые будут показаны на графике
    public data: Array<{}> = []; // Массив данных для показа на графике
    public maxValue: {} = {}; // Максимальные/минимальные значения для таблицы показателей...

    public measuresX: Array<string> = ['distance', 'elapsedDuration'];
    public measuresY: Array<string> = ['heartRate', 'speed', 'power','altitude'];
    private measuresSecondary: Array<string> = ['timestamp','duration'];

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
    if(item.calendarItemType !== 'activity') {
        return item;
    }
    // Копируем все интрвелы с плановыми данными
    item.activityHeader.intervals = item.activityHeader.intervals
        .filter(i => i.type === 'pW' || i.type === 'P' || i.type === 'G');

    // В итоговом интервале есть рассчитанное относительно факта поле, его необходимо очистить
    if (item.activityHeader.intervals.some(i => i.type === 'pW') &&
        item.activityHeader.intervals.filter(i => i.type === 'pW')[0].hasOwnProperty('calcMeasures')) {
        delete item.activityHeader.intervals.filter(i => i.type === 'pW')[0].calcMeasures.completePercent.value;
    }
    return item;
};

/**
 * Обновляем интенсивность тренировки в соответствии со значениями зон нового атлета
 * @param item - календарная запись
 * @param trgZones - зоны атлета получателя
 * @returns {ICalendarItem}
 */
export const updateIntensity = (item: ICalendarItem, trgZones: ITrainingZones): ICalendarItem => {
    debugger;
    let intervalPW: IActivityIntervalPW = <IActivityIntervalPW>item.activityHeader.intervals.filter(i => i.type === 'pW')[0];
    let intervalP: Array<IActivityIntervalP> = <Array<IActivityIntervalP>>item.activityHeader.intervals.filter(i => i.type === 'P');
    let sport: string = item.activityHeader.activityType.code;
    let measure: string = intervalPW.intensityMeasure;
    let ftp: number = getFTP(trgZones,measure,sport);

    if (!intervalPW || !trgZones || !measure || !sport) {
        return item;
    }

    // Пересчитываем значения по итоговому интервалу
    intervalPW.intensityLevelFrom = intervalPW.intensityByFtpFrom * ftp;
    intervalPW.intensityLevelTo = intervalPW.intensityByFtpTo * ftp;

    // Если тренировка задана сегментами, то пересчитываем также отдельные сегменты
    if (intervalP) {
        intervalP.map(i => {
            ftp = getFTP(trgZones, i.intensityMeasure, sport);
            i.intensityLevelFrom = i.intensityByFtpFrom * ftp;
            i.intensityLevelTo = i.intensityByFtpTo * ftp;
        });
    }

    return item;
};

/**
 * Смена владельца теренировки
 * @param item
 * @param user
 * @returns {ICalendarItem}
 */
export const changeUserOwner = (item: ICalendarItem, user: IUserProfile): ICalendarItem => {
    item.userProfileOwner = profileShort(user);
    return item;
};


/**
 * Смещение тренировки на N-дней
 * @param item
 * @param shift
 * @returns {ICalendarItem}
 */
export const shiftDate = (item: ICalendarItem, shift: number) => {
    item.dateStart = moment(item.dateStart, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    item.dateEnd = moment(item.dateEnd, 'YYYY-MM-DD').add(shift,'d').format('YYYY-MM-DD');
    return item;
};

/**
 * Сборка массива координат для мини-граифка
 * Формат массива графика = [ '[start, интенсивность с], [finish, интенсивность по]',... ]
 * @param intervals
 */
export const getIntervalsChartData = (intervals: Array<IActivityIntervalP>): Array<Array<number>> => {
    let start: number = 0; //начало отсечки на графике
    let finish: number = 0; // конец отсечки на графике
    let maxFtp: number = 0;
    let minFtp: number = 100;
    let data: Array<any> = [];

    intervals.map( interval => {
        start = finish;
        finish = start + interval.movingDurationLength;
        maxFtp = Math.max(interval.intensityByFtpTo, maxFtp);
        minFtp = Math.min(interval.intensityByFtpFrom, minFtp);
        data.push([start, (interval.intensityByFtpFrom + interval.intensityByFtpTo) / 2],
            [finish, (interval.intensityByFtpFrom + interval.intensityByFtpTo) / 2]);
    });

    minFtp = minFtp * 0.90;
    data = data.map(d => [d[0]/finish, (d[1] - minFtp) / (maxFtp - minFtp)]);

    // Если сегменты есть, то для графика необходимо привести значения к диапазону от 0...1
    return (data.length > 0 && data) || null;
};

