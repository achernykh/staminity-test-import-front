import {copy} from "angular";
import moment from "moment/min/moment-with-locales.js";
import {
    IActivityDetails, IActivityIntervalP, IActivityIntervalPW,
    IActivityMeasure, ICalcMeasures,
} from "../../../api/activity/activity.interface";
import {ICalendarItem} from "../../../api/calendar/calendar.interface";
import {ITrainingZones, ITrainingZonesType, IUserProfile} from "../../../api/user/user.interface";
import {getFTP, profileShort} from "../core/user.function";
import {getSportLimit, Measure} from "../share/measure/measure.constants";

export class MeasureChartData {

    public measures: {} = {}; // Перечень показателей, которые будут показаны на графике
    public data: Array<{}> = []; // Массив данных для показа на графике
    public maxValue: {} = {}; // Максимальные/минимальные значения для таблицы показателей...

    public measuresX: string[] = ["distance", "elapsedDuration"];
    public measuresY: string[] = ["heartRate", "speed", "power", "altitude"];
    private measuresSecondary: string[] = ["timestamp", "duration"];

    /**
     *
     * @param sportBasic
     * @param calcMeasure
     * @param details
     */
    constructor(private sportBasic: string, private calcMeasure: ICalcMeasures, private details: IActivityDetails) {

        let array: string[];

        array = copy(this.measuresY);
        array.forEach((key) => {
            if (this.details.measures.hasOwnProperty(key) &&
                (this.calcMeasure.hasOwnProperty(key) && this.calcMeasure[key].value > 0)) {
                this.measures[key] = this.details.measures[key];
                this.measures[key].show = true;
                if (this.calcMeasure[key] && this.calcMeasure[key].hasOwnProperty("minValue")) {
                    this.maxValue[key] = {
                        max: this.calcMeasure[key].maxValue,
                        min: this.calcMeasure[key].minValue,
                    };
                }
            } else {
                this.measuresY.splice(this.measuresY.indexOf(key), 1);
            }
        });

        array = copy(this.measuresX);
        array.forEach((key) => {
            if (this.details.measures.hasOwnProperty(key) &&
                (!this.calcMeasure.hasOwnProperty(key) || (this.calcMeasure.hasOwnProperty(key) && this.calcMeasure[key].value > 0))) {
                this.measures[key] = this.details.measures[key];
                this.measures[key].show = true;
            } else {
                this.measuresX.splice(this.measuresX.indexOf(key), 1);
            }
        });

        this.measuresSecondary.forEach((key) => {
            this.measures[key] = this.details.measures[key];
            this.measures[key].show = true;
        });

        this.details.metrics.forEach((info) => {
            const cleaned = {};
            for (const key in this.measures) {
                const measure: Measure = new Measure(key, this.sportBasic);
                cleaned[key] = measure.isPace() ?
                    Math.max(info[this.measures[key].idx], getSportLimit(this.sportBasic, key).min) :
                    info[this.measures[key].idx];
            }
            this.data.push(cleaned);
        });

    }
}

/**
 * Тренировка имеет план?
 * @param item
 */
export const isSpecifiedActivity = (item: ICalendarItem): boolean => {
    const intervalP: IActivityIntervalP[] = item.activityHeader.intervals.filter((i) => i.type === "P") as IActivityIntervalP[];
    const intervalPW: IActivityIntervalPW = item.activityHeader.intervals.filter((i) => i.type === "pW")[0] as IActivityIntervalPW;
    return (!!intervalP && intervalP.length > 0) ||
        (!!intervalPW && (intervalPW.durationValue > 0 || intervalPW.intensityLevelFrom > 0));
};

/**
 * Тренировака является выполненной?
 * @param item
 * @returns {boolean}
 */
export const isCompletedActivity = (item: ICalendarItem): boolean => {
    const intervalW: IActivityIntervalPW = item.activityHeader.intervals.filter((i) => i.type === "W")[0] as IActivityIntervalPW;
    return (!!intervalW && Object.keys(intervalW.calcMeasures)
            .filter((m) => intervalW.calcMeasures[m].value || intervalW.calcMeasures[m].minValue ||
                intervalW.calcMeasures[m].maxValue || intervalW.calcMeasures[m].avgValue).length > 0);
};

/**
 * Очиащем фактические данные по тренировке
 * @param item
 * @returns {ICalendarItem}
 */
export const clearActualDataActivity = (item: ICalendarItem): ICalendarItem => {
    if (item.calendarItemType !== "activity") {
        return item;
    }
    item.activityHeader.intervals = item.activityHeader.intervals.filter((i) => i.type === "pW" || i.type === "P");
    delete item.activityHeader.intervals.filter((i) => i.type === "pW")[0].calcMeasures.completePercent.value;
    return item;
};

export const updateIntensity = (item: ICalendarItem, trgZones: ITrainingZones): ICalendarItem => {
    // TODO for interval P
    const intervalPW: IActivityIntervalPW = item.activityHeader.intervals.filter((i) => i.type === "pW")[0] as IActivityIntervalPW;
    const sport: string = item.activityHeader.activityType.code;
    const measure: string = intervalPW.intensityMeasure;
    const ftp: number = getFTP(trgZones, measure, sport);
    if (!intervalPW || !trgZones || !measure || !sport) {
        return item;
    }
    console.log(ftp);
    intervalPW.intensityLevelFrom = intervalPW.intensityByFtpFrom * ftp;
    intervalPW.intensityLevelTo = intervalPW.intensityByFtpTo * ftp;
    return item;
};

export const changeUserOwner = (item: ICalendarItem, user: IUserProfile): ICalendarItem => {
    item.userProfileOwner = profileShort(user);
    return item;
};

export const shiftDate = (item: ICalendarItem, shift: number) => {
    item.dateStart = moment(item.dateStart, "YYYY-MM-DD").add(shift, "d").format("YYYY-MM-DD");
    item.dateEnd = moment(item.dateEnd, "YYYY-MM-DD").add(shift, "d").format("YYYY-MM-DD");
    return item;
};
