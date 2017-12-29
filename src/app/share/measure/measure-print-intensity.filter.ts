import { ActivityIntervalPW } from "@app/activity/activity-datamodel/activity.interval-pw";
import { Measure } from "./measure.constants";
/**
 *
 * @param: sport
 * @param measure
 * @param ftpMode
 */
export const measurePrintIntensity = [ "$filter", ($filter) =>
    (interval: ActivityIntervalPW,
     sport: string,
     measureCode: string,
     ftpMode: boolean = false) => {

        const measure: Measure = new Measure(measureCode, sport, interval.intensityLevelFrom);
        if (ftpMode && interval.hasOwnProperty("intensityByFtpFrom") && interval.hasOwnProperty("intensityByFtpTo")) {
            // задоно одиночным значением
            if (interval.intensityByFtpFrom * 100 === interval.intensityByFtpTo * 100) {
                return `${$filter('number')(interval.intensityByFtpFrom * 100, 0)}%`;
            } else { // задано интервалом
                return `${$filter('number')(interval.intensityByFtpFrom * 100, 0)}-${$filter('number')(interval.intensityByFtpTo * 100, 0)}%`;
                //return `${$filter('percent')(interval.intensityByFtpFrom,0,false)}-${$filter('percent')(interval.intensityByFtpTo)}`;
            }
        } else if (interval.hasOwnProperty("intensityLevelFrom") && interval.hasOwnProperty("intensityLevelTo")) {
            // задано одиночным значением
            if (interval.intensityLevelFrom * 100 === interval.intensityLevelTo * 100) {
                return $filter("measureCalc")(interval.intensityLevelFrom, sport, measureCode);
            } else if (measure.isPace()) {
                return `${$filter("measureCalc")(interval.intensityLevelTo, sport, measureCode)}-s${$filter("measureCalc")(interval.intensityLevelFrom, sport, measureCode)}`;
            } else {
                return `${$filter("measureCalc")(interval.intensityLevelFrom, sport, measureCode)}-${$filter("measureCalc")(interval.intensityLevelTo, sport, measureCode)}`;
            }
        } else {
            return null;
        }
    }
];