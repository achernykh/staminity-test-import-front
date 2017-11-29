import {copy} from "angular";
import {ICalendarDay} from "../calendar.interface";

export interface ICalendarWeekSummary {
    fact: {
        distance: number;
        movingDuration: number;
    };
    plan: {
        distance: number;
        movingDuration: number;
    };
}

export interface ICalendarWeekTotal {
    [code: string]: ICalendarWeekSummary;
};

const searchMeasure = (point, interval) => {
    if (point === "plan") {
        if (interval.durationMeasure === "movingDuration"){
            return [0,interval.durationValue];
        } else {
            return [interval.durationValue,0];
        }
    } else {
        return [
            (interval.calcMeasures.hasOwnProperty("distance") && interval.calcMeasures.distance.hasOwnProperty("value") && interval.calcMeasures.distance.value) || 0,
            (interval.calcMeasures.hasOwnProperty("movingDuration") && interval.calcMeasures.movingDuration.hasOwnProperty("value") && interval.calcMeasures.movingDuration.value) ||
            (interval.calcMeasures.hasOwnProperty("duration") && interval.calcMeasures.duration.hasOwnProperty("value") && interval.calcMeasures.duration.value) || 0];
    }
};

export const calculateCalendarTotals = (items: ICalendarDay[]):ICalendarWeekTotal => {
    let total: ICalendarWeekTotal = {};
    let sport = null;
    let distance = 0, movingDuration = 0;
    let totalTemplate: ICalendarWeekSummary = {fact: {distance: 0,movingDuration: 0},plan: {distance: 0,movingDuration: 0}};
    let primarySport = ["run", "bike", "swim"];

    items.forEach((day) => day.data.calendarItems.filter((item) => item.calendarItemType === "activity")
        .forEach((item) => {
            sport = item.activityHeader.activityType.typeBasic;
            sport = (primarySport.indexOf(sport) !== -1 && sport) || "other";
            item.activityHeader.intervals.filter((interval) => interval.type === "W" || interval.type === "pW")
                .forEach((interval) => {
                    let point = interval.type === "W" ? "fact" : "plan";
                    if (!total.hasOwnProperty(sport)) {
                        total[sport] = copy(totalTemplate);
                    }
                    [distance, movingDuration] = searchMeasure(point,interval);
                    total[sport][point].distance = total[sport][point].distance + distance;
                    total[sport][point].movingDuration = total[sport][point].movingDuration + movingDuration;
                });
        }),
    );
    return total;
};

export const calculateCalendarSummary = (total: any):ICalendarWeekSummary => {

    let summary: ICalendarWeekSummary = {fact: {distance: 0,movingDuration: 0},plan: {distance: 0,movingDuration: 0}};

    Object.keys(total).forEach((sport) => {
        if (total[sport].hasOwnProperty("fact")){
            summary.fact.distance +=
                (total[sport].fact.hasOwnProperty("distance") &&
                total[sport].fact.distance) || 0;
            summary.fact.movingDuration +=
                (total[sport].fact.hasOwnProperty("movingDuration") &&
                total[sport].fact.movingDuration) || 0;
        }
        if (total[sport].hasOwnProperty("plan")){
            summary.plan.distance +=
                (total[sport].plan.hasOwnProperty("distance") &&
                total[sport].plan.distance) || 0;
            summary.plan.movingDuration +=
                (total[sport].plan.hasOwnProperty("movingDuration") &&
                total[sport].plan.movingDuration) || 0;
        }
    });

    return summary;
};