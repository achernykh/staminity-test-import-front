import { ActivityIntervalPW } from "@app/activity/activity-datamodel/activity.interval-pw";
/**
 *
 * @param: sport
 * @param measure
 * @param ftpMode
 */
export const measurePrintIntesivity = ["$filter", ($filter) =>
   (interval: ActivityIntervalPW,
    sport: string,
    measure: string,
    ftpMode: boolean = false) => {

        debugger;

        if (ftpMode) {
            if (interval.intensityByFtpFrom === interval.intensityByFtpTo) {
                return $filter('percent')(interval.intensityByFtpFrom);
            } else {
                return `${$filter('percent')(interval.intensityByFtpFrom,0,false)}-${$filter('percent')(interval.intensityByFtpTo)}`;
            }
        } else {

        }

        /**if (!interval.hasOwnProperty("intensityLevelFrom") || !interval.hasOwnProperty("intensityLevelTo")) {
            return null;
        }
        //const measure: Measure = new Measure(name, sport, input.intensityLevelFrom);
        if (interval.intensityLevelFrom === interval.intensityLevelTo) {
            return $filter("measureCalc")(interval.intensityLevelFrom, sport, name);
        } else if (measure.isPace()) {
            return $filter("measureCalc")(interval.intensityLevelTo, sport, name) + "-" + $filter("measureCalc")(interval.intensityLevelFrom, sport, name);
        } else {
            return $filter("measureCalc")(interval.intensityLevelFrom, sport, name) + "-" + $filter("measureCalc")(interval.intensityLevelTo, sport, name);
        }**/
    }
];