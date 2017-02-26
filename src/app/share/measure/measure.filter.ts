import moment from 'moment/src/moment.js';
import {
	_measurement,
	_activity_measurement_view,
	_measurement_calculate,
	_measurement_system_calculate,
	_measurement_pace_unit,
	isDuration,
	isPace,
	measurementUnit,
	measurementUnitView,
	measurementUnitDisplay
} from './measure.constants';
import {ISessionService} from "../../core/session.service";

export const measureView = ['SessionService', (SessionService:ISessionService) => (data, sport, measure, units) => {
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
		if (isDuration(unit) || isPace(unit)){
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
}];

export const duration = () => (second = 0) => {
	return moment().startOf('day').seconds(second).format('H:mm:ss');
};

