import {IFilterService} from 'angular';
import {Measure} from './measure.constants';
export const measureCalcIntervalFilter = () => ($filter: IFilterService) => {
    return (input: {intensityLevelFrom: number, intensityLevelTo: number}, sport: string, name: string, chart: boolean = false, units: string = "metric") => {
        if (!input.hasOwnProperty("intensityLevelFrom") || !input.hasOwnProperty("intensityLevelTo")) {
            return null;
        }
        const measure: Measure = new Measure(name, sport, input.intensityLevelFrom);
        let measureCalc: Function = $filter("measureCalc") as Function;

        if (input.intensityLevelFrom === input.intensityLevelTo) {
            return measureCalc(input.intensityLevelFrom, sport, name, chart, units);
        } else if (measure.isPace()) {
            return measureCalc(input.intensityLevelTo, sport, name, chart, units) + "-" + measureCalc(input.intensityLevelFrom, sport, name, chart, units);
        } else {
            return measureCalc(input.intensityLevelFrom, sport, name, chart, units) + "-" + measureCalc(input.intensityLevelTo, sport, name, chart, units);
        }
    };
};