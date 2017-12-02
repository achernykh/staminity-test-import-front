import moment from "moment/src/moment.js";
import {SessionService} from "../../core";
import {
    _activity_measurement_view,
    _measurement,
    _measurement_calculate,
    _measurement_pace_unit,
    _measurement_system_calculate,
    isDuration,
    isPace,
    measurementUnit,
    measurementUnitDisplay,
    measurementUnitView,
} from "./measure.constants";
/*
export const measureView = ['SessionService', (SessionService:ISessionService) => (data, sport, measure, chart = false, units = 'metric') => {
    if (!!data) {
        let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit;
        let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed;

        // Необходимо пересчет единиц измерения
        if (unit !== _measurement[measure].unit){
            data = _measurement_calculate[_measurement[measure].unit][unit](data);
        }

        // Необходим пересчет системы мер
        if (units && units !== 'metric'){
            data = data * _measurement_system_calculate[unit].multiplier;
        }

        // Показатель релевантен для пересчета скорости в темп
        if (!chart && (isDuration(unit) || isPace(unit))){
            let format = data >= 60*60 ? 'hh:mm:ss' : 'mm:ss';
            return moment().startOf('day').seconds(data).format(format);
        }
        else {
            return Number(data).toFixed(fixed);
        }
    }
}];

export const measureUnit = ['SessionService', (SessionService:ISessionService) => (measure, sport, units) => {
    let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit;
    return (units && units !== 'metric') ? _measurement_system_calculate[unit].unit : unit;
}];*/

export const duration = () => (second = 0, round: string = "second") => {
    const time = moment().startOf("day").millisecond(second * 1000);
    if (round === "millisecond") {
        return time.format("HH:mm:ss.S");
    } else {
        return time.format("HH:mm:ss");
    }
};

export function peaksByTime(second: number): string {
    if (second < 60) {
        return `${moment().startOf("day").millisecond(second * 1000).format("ss")} с`;
    } else if (second < 60 * 60) {
        return `${moment().startOf("day").millisecond(second * 1000).format("mm")} мин`;
    } else {
        return `${Number(second / 60 / 60).toFixed(1)} ч`;
    }
};
