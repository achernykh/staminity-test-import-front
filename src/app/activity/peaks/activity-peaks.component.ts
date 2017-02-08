import './activity-peaks.component.scss';
import { IComponentOptions, IComponentController} from 'angular';
import {IActivityMeasure} from "../../../../api/activity/activity.interface";

class ActivityPeaksCtrl implements IComponentController{

	private peaks: Array<any>;
	private measures: Array<string>;
	private sport: string;
	//private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain','elevationLoss'];
	static $inject = ['$scope'];

	constructor(private $scope: any) {

	}

	$onInit(){
		// Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
		// this, а значит и нет доступа к массиву для фильтрации
		this.measures = this.peaks.map(m => m.measure);
		this.$scope.filter = (this.measures.length > 0 && { measure: this.measures[0] }) || '';
	}

	setFilter(code) {
		this.$scope.filter = { measure: code };
	}
}

const ActivityPeaksComponent: IComponentOptions = {
	bindings: {
		peaks: '<',
		sport: '<'
	},
	controller: ActivityPeaksCtrl,
	template: `
		<md-list class="md-dense">
			<md-list-item>
				<p>Пики</p>
				<md-button ng-repeat="measure in $ctrl.measures track by $index" class="md-icon-button md-secondary" ng-click="$ctrl.setFilter(measure)">
					<md-icon md-svg-src="assets/icon/{{measure}}.svg" class="dark-active" ></md-icon>
				</md-button>
				
			</md-list-item>
			<md-list-item class="peaks" layout="row" layout-wrap ng-repeat-start="category in $ctrl.peaks | filter:filter">				
				<md-button class="md-exclude" ng-repeat="peak in category.value track by $index">
					{{category.measure | translate}}:&nbsp{{peak.value | measureCalc:$ctrl.sport:category.measure}}&nbsp
					<span>{{category.measure | measureUnit:$ctrl.sport | translate}}</span> 
				</md-button>			
			</md-list-item>
			<md-divider ng-repeat-end></md-divider>
		</md-list>`

};

export default ActivityPeaksComponent;