import {copy} from "angular";
import {ICalendarItem} from "../../../../api/calendar";
import {toDay} from "../../activity/activity-datamodel/activity.datamodel";
import {ICalendarDay, ICalendarWeek} from "../calendar.interface";

interface ICalendarWeekSummary {
    fact: {
        distance: number;
        movingDuration: number;
        specified: number;
        specifiedOnToday: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
        completePercentOnToday: number;
    };
    plan: {
        distance: number;
        movingDuration: number;
        specified: number;
        specifiedOnToday: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
        completePercentOnToday: number;

    };
}

class CalendarWeekSummary implements ICalendarWeekSummary {
    fact: {
        distance: number;
        movingDuration: number;
        specified: number;
        specifiedOnToday: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
        completePercentOnToday: number;
    } = {
        distance: 0,
        movingDuration: 0,
        specified: 0,
        specifiedOnToday: 0,
        completePercent: 0,
        completed: 0,
        completedOnToday: 0,
        completePercentOnToday: 0,
    };
    plan: {
        distance: number;
        movingDuration: number;
        specified: number;
        specifiedOnToday: number;
        completePercent: number;
        completed: number;
        completedOnToday: number;
        completePercentOnToday: number;
    } = {
        distance: 0,
        movingDuration: 0,
        specified: 0,
        specifiedOnToday: 0,
        completePercent: 0,
        completed: 0,
        completedOnToday: 0,
        completePercentOnToday: 0,
    };

}

interface ICalendarWeekTotal {
    [sport: string]: ICalendarWeekSummary;
};

const getSummaryFromInterval = (point: string, interval, itemDate: string): number[] => {

    let distance: number;
    let movingDuration: number;
    let specified: number = 0;
    let specifiedOnToday: number = 0;
    let completed: number = 0;
    let completePercent: number = 0;
    let completedOnToday: number = 0;
    let completePercentOnToday: number = 0;
    const coming: boolean = toDay(new Date(itemDate)).getTime() > toDay(new Date().setDate(new Date().getDate() - 1)).getTime();

    //console.log(itemDate, toDay(new Date(itemDate)).getTime(), toDay(new Date()).getTime());

    if (point === "plan") {
        specified ++;

        specifiedOnToday = !coming && 1;

        completed = interval.hasOwnProperty("calcMeasures") && interval.calcMeasures.hasOwnProperty("completePercent") &&
            interval.calcMeasures.completePercent.hasOwnProperty("value") && 1 || 0;

        completedOnToday = !coming && completed > 0 && 1;

        completePercent = completed > 0 && interval.calcMeasures.completePercent.value || null;

        completePercentOnToday = !coming && completePercent;

        distance = interval.hasOwnProperty("distanceLength") && interval.distanceLength ||
                interval.durationMeasure === "distance" && interval.durationValue || null;

        movingDuration =
            (interval.hasOwnProperty("movingDurationLength") && interval.movingDurationLength) ||
            ((interval.durationMeasure === "duration" || interval.durationMeasure === "movingDuration") && interval.durationValue) ||
            null;

    } else {
        completed ++;
        distance = interval.calcMeasures.hasOwnProperty("distance") &&
            interval.calcMeasures.distance.hasOwnProperty("value") && interval.calcMeasures.distance.value || 0;

        movingDuration = (interval.calcMeasures.hasOwnProperty("movingDuration") && interval.calcMeasures.movingDuration.hasOwnProperty("value") && interval.calcMeasures.movingDuration.value) ||
        (interval.calcMeasures.hasOwnProperty("duration") && interval.calcMeasures.duration.hasOwnProperty("value") && interval.calcMeasures.duration.value) || 0;
    }

    return [distance, movingDuration, specified, specifiedOnToday, completed, completePercent, completedOnToday, completePercentOnToday];

};

const searchMeasure = (point, interval) => {
    if (point === "plan") {
        if (interval.durationMeasure === "movingDuration" && interval.durationMeasure === "duration") {
            return [0, interval.durationValue];
        } else {
            return [interval.durationValue, 0];
        }
    } else {
        return [
            (interval.calcMeasures.hasOwnProperty("distance") && interval.calcMeasures.distance.hasOwnProperty("value") && interval.calcMeasures.distance.value) || 0,
            (interval.calcMeasures.hasOwnProperty("movingDuration") && interval.calcMeasures.movingDuration.hasOwnProperty("value") && interval.calcMeasures.movingDuration.value) ||
            (interval.calcMeasures.hasOwnProperty("duration") && interval.calcMeasures.duration.hasOwnProperty("value") && interval.calcMeasures.duration.value) || 0];
    }
};

export class CalendarWeekData {

    private _summary: ICalendarWeekSummary;
    private _total: ICalendarWeekTotal;
    private _items: ICalendarItem[] = [];

    private readonly primarySport: [string] = ["run", "bike", "swim", "ski", "rowing", "other"];
    private readonly statusLimit: { warn: number, error: number} = { warn: 10, error: 20 };

    constructor(week: ICalendarWeek) {
        this._items = (week.hasOwnProperty("subItem") && week.subItem) && this.getItems(week.subItem);

        this._total =  this._items.length > 0 && this.calcTotal();
        this._summary = this._items.length > 0 && this.calcSummary();
    }

