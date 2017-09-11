import {ICalendarWeek, ICalendarDay} from "../calendar.component";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {copy} from 'angular';
import {IActivityIntervalPW} from "../../../../api/activity/activity.interface";
import {ActivityIntervalPW} from "../../activity/activity-datamodel/activity.interval-pw";
import {ActivityIntervalW} from "../../activity/activity-datamodel/activity.interval-w";

interface ICalendarWeekSummary {
    fact: {
        distance: number;
        movingDuration: number;
        specified: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
    };
    plan: {
        distance: number;
        movingDuration: number;
        specified: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
    };
}

class CalendarWeekSummary implements ICalendarWeekSummary{
    public fact: {
        distance: number;
        movingDuration: number;
        specified: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
    } = {
        distance: 0,
        movingDuration: 0,
        specified: 0,
        completePercent: 0,
        completed: 0,
        completedOnToday: 0
    };
    public plan: {
        distance: number;
        movingDuration: number;
        specified: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
    } = {
        distance: 0,
        movingDuration: 0,
        specified: 0,
        completePercent: 0,
        completed: 0,
        completedOnToday: 0
    };

}


interface ICalendarWeekTotal {
    [code: string]: ICalendarWeekSummary;
};

const getSummaryFromInterval = (point: string, interval, itemDate: string): Array<number> => {

    let distance: number;
    let movingDuration: number;
    let specified: number = 0;
    let completed: number = 0;
    let completePercent: number = 0;

    if (point === 'plan') {
        specified ++;

        completed = interval.hasOwnProperty('calcMeasures') && interval.calcMeasures.hasOwnProperty('completePercent') &&
            interval.calcMeasures.completePercent.hasOwnProperty('value') && 1 || 0;

        completePercent = completed > 0 && interval.calcMeasures.completePercent.value || null;

        distance = interval.hasOwnProperty('distanceLength') && interval.distanceLength ||
                interval.durationMeasure === 'distance' && interval.durationValue || null;

        movingDuration = interval.hasOwnProperty('movingDuration') && interval.movingDurationLength ||
            interval.durationMeasure === 'movingDuration' && interval.durationValue || null;

    } else {
        completed ++;
        distance = interval.calcMeasures.hasOwnProperty('distance') &&
            interval.calcMeasures.distance.hasOwnProperty('value') && interval.calcMeasures.distance.value || 0;

        movingDuration = (interval.calcMeasures.hasOwnProperty('movingDuration') && interval.calcMeasures.movingDuration.hasOwnProperty('value') && interval.calcMeasures.movingDuration.value) ||
        (interval.calcMeasures.hasOwnProperty('duration') && interval.calcMeasures.duration.hasOwnProperty('value') && interval.calcMeasures.duration.value) || 0;
    }

    return [distance, movingDuration, specified, completePercent, 0, completed];

};

const searchMeasure = (point, interval) => {
    if (point === 'plan') {
        if (interval.durationMeasure === 'movingDuration'){
            return [0,interval.durationValue];
        } else {
            return [interval.durationValue,0];
        }
    } else {
        return [
            (interval.calcMeasures.hasOwnProperty('distance') && interval.calcMeasures.distance.hasOwnProperty('value') && interval.calcMeasures.distance.value) || 0,
            (interval.calcMeasures.hasOwnProperty('movingDuration') && interval.calcMeasures.movingDuration.hasOwnProperty('value') && interval.calcMeasures.movingDuration.value) ||
            (interval.calcMeasures.hasOwnProperty('duration') && interval.calcMeasures.duration.hasOwnProperty('value') && interval.calcMeasures.duration.value) || 0];
    }
};

export class CalendarWeekData {

    private _summary: ICalendarWeekSummary;
    private _total: ICalendarWeekTotal;
    private _items: Array<ICalendarItem> = [];

    constructor(week: ICalendarWeek) {
        this._items = (week.hasOwnProperty('subItem') && week.subItem) &&
            this.getItems(week.subItem).filter(i => i.calendarItemType === 'activity');

        this._total =  this._items.length > 0 && this.calcTotal();
        this._summary = this._items.length > 0 && this.calcSummary();
    }

    get summary(): ICalendarWeekSummary {
        return this._summary;
    }

    get total(): ICalendarWeekTotal {
        return this._total;
    }

    getItems(days: Array<ICalendarDay>):Array<ICalendarItem>{
        let items: Array<ICalendarItem> = [];
        days.map(d =>
            d.data.calendarItems && d.data.calendarItems.length > 0 && items.push(...d.data.calendarItems));
        return items;
    }

    calcSummary(): ICalendarWeekSummary {
        let summary: ICalendarWeekSummary = new CalendarWeekSummary();

        Object.keys(this._total).forEach((sport) => {
            if (this._total[sport].hasOwnProperty('fact')){
                summary.fact.distance +=
                    (this._total[sport].fact.hasOwnProperty('distance') &&
                    this._total[sport].fact.distance) || 0;
                summary.fact.movingDuration +=
                    (this._total[sport].fact.hasOwnProperty('movingDuration') &&
                    this._total[sport].fact.movingDuration) || 0;
            }
            if (this._total[sport].hasOwnProperty('plan')){
                summary.plan.distance +=
                    (this._total[sport].plan.hasOwnProperty('distance') &&
                    this._total[sport].plan.distance) || 0;
                summary.plan.movingDuration +=
                    (this._total[sport].plan.hasOwnProperty('movingDuration') &&
                    this._total[sport].plan.movingDuration) || 0;
            }
        });

        return summary;

    }

    calcTotal(): ICalendarWeekTotal {
        let total: ICalendarWeekTotal = {};
        let sport = null;
        let distance = 0, movingDuration = 0, completed = 0, completePercent = 0, specified = 0, completedOnToday = 0;
        let totalTemplate: ICalendarWeekSummary = new CalendarWeekSummary();
        let primarySport = ['run', 'bike', 'swim'];

        this._items.forEach(item => {
            sport = item.activityHeader.activityType.typeBasic;
            sport = (primarySport.indexOf(sport) !== -1 && sport) || 'other';
            item.activityHeader.intervals.filter(interval => interval.type === 'W' || interval.type === 'pW')
                .forEach(interval => {
                    let point = interval.type === 'W' ? 'fact' : 'plan';
                    if (!total.hasOwnProperty(sport)) {
                        total[sport] = copy(totalTemplate);
                    }
                    //[distance, movingDuration] = searchMeasure(point,interval);
                    [distance, movingDuration, specified, completePercent, completedOnToday, completed] = [...getSummaryFromInterval(point, interval, item.dateStart)];
                    total[sport][point].distance = total[sport][point].distance + distance;
                    total[sport][point].movingDuration = total[sport][point].movingDuration + movingDuration;
                    total[sport][point].specified = total[sport][point].specified + specified;
                    total[sport][point].completePercent = total[sport][point].completePercent + completePercent;
                    total[sport][point].completedOnToday = total[sport][point].completedOnToday + completedOnToday;
                    total[sport][point].completed = total[sport][point].completed + completed;
                });

        });

        return total;
    }

}