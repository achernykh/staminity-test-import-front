import {
    _measurement,
    _activity_measurement_view,
    _measurement_calculate,
    _measurement_system_calculate,
    _measurement_pace_unit
} from '../calendar-item/activity.constants'

import {_MEASURE_TRANSLATE} from './measure.translate'

export let SharedModule = angular.module('staminity.shared', []);

// Перевод показателей и едениц измерений
SharedModule.config($translateProvider => {
    $translateProvider.translations('ru',_MEASURE_TRANSLATE.ru);
    $translateProvider.translations('en',_MEASURE_TRANSLATE.en);
})

/**
 *
 */
SharedModule.filter('measureCalc', (UserService)=> {
    return (data, sport, measure) => {
        if (!!data) {
            let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit
            let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed

            // Необходимо пересчет единиц измерения
            if (unit !== _measurement[measure].unit)
                data = _measurement_calculate[_measurement[measure].unit][unit](data)

            // Необходим пересчет системы мер
            if (UserService.profile.display.units !== 'metric')
                data = data * _measurement_system_calculate[unit].multiplier

            // Показатель релевантен для пересчета скорости в темп
            if (_measurement_pace_unit.indexOf(unit) !== -1)
                return moment().startOf('day').seconds(data).format('mm:ss')
            else
                return Number(data).toFixed(fixed)
        }
    }
})

/**
 *
 */
SharedModule.filter('measureUnit', (UserService)=> {
    return (measure, sport) => {
        let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit
        return (UserService.profile.display.units === 'metric') ? unit : _measurement_system_calculate[unit].unit
    }
})

SharedModule.filter('duration', ()=> {
    return (second = 0) => {
        return moment().startOf('day').seconds(second).format('H:mm:ss')
    }
})