    get summary(): ICalendarWeekSummary {
        return this._summary;
    }

    get total(): ICalendarWeekTotal {
        return this._total;
    }

    getItems(days: ICalendarDay[]): ICalendarItem[] {
        const items: ICalendarItem[] = [];
        days.map(d => d.data.calendarItems && d.data.calendarItems.length > 0 &&
            d.data.calendarItems.map(i => i.calendarItemType === 'competition' && items.push(...i.calendarItems) || items.push(i)));
        return items.length > 0 && items.filter(i => i.calendarItemType === "activity");
    }

    calcSummary(): ICalendarWeekSummary {
        const summary: ICalendarWeekSummary = new CalendarWeekSummary();

        Object.keys(this._total).forEach((sport) => {
            Object.keys(this._total[sport]).forEach((point) => {
                Object.keys(this._total[sport][point]).forEach((key) => {
                    summary[point][key] += this._total[sport][point].hasOwnProperty(key) && this._total[sport][point][key] || 0;
                });
            });
        });

        return summary;

    }

    calcTotal(): ICalendarWeekTotal {
        const total: ICalendarWeekTotal = {};
        let sport = null;
        let distance = 0, movingDuration = 0, completed = 0, completePercent = 0, specified = 0, specifiedOnToday = 0,
            completedOnToday = 0, completePercentOnToday = 0;
        const totalTemplate: ICalendarWeekSummary = new CalendarWeekSummary();

        this._items.forEach((item) => {
            sport = item.activityHeader.activityType.typeBasic;
            sport = (this.primarySport.indexOf(sport) !== -1 && sport) || "other";
            item.activityHeader.intervals.filter((interval) => interval.type === "W" || interval.type === "pW")
                .forEach((interval) => {
                    const point = interval.type === "W" ? "fact" : "plan";
                    if (!total.hasOwnProperty(sport)) {
                        total[sport] = copy(totalTemplate);
                    }
                    //[distance, movingDuration] = searchMeasure(point,interval);
                    [distance, movingDuration, specified, specifiedOnToday,
                        completed, completePercent, completedOnToday, completePercentOnToday] =
                        [...getSummaryFromInterval(point, interval, item.dateStart)];

                    total[sport][point].distance = total[sport][point].distance + distance;
                    total[sport][point].movingDuration = total[sport][point].movingDuration + movingDuration;
                    total[sport][point].specified = total[sport][point].specified + specified;
                    total[sport][point].specifiedOnToday = total[sport][point].specifiedOnToday + specifiedOnToday;
                    total[sport][point].completed = total[sport][point].completed + completed;
                    total[sport][point].completePercent = total[sport][point].completePercent + completePercent;
                    total[sport][point].completedOnToday = total[sport][point].completedOnToday + completedOnToday;
                    total[sport][point].completePercentOnToday = total[sport][point].completePercentOnToday + completePercentOnToday;

                });

        });

        return total;
    }

    hasSummary(): boolean {
        return this._summary &&
            (this._summary.plan.specified > 0 || this._summary.fact.completed > 0) || false;
    }

    get hasMoreThenOneSport (): boolean {
        return this._total && Object.keys(this._total).length > 1;
    }

    hasTotalBySport(sport: string): boolean {
        return this._total && this._total.hasOwnProperty(sport) &&
            (this._total[sport].plan.specified > 0 || this._total[sport].fact.completed > 0) || false;
    }

    totalStatus(sport: string): string {
        const percent: number = this.totalPercent(sport);
        return this._total && this._total.hasOwnProperty(sport) && percent &&
            ((Math.abs(100 - percent) <= this.statusLimit.warn && percent > 0) && "complete") ||
            ((Math.abs(100 - percent) <= this.statusLimit.error && percent > 0) && "complete-warn") ||
            ((Math.abs(100 - percent) > this.statusLimit.error && percent > 0)  && "complete-error") || "coming";

    }

    totalPercent(sport: string): number {
        return this._total && this._total.hasOwnProperty(sport) &&
                100 * this._total[sport].plan.completePercentOnToday / this._total[sport].plan.specifiedOnToday;
    }

    totalPercentByCount(sport: string): number {
        return this._total && this._total.hasOwnProperty(sport) &&
                100 * this._total[sport].plan.completedOnToday / this._total[sport].plan.specified;
    }

    summaryStatus(): string {
        const percent: number = this.summaryPercent();
        return this._summary && percent &&
            ((Math.abs(100 - percent) <= this.statusLimit.warn && percent > 0) && "complete") ||
            ((Math.abs(100 - percent) <= this.statusLimit.error && percent > 0) && "complete-warn") ||
            ((Math.abs(100 - percent) > this.statusLimit.error && percent > 0)  && "complete-error") || "coming";
    }

    summaryPercent(): number {
        return this._summary &&
            100 * this._summary.plan.completePercentOnToday / this._summary.plan.specifiedOnToday;
    }

    summaryPercentByCount(): number {
        return this._summary &&
            100 * this._summary.plan.completedOnToday / this._summary.plan.specified;
    }

}
