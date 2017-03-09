import {merge, IScope, IDirective, IAttributes, IAugmentedJQuery, INgModelController, IFilterService} from 'angular';
import {Measure} from "./measure.constants";
import moment from 'moment/src/moment.js';

const toPaceInterval = (input) => {
	if (typeof input === 'undefined') {
		return null;
	}

	let pace = input.replace(/[^0-9]/g, '');
	console.log('mask=',pace);

	if (pace.length < 3) {
		return pace;
	} else if (pace.length >= 3 && pace.length < 5) {
		return pace.substr(0,2) + ':' + pace.substr(2);
	} else if (pace.length >= 5 && pace.length < 7) {
		return pace.substr(0,2) + ':' + pace.substr(2,2) + '-' + pace.substr(4);
	} else if (pace.length >= 7 && pace.length < 9) {
		return pace.substr(0,2) + ':' + pace.substr(2,2) + '-' + pace.substr(4,2) + ':' + pace.substr(6);
	} else {
		return pace.substr(0,2) + ':' + pace.substr(2,2) + '-' + pace.substr(4,2) + ':' + pace.substr(6,2);
	}
};

const toPace = (input) => {
	let pace = input.replace(/[^0-9]/g, '');

	if (pace.length < 3) {
		return pace;
	} else {
		return pace.substr(0,2) + ':' + pace.substr(2,2);
	}
};

const toDuration = (input) => {
	let time = input.replace(/[^0-9]/g, '');
	if (time.length < 3) {
		return time;
	} else if (time.length >= 3 && time.length < 5) {
		return time.substr(0,2) + ':' + time.substr(2);
	} else if (time.length >= 5 && time.length < 7) {
		return time.substr(0,2) + ':' + time.substr(2,2) + ':' + time.substr(4);
	} else {
		return time.substr(0,2) + ':' + time.substr(2,2) + ':' + time.substr(4,2);
	}
};

const toNumber = (input) => {
	return input.replace(/[^\d.,]/g,'');
};

const toNumberInterval = (input) => {
	console.log(`toNumberInterval input=${input} reg=${input.replace(/[^\d\-]/g,'')}`);
	return input.replace(/[^\d\-]/g,'');
};

const convertToDuration = (input: string):string => {
	//console.log('convertToDuration=', input, Number(input), isFinite(Number(input)), moment().startOf('day').minutes(Number(input)).format('HH:mm:ss'));
	//console.log('convertToDuration=', input, moment().startOf('day').minutes(input).format('HH:mm:ss'));
	return isFinite(Number(input)) ?  moment().startOf('day').minutes(Number(input)).format('HH:mm:ss') : input;
};


/**
 * Директива для ввода значения по показателям тренировки
 * Использует следующие параметры в input:
 * - measure-input{string} - активация директивы с указанием показателя
 * - sport{string} - базовый вид спорта, используется в расчетах и преобразованиях
 * - interval{boolean} - индикатор ввода интервала, true - interval, false - single
 *
 * @param $filter
 * @returns {{require: string, link: (($scope:IScope, $element:IAugmentedJQuery, $attrs:IAttributes, $ctrl:INgModelController)=>undefined)}}
 * @constructor
 */
