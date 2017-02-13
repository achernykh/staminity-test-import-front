import {merge, IScope, IDirective, IAttributes, IAugmentedJQuery, INgModelController, IFilterService} from 'angular';
import {Measure} from "./measure.constants";

const convertToPaceMask = (input) => {
	let pace = input.replace(/[^0-9]/g, '');

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

export function MeasurementInput($filter): IDirective {

	function link($scope: IScope, $element: IAugmentedJQuery, $attrs: IAttributes, $ctrl: INgModelController) {

		// Преобразование для ввода пульса
		const paceParsers = (value) => {
			console.log('$parsers=',value);
			let sep = value.search('-');
			let from, to;
			if(sep !== -1){
				from = value.substr(0,sep);
				to = value.substr(sep+1,5);
			} else {
				from = to = value.substr(0,5);
			}
			// set view value
			$ctrl.$setViewValue(convertToPaceMask(value));
			// set model view
			return merge($ctrl.$modelValue,{
				from: $filter('measureSave')(from),
				to: $filter('measureSave')(to)
			});
		};

		const paceFormatters = (value) => {
			return (value.from !== value.to) ?
				$filter('measureView')(value.from)+'-'+$filter('measureView')(value.to):
				$filter('measureView')(value.from);
		};

		const paceValidators = (model,view) => {
			return true;
		};

		// Для обновляние viewValue добавляем $render
		$element.on('blur keyup change', () => $ctrl.$render());

		// Тип измерения для ввода определяется в атрибуте <input>, в виде
		// ng-attr-measure-input={{expression = measure}} ng-attr-sport={{expression = sport}}
		if ($attrs['measureInput'] && $attrs['sport']) {
			debugger;
			let measure = new Measure($attrs['measureInput'], $attrs['sport']);
			switch (measure.type){
				case 'pace': {
					$ctrl.$validators['pace'] = paceValidators;
					$ctrl.$formatters.push(paceFormatters);
					$ctrl.$parsers.push(paceParsers);
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