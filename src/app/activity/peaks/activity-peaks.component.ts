import { IComponentOptions, IComponentController} from 'angular';
import './measure-main-button.component.scss';
import {IActivityMeasure} from "../../../../api/activity/activity.interface";

class ActivityPeaksCtrl implements IComponentController{

	private measures: Array<IActivityMeasure>;
	private sport: string;
	private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain','elevationLoss'];
	static $inject = ['$scope'];

	constructor(private $scope: any) {

	}

	$onInit(){
		// Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
		// this, а значит и нет доступа к массиву для фильтрации
		this.$scope.measure = ['heartRate', 'speed', 'cadence', 'elevationGain','elevationLoss'];
		this.$scope.search = (m) => this.$scope.measure.indexOf(m.$key) !== -1;
	}
}

const ActivityPeaksComponent: IComponentOptions = {
	bindings: {
		measures: '<',
		sport: '<'
	},
	controller: ActivityPeaksCtrl,
	template: `
		<md-list class="md-dense">
			<md-subheader>Основные показатели</md-subheader>
			<md-list-item layout="row" layout-wrap>				
				<md-button class="md-exclude"
							ng-repeat="measure in $ctrl.measures | toArray | filter:search track by measure.$key">
					{{measure.$key | translate}}:&nbsp{{measure.avgValue | measureCalc:$ctrl.sport:measure.$key}}&nbsp
					<span>{{measure.$key | measureUnit:$ctrl.sport | translate}}</span> 
				</md-button>			
			</md-list-item>
		</md-list>`

};

export default ActivityPeaksComponent;