// import
import moment from "moment/src/moment.js";
import { SessionService } from "../../core/session/session.service";
import {
    _activity_measurement_view,
    _measurement,
    _measurement_calculate,
    _measurement_system_calculate,
    isDuration,
    isPace,
    Measure, measurementUnitDisplay, measurementUnit
} from "./measure.constants";

/**
 * Пересчет значений показателей
 * @param input - значение показателя
 * @param sport - базовый вид спорта
 * @param measure - название показателя
 * @param chart - перевод для графика?
 * @param units - система мер (метрическая/имперская
 * @returns {string} - результат пересчета
 */
export const measureValue =
    (input: number,
     sport: string,
     measure: string,
     chart: boolean = false,
     units: string = 'imperial') => {

        let session: SessionService = angular.element(document.body).injector().get('SessionService');
        units = session.getUser().userId && session.getUser().display.units || 'metric';

        if ( !!input ) {
            let unit = measurementUnitDisplay(sport, measure);
            let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed;

            // Необходимо пересчет единиц измерения
            if ( unit !== _measurement[measure].unit ) {
                input = _measurement_calculate[_measurement[measure].unit][unit](input);
            }

            // Необходим пересчет системы мер
            if ( units && units === 'imperial' && _measurement_system_calculate.hasOwnProperty(unit) ) {
                input = _measurement_system_calculate[unit].multiplier(input);
            }
            // Показатель релевантен для пересчета скорости в темп
            if ( !chart && (isDuration(unit) || isPace(unit)) ) {
                let format = input >= 60 * 60 ? 'HH:mm:ss' : 'mm:ss';
                let time = moment().startOf('day').millisecond(input * 1000).startOf('millisecond');

                if ( time.milliseconds() >= 500 ) {
                    time.add(1, 'second');
                }

                //console.log('measureCalc pace', isPace(unit), input, moment().startOf('day').millisecond(input*1000).startOf('millisecond').milliseconds());
                //return moment().startOf('day').millisecond(input*1000).startOf('millisecond').format(format);

                return time.format(format);
            }
            else {
                return Number(input).toFixed(fixed);
            }
        } else {
            return input;
        }
    };

export const measureUnit = (measure: string, sport?: string, units?: string): string => {
    let unit;
    let session: SessionService = angular.element(document.body).injector().get('SessionService');
    units = session.getUser().userId && session.getUser().display.units || 'metric';
    try {
        unit = measurementUnitDisplay(sport, measure);
        unit = (units && units === 'imperial' && _measurement_system_calculate.hasOwnProperty(unit)) ?
            _measurement_system_calculate[unit].unit :
            unit;

    } catch ( e ) {
        console.error('measureUnit error', e, measure, sport, units);
    }

    return unit;
};

export const measureCalcInterval = () =>
    (input: {intensityLevelFrom: number, intensityLevelTo: number},
     sport: string,
     name: string,
     chart: boolean = false,
     units: string = "metric") => {

        if ( !input.hasOwnProperty("intensityLevelFrom") || !input.hasOwnProperty("intensityLevelTo") ) {return null;}
        const measure: Measure = new Measure(name, sport, input.intensityLevelFrom);
        if ( input.intensityLevelFrom === input.intensityLevelTo ) {
            return measureValue(input.intensityLevelFrom, sport, name, chart, units);
        } else if ( measure.isPace() ) {
            return measureValue(input.intensityLevelTo, sport, name, chart, units) + "-" + measureValue(input.intensityLevelFrom, sport, name, chart, units);
        } else {
            return measureValue(input.intensityLevelFrom, sport, name, chart, units) + "-" + measureValue(input.intensityLevelTo, sport, name, chart, units);
        }
    };

export const measureEdit = () => (measure, value, sport) => {
    let unit = measurementUnitDisplay(sport, measure);
    if(isDuration(unit)) {
        return new Date(moment().startOf('day').seconds(value));
    } else if(isPace(unit)){
        return new Date(moment(measureValue(value,sport,measure),'mm:ss'));
    } else {
        return Number(measureValue(value, sport, measure));
    }
};

export const measureSave = (measure: string, value, sport: string) => {
    let session: SessionService = angular.element(document.body).injector().get('SessionService');
    let unit = measurementUnitDisplay(sport, measure);
    if (isDuration(unit)) {
        return moment(value, ["ss", "mm:ss", "hh:mm:ss"]).diff(moment().startOf("day"), "seconds");
    } else {
        if (isPace(unit)) {
            value = moment(value, ["ss", "mm:ss"]).diff(moment().startOf("day"), "seconds");
        }
        // обратный пересчет по системе мер
        if (session.getUser().display.units === "imperial" && _measurement_system_calculate[unit]) {
            let convertUnit: string = _measurement_system_calculate[unit].unit;
            value = _measurement_system_calculate[convertUnit].multiplier(value);
        }
        // пересчет от единиц представления в еденицы обмена данными
        if (unit !== measurementUnit(measure)) {
            value = _measurement_calculate[unit][measurementUnit(measure)](value);
        }
        return value;
    }

};
