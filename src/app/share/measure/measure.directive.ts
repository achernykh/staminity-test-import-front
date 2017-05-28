import {merge, IScope, IDirective, IAttributes, IAugmentedJQuery, INgModelController, IFilterService} from 'angular';
import {Measure} from "./measure.constants";
import moment from 'moment/src/moment.js';


interface IScopeMeasureInput extends IScope {
	ftpMode: boolean;
	ftp: number;
	interval: boolean;
    measure: string;
	from: string;
	to: string;
    isFTPMeasure: boolean;
}

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
	return isFinite(Number(input)) && input ?  moment().startOf('day').minutes(Number(input)).format('HH:mm:ss') : input;
};

const convertToFTP = (interval:boolean, initial: {}, value: any, ftp: number):any => {
	//return interval ? Object.assign(initial,{from: value.from * 100 / ftp, to: value.to * 100 / ftp}) : value * 100 / ftp;
};

const convertFromFTP = (interval:boolean, initial: {}, value: any, ftp: number):any => {
	//return interval ? Object.assign(initial,{from: value.from * 100 / ftp, to: value.to * 100 / ftp}) : value * 100 / ftp;
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

	function link($scope: IScopeMeasureInput, $element: IAugmentedJQuery, $attrs: IAttributes, $ctrl: INgModelController) {

		let FTPMeasures: Array<string> = ['heartRate', 'speed', 'power'];
		let interval = JSON.parse($attrs['interval']);
		let ftpMode = $scope.ftpMode;//JSON.parse($attrs.ftpMode);
		let ftp = ftpMode ? $scope.ftp : null;
		let isFTPMeasure = false;

		let measure:Measure = null;
		let initial: Object = {};
		let mask: any; //функция преобразование ввода по маске
		let convert: any; //функция преобразования значения после потери фокуса

		//$scope.from:  'intensityLevelFrom' || 'intensityByFtpFrom';
		//$scope.to  'intensityLevelTo' || 'intensityByFtpTo';

		// Преобразование для ввода пульса
		const paceIntervalParsers = (value) => {
			//debugger;
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

			from = Number($filter('measureSave')(measure.name, from, measure.sport));
			to = Number($filter('measureSave')(measure.name, to, measure.sport));

			return Object.assign(initial, {
				[$scope.from]: Math.min(from,to),
				[$scope.to]: Math.max(from,to)
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
				[$scope.from]: $filter('measureSave')(measure.name, Number(from), measure.sport),
				[$scope.to]: $filter('measureSave')(measure.name, Number(to), measure.sport)
			});
		};

		const numberFtpIntervalParsers = (value) => {

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
				[$scope.from]: Number(from)/ 100,
				[$scope.to]: Number(to) / 100
			});
		};

		const paceParsers = (value) => {
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const durationParsers = (value) => {
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const numberParsers = (value) => {
			return Number($filter('measureSave')(measure.name, value, measure.sport));
		};

		const durationFtpParsers = (value) => {
			//debugger;
			return $filter('measureSave')(measure.name, value, measure.sport);
		};

		const numberFtpParsers = (value) => {
			//debugger;
			return value / 100;
		};

		const paceIntervalFormatters = (value: any) => {
			//debugger;
			console.log('check pace interval formatters', value);
			if(value && value.hasOwnProperty($scope.from) && value.hasOwnProperty($scope.to)) {
				initial = value;
				return (value[$scope.from] !== value[$scope.to]) ?
					$filter('measureCalc')(value[$scope.to], measure.sport, measure.name)+'-'+$filter('measureCalc')(value[$scope.from], measure.sport, measure.name):
					$filter('measureCalc')(value[$scope.from], measure.sport, measure.name);
			} else {
				initial = {[$scope.from]: null, [$scope.to]: null};
				return initial;
			}
		};

		const numberIntervalFormatters = (value: any) => {
			//debugger;
			if(value && value.hasOwnProperty($scope.from) && value.hasOwnProperty($scope.to)) {
				initial = value;
				return (value[$scope.from] !== value[$scope.to]) ?
				$filter('measureCalc')(value[$scope.from], measure.sport, measure.name)+'-'+$filter('measureCalc')(value[$scope.to], measure.sport, measure.name):
					$filter('measureCalc')(value[$scope.from], measure.sport, measure.name);
			} else {
				initial = {[$scope.from]: null, [$scope.to]: null};
				return initial;
			}
		};

		const numberFtpIntervalFormatters = (value: any) => {
			//debugger;
			if(value && value.hasOwnProperty($scope.from) && value.hasOwnProperty($scope.to)) {
				initial = value;
				let newValue = convertFromFTP($scope.interval, initial, value, $scope.ftp);
				return (newValue[$scope.from] !== newValue.to) ? `${newValue[$scope.from].toFixed(0)}`+'-'+`${newValue[$scope.to].toFixed(0)}` : `${newValue[$scope.from].toFixed(0)}`;
			} else {
				initial = {from: null, to: null};
				return initial;
			}
		};

		const paceFormatters = (value) => {
			return (!!value && $filter('measureCalc')(value, measure.sport, measure.name)) || null;
		};

		const durationFormatters = (value) => {
			//debugger;
            //let newValue = $filter('measureCalc')(value, measure.sport, measure.name);
			return (!!value && $filter('measureCalc')(value, measure.sport, measure.name)) || null;
		};

		const durationFtpFormatters = (value) => {
			//debugger;
			//let newValue = convertFromFTP($scope.interval, initial, value, $scope.ftp);
			return (!!value && `${(value*100).toFixed(0)}`) || null;
		};

		const paceIntervalValidators = (model: any) => {
			//debugger;
			//console.log('check pace interval validators', model, typeof model, model.from, model.to);
			return model && model.hasOwnProperty($scope.from) && model.hasOwnProperty($scope.to) &&
                model[$scope.from] <= model[$scope.to];
		};

		const numberIntervalValidators = (model: any) => {
			//debugger;
			//console.log('check number interval validators', model.from, model.to, model.from <= model.to);
			return model && model.hasOwnProperty($scope.from) && model.hasOwnProperty($scope.to) &&
				model[$scope.from] <= model[$scope.to];
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
				$ctrl.$modelValue = $ctrl.$modelValue * 60;
			}
			$ctrl.$render();
		});

		$scope.$watch('ftpMode',(value:boolean, last:boolean) => {
			console.log($scope,$attrs);
			let newValue: any;

			if (FTPMeasures.indexOf($scope.measure) === -1 || value === last) {
				return;
			}

			setParams();
			console.log('watch', $scope.measure, $scope.interval, $ctrl.$viewValue, mask);

			if($ctrl.$modelValue || $ctrl.$viewValue) {
				let percent: number = $scope.ftpMode ? 100 : 1;
				//debugger;
				// Пустое значение в модели данных, в представление = '
				if (!$ctrl.$modelValue[$scope.from]) {
					$ctrl.$viewValue = '';
				} else {
					// Перевод в %FTP
					if ($scope.ftpMode) {
						if($scope.interval && $ctrl.$modelValue[$scope.from] !== $ctrl.$modelValue[$scope.to]) {
							$ctrl.$viewValue = `${($ctrl.$modelValue[$scope.from]*percent).toFixed(0)}`+'-'+`${($ctrl.$modelValue[$scope.to]*percent).toFixed(0)}`;
						} else {
							$ctrl.$viewValue = `${($ctrl.$modelValue[$scope.from]*percent).toFixed(0)}`;
						}
					} else { // Перевод а абсолютные значения
						if($scope.interval && $ctrl.$modelValue[$scope.from] !== $ctrl.$modelValue[$scope.to]) { // интервал
                            if(measure.isPace()){
                                $ctrl.$viewValue = `${$filter('measureCalc')($ctrl.$modelValue[$scope.to], measure.sport, measure.name)}`+'-'+`${$filter('measureCalc')($ctrl.$modelValue[$scope.from], measure.sport, measure.name)}`;
                            } else {
                                $ctrl.$viewValue = `${$filter('measureCalc')($ctrl.$modelValue[$scope.from], measure.sport, measure.name)}`+'-'+`${$filter('measureCalc')($ctrl.$modelValue[$scope.to], measure.sport, measure.name)}`;
                            }
						} else {
							$ctrl.$viewValue = `${$filter('measureCalc')($ctrl.$modelValue[$scope.from], measure.sport, measure.name)}`;
						}
					}
				}
			}
			$ctrl.$render();
		});

		setParams();

		function setParams() {
			// Тип измерения для ввода определяется в атрибуте <input>, в виде
			// ng-attr-measure-input={{expression = measure}} ng-attr-sport={{expression = sport}}

            if($scope.ftpMode) {
                $scope.from = 'intensityByFtpFrom';
                $scope.to = 'intensityByFtpTo';
            } else {
                $scope.from = 'intensityLevelFrom';
                $scope.to = 'intensityLevelTo';
            }

            $scope.isFTPMeasure = FTPMeasures.indexOf($scope.measure) !== -1;


			if ($scope.measure && $attrs['sport']) {
				measure = new Measure($scope.measure, $attrs['sport']);
				console.log('measure = ', measure.name, measure.unit, measure.type, maskFunction(measure.type, JSON.parse($attrs['interval'])));

				switch (measure.type){
					case 'pace': {
						if($scope.interval){
							$ctrl.$validators['pace'] = ($scope.ftpMode && $scope.isFTPMeasure) ? numberIntervalValidators : paceIntervalValidators;
							$ctrl.$formatters = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpIntervalFormatters] : [paceIntervalFormatters];
							$ctrl.$parsers = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpIntervalParsers] : [paceIntervalParsers];
							mask = ($scope.ftpMode && $scope.isFTPMeasure) ? toNumberInterval : toPaceInterval;
						} else {
							$ctrl.$validators['pace'] = paceValidators;
							$ctrl.$formatters= ($scope.ftpMode && $scope.isFTPMeasure) ? [durationFtpFormatters] : [paceFormatters];
							$ctrl.$parsers = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpParsers] : [paceParsers];
							mask = ($scope.ftpMode && $scope.isFTPMeasure) ? toNumber : toPace;
						}
						break;
					}
					case 'duration': {
						if($scope.interval){

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
						if($scope.interval){
							$ctrl.$validators['number'] = numberIntervalValidators;
							$ctrl.$formatters = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpIntervalFormatters] : [numberIntervalFormatters];
							$ctrl.$parsers = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpIntervalParsers] : [numberIntervalParsers];
							mask = ($scope.ftpMode && $scope.isFTPMeasure) ? toNumberInterval : toNumberInterval;
						} else {
							$ctrl.$validators['number'] = durationValidators;
							$ctrl.$formatters = ($scope.ftpMode && $scope.isFTPMeasure) ? [durationFtpFormatters] : [durationFormatters];
							$ctrl.$parsers = ($scope.ftpMode && $scope.isFTPMeasure) ? [numberFtpParsers] : [numberParsers];
							mask = ($scope.ftpMode && $scope.isFTPMeasure) ? toNumber : toNumber;
						}
						break;
					}
				}
			}
		}


	}

	return {
		require: 'ngModel',
		link: link,
		scope: {
			ftpMode: '<',
			ftp: '<',
			interval: '=',
            measure: '='
		}
	};
}

const maskFunction = (type, interval) => 'to'+type[0].toUpperCase()+type.slice(1)+(interval ? 'Interval' : '');