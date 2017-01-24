import { IComponentOptions, IComponentController} from 'angular';
import './measure-main-button.component.scss';
import {IActivityMeasure} from "../../../../api/activity/activity.interface";

class MeasureMainButtonCtrl implements IComponentController{

	private measures: Array<IActivityMeasure>;
	private sport: string;
	private filter: Array<string> = ['heartRate', 'speed', 'cadence', 'elevationGain','elevationLoss'];
	//static $inject = [''];

	constructor() {
		this.measures = this.measures.filter(m => this.filter.indexOf(m.code) !== -1);
	}
}

const MeasureMainButtonComponent: IComponentOptions = {
	bindings: {
		measures: '<',
		sport: '<'
	},
	controller: MeasureMainButtonCtrl,
	template: `
		<md-list class="md-dense">
			<md-subheader>Основные показатели</md-subheader>
			<md-list-item layout="row" layout-wrap>				
				<md-button class="md-exclude" ng-repeat="measure in $ctrl.measures track by $index">
					{{measure.code | translate}}:&nbsp{{measure.avgValue | measureCalc:$ctrl.sport:measure.code}}&nbsp
					<span>{{measure.code | measureUnit:$ctrl.sport | translate}}</span> 
				</md-button>			
			</md-list-item>
		</md-list>`

};

export default MeasureMainButtonComponent;