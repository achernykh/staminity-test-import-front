import moment from 'moment/min/moment-with-locales.js';
import {IFilterService} from 'angular';
import {measurementUnitDisplay, isDuration, isPace} from './measure.constants';

export const measureEditFilter = () => ($filter: IFilterService) => (measure, value, sport) => {
        let unit = measurementUnitDisplay(sport, measure);
        let measureCalc: Function = $filter("measureCalc") as Function;

        if(isDuration(unit)) {
            return new Date(moment().startOf('day').seconds(value));
        } else if(isPace(unit)){
            return new Date(moment(measureCalc(value,sport,measure),'mm:ss'));
        } else {
            return Number(measureCalc(value, sport, measure));
        }
};