export function MeasurementInput($filter): IDirective {

	function link($scope: IScope, $element: IAugmentedJQuery, $attrs: IAttributes, $ctrl: INgModelController) {

		let measure:Measure = null;
		let initial: Object = {};
		let mask: any; //функция преобразование ввода по маске
		let convert: any; //функция преобразования значения после потери фокуса

		// Преобразование для ввода пульса
		const paceIntervalParsers = (value) => {
			console.log('$parsers=',value);

			let sep = value.search('-');
			let from, to;
			if(sep !== -1){
				from = value.substr(0,sep);
				to = value.substr(sep+1,5);
			} else {
				from = to = value.substr(0,5);
			}

			console.log('change pace parsers ', value, value.length, sep, from,to);
			if (value.length === 0) {
				from = to = 0;
			}
			$ctrl.$modelValue = null;
			return Object.assign(initial, {
				from: $filter('measureSave')(measure.name, from, measure.sport),
				to: $filter('measureSave')(measure.name, to, measure.sport)
			});

		};

		const numberIntervalParsers = (value) => {
			let sep = value.search('-');
			let from, to;
			if(sep !== -1){
				from = value.substr(0,sep);
				to = value.substr(sep+1);
			} else {
				from = to = value;
			}
			console.log('change parsers ', value, value.length, sep, from,to);
			$ctrl.$modelValue = null;
			return Object.assign(initial, {
				from: $filter('measureSave')(measure.name, Number(from), measure.sport),
				to: $filter('measureSave')(measure.name, Number(to), measure.sport)
			});
		};

		const paceParsers = (value) => {
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const durationParsers = (value) => {
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const paceIntervalFormatters = (value: {from: number, to: number}) => {
			console.log('check pace interval formatters', value);
			if(value && value.hasOwnProperty('from') && value.hasOwnProperty('to')) {
				initial = value;
				return (value.from !== value.to) ?
					$filter('measureCalc')(value.from, measure.sport, measure.name)+'-'+$filter('measureCalc')(value.to, measure.sport, measure.name):
					$filter('measureCalc')(value.from, measure.sport, measure.name);
			} else {
				initial = {from: null, to: null};
				return initial;
			}
		};

		const numberIntervalFormatters = (value: {from: number, to: number}) => {
			if(value && value.hasOwnProperty('from') && value.hasOwnProperty('to')) {
				initial = value;
				return (value.from !== value.to) ?
				$filter('measureCalc')(value.from, measure.sport, measure.name)+'-'+$filter('measureCalc')(value.to, measure.sport, measure.name):
					$filter('measureCalc')(value.from, measure.sport, measure.name);
			} else {
				initial = {from: null, to: null};
				return initial;
			}
		};

		const paceFormatters = (value) => {
			return (!!value && $filter('measureCalc')(value, measure.sport, measure.name)) || null;
		};

		const durationFormatters = (value) => {
			return (!!value && $filter('measureCalc')(value, measure.sport, measure.name)) || null;
		};

		const paceIntervalValidators = (model: {from: number, to: number},view) => {
			console.log('check pace interval validators', model, typeof model, model.from, model.to);
			return (model && model.hasOwnProperty('from') && model.hasOwnProperty('to')) &&
				(model.from >= model.to);
		};

		const numberIntervalValidators = (model: {from: number, to: number},view) => {
			console.log('check number interval validators', model.from, model.to, model.from <= model.to);
			return model && model.hasOwnProperty('from') && model.hasOwnProperty('to') && model.from <= model.to;
		};

		const paceValidators = (model,view) => {
			return true;
		};

		const durationValidators = (model,view) => {
			//console.log('durationValidators',moment(view, ["HH:mm:ss", "mm:ss"]).isValid(), isFinite(Number(view)));
			return moment(view, ["HH:mm:ss", "mm:ss"]).isValid() || isFinite(Number(view));
		};

		// Для обновляние viewValue добавляем $render
		$element.on('keyup change', () => {
			if (!!$ctrl.$viewValue && !!mask) {
				$ctrl.$setViewValue(mask($ctrl.$viewValue));
			}
			$ctrl.$render();
		});

		$element.on('blur', () => {
			if (measure.type === 'duration' && isFinite(Number($ctrl.$viewValue))) {
				console.log('duration blur', $ctrl.$viewValue, $ctrl.$modelValue);
				$ctrl.$setViewValue(convert($ctrl.$viewValue));
				//if(typeof Number($ctrl.$viewValue) === 'number') {
					$ctrl.$modelValue = $ctrl.$modelValue * 60;
				//}
			}
			$ctrl.$render();
		});

		// Тип измерения для ввода определяется в атрибуте <input>, в виде
		// ng-attr-measure-input={{expression = measure}} ng-attr-sport={{expression = sport}}
		if ($attrs['measureInput'] && $attrs['sport']) {
			measure = new Measure($attrs['measureInput'], $attrs['sport']);
			//console.log('measure = ', measure.name, measure.type, maskFunction(measure.type, JSON.parse($attrs['interval'])));
			switch (measure.type){
				case 'pace': {
					if(JSON.parse($attrs['interval'])){
						$ctrl.$validators['pace'] = paceIntervalValidators;
						$ctrl.$formatters.push(paceIntervalFormatters);
						$ctrl.$parsers.push(paceIntervalParsers);
						mask = toPaceInterval;
					} else {
						$ctrl.$validators['pace'] = paceValidators;
						$ctrl.$formatters.push(paceFormatters);
						$ctrl.$parsers.push(paceParsers);
						mask = toPace;
					}
					break;
				}
				case 'duration': {
					if(JSON.parse($attrs['interval'])){

					} else {
						$ctrl.$validators['duration'] = durationValidators;
						$ctrl.$formatters.push(durationFormatters);
						$ctrl.$parsers.push(durationParsers);
						convert = convertToDuration;
						//mask = toDuration;
					}
					break;
				}
				case 'number': {
					if(JSON.parse($attrs['interval'])){
						$ctrl.$validators['number'] = numberIntervalValidators;
						$ctrl.$formatters.push(numberIntervalFormatters);
						$ctrl.$parsers.push(numberIntervalParsers);
						mask = toNumberInterval;
					} else {
						$ctrl.$validators['number'] = durationValidators;
						$ctrl.$formatters.push(durationFormatters);
						$ctrl.$parsers.push(durationParsers);
						mask = toNumber;
					}
					break;
				}
			}
		}
	}

	return {
		require: 'ngModel',
		link: link
	};
}

const maskFunction = (type, interval) => 'to'+type[0].toUpperCase()+type.slice(1)+(interval ? 'Interval' : '');