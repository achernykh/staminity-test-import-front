import {merge, IScope, IDirective, IAttributes, IAugmentedJQuery, INgModelController, IFilterService} from 'angular';
import {Measure} from "./measure.constants";

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
		let mask: any;

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

			console.log('change parsers ', value, value.length, sep, from,to);
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
			console.log('check pace interval validators', model.from, model.to);
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
			return true;
		};

		// Для обновляние viewValue добавляем $render
		$element.on('blur keyup change', () => {
			if (!!$ctrl.$viewValue && !!mask) {
				$ctrl.$setViewValue(mask($ctrl.$viewValue));
			}
			$ctrl.$render();
		});

		// Тип измерения для ввода определяется в атрибуте <input>, в виде
		// ng-attr-measure-input={{expression = measure}} ng-attr-sport={{expression = sport}}
		if ($attrs['measureInput'] && $attrs['sport']) {
			measure = new Measure($attrs['measureInput'], $attrs['sport']);
			console.log('measure = ', measure.name, measure.type, maskFunction(measure.type, JSON.parse($attrs['interval'])));
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
						$ctrl.$validators['time'] = durationValidators;
						$ctrl.$formatters.push(durationFormatters);
						$ctrl.$parsers.push(durationParsers);
						mask = toDuration;
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