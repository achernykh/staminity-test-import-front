import { IComponentOptions, IComponentController} from 'angular';
import './measure-main-button.component.scss';
import {IActivityMeasure, ICalcMeasures} from "../../../../api/activity/activity.interface";

class MeasureMainButtonCtrl implements IComponentController{

	private calcMeasures: ICalcMeasures;
	private sport: string;
	private filter: Array<string> = ['calories','adjustedPower'];
	static $inject = ['$scope'];

	constructor(private $scope: any) {

	}

	$onChanges(change: any): void {
		if(change.hasOwnProperty('changes') && !change.changes.isFirstChange()) {
			this.$onInit();
		}
	}

	$onInit(){
		// Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
		// this, а значит и нет доступа к массиву для фильтрации
		this.$scope.measure = {
			run: ['calories','elevationGain','elevationLoss','grade','intensityLevel','efficiencyFactor'],
			bike: ['calories','trainingLoad','adjustedPower','vamPowerKg','variabilityIndex','efficiencyFactor','elevationGain','elevationLoss','grade','intensityLevel'],
			swim: ['calories','intensityLevel'],
			strength: ['calories','intensityLevel'],
			transition: ['calories','elevationGain','elevationLoss','grade','intensityLevel'],
			ski: ['calories','elevationGain','elevationLoss','grade','intensityLevel','efficiencyFactor']
		};
		this.$scope.search = (m) => this.$scope.measure[this.sport].indexOf(m.$key) !== -1;
	}
}

const MeasureMainButtonComponent: IComponentOptions = {
	bindings: {
		calcMeasures: '<',
		sport: '<'
	},
	controller: MeasureMainButtonCtrl,
	template: `
		<md-list class="md-dense">
			<md-subheader>Основные показатели</md-subheader>
			<md-list-item layout="row" layout-wrap>				
				<md-button class="md-exclude"
							ng-repeat="measure in $ctrl.calcMeasures | toArray | filter:search track by measure.$key">
					{{measure.$key | translate}}:&nbsp{{measure.avgValue | measureCalc:$ctrl.sport:measure.$key}}&nbsp
					<span>{{measure.$key | measureUnit:$ctrl.sport | translate}}</span> 
				</md-button>			
			</md-list-item>
		</md-list>`

};

export default MeasureMainButtonComponent;