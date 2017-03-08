import './activity-peaks.component.scss';
import { IComponentOptions, IComponentController} from 'angular';
import {IActivityMeasure, ICalcMeasures} from "../../../../../api/activity/activity.interface";

class ActivityPeaksCtrl implements IComponentController{

	private peaks: Array<any>;
	private calcMeasures: ICalcMeasures;
	private measures: Array<string>;
	private sport: string;
	private readonly peaksMeasure = ['heartRateTimePeaks', 'heartRateDistancePeaks',
		'speedTimePeaks', 'speedDistancePeaks',
		'powerTimePeaks', 'powerDistancePeaks',
		'cadenceTimePeaks', 'cadenceDistancePeaks'];


	//private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain','elevationLoss'];
	static $inject = ['$scope'];

	constructor(private $scope: any) {

	}

	$onChanges(change: any): void {
		if(change.hasOwnProperty('calcMeasures') && !change.calcMeasures.isFirstChange()) {
			this.$onInit();
		}
	}

	$onInit(){
		this.peaks = this.peaksMeasure
			.filter(m => this.calcMeasures.hasOwnProperty(m) &&
				this.calcMeasures[m].hasOwnProperty('peaks') &&
				this.calcMeasures[m].peaks[0].value !== 0)
			.map(m => ({
				measure: this.calcMeasures[m].sourceMeasure, //this.getMeasure(m),
				type: (m.includes('Time') && 'duration') || 'distance',
				value: this.calcMeasures[m].peaks
			}));

		// Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
		// this, а значит и нет доступа к массиву для фильтрации
		this.measures = Array.from(new Set(this.peaks.map(m => m.measure)));
		this.$scope.filter = (this.measures.length > 0 && { measure: this.measures[0] }) || '';
	}

	setFilter(code) {
		this.$scope.filter = { measure: code };
	}

	private getMeasure(name: string):string {
		return name.substr(0,
			(name.includes('Time') && name.indexOf('Time')) ||
			(name.includes('Distance') && name.indexOf('Distance')) || null);
	}
}

const ActivityPeaksComponent: IComponentOptions = {
	bindings: {
		calcMeasures: '<',
		sport: '<',
		changes: '<'
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
					{{peak.intervalLength | measureCalc:$ctrl.sport:category.type}}&nbsp{{category.type | measureUnit:$ctrl.sport | translate}}
					<span>{{peak.value | measureCalc:$ctrl.sport:category.measure}}</span> 
				</md-button>			
			</md-list-item>
			<md-divider ng-repeat-end></md-divider>
		</md-list>`

};

export default ActivityPeaksComponent;