import {merge, IScope, IDirective, IAttributes, IAugmentedJQuery, INgModelController, IFilterService} from 'angular';
import {Measure} from "./measure.constants";

const toPaceInterval = (input) => {
	if (typeof input === 'undefined') {
		return null;
	};

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
	};
};

const toPace = (input) => {
	let pace = input.replace(/[^0-9]/g, '');

	if (pace.length < 3) {
		return pace;
	} else {
		return pace.substr(0,2) + ':' + pace.substr(2,2);
	};
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

		const paceParsers = (value) => {
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const paceIntervalFormatters = (value) => {
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

		const paceIntervalValidators = (model,view) => {
			console.log('check validators', model.from, model.to);
			return (model && model.hasOwnProperty('from') && model.hasOwnProperty('to')) &&
				(model.from >= model.to);
		};

		const paceValidators = (model,view) => {
			return true;
		};

		// Для обновляние viewValue добавляем $render
		$element.on('blur keyup change', () => {
			if (!!$ctrl.$viewValue) {
				$ctrl.$setViewValue(mask($ctrl.$viewValue));
			};
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
			}
		}
	}

	return {
		require: 'ngModel',
		link: link
	};
}

const maskFunction = (type, interval) => 'to'+type[0].toUpperCase()+type.slice(1)+(interval ? 'Interval' : '');