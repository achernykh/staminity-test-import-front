import { IComponentOptions, IComponentController} from 'angular';
import './measures-avg-table.component.scss';

class MeasuresAvgTableCtrl implements IComponentController{

	private measures: Object;

	//static $inject = [''];

	constructor() {

	}
}

const MeasuresAvgTableComponent: IComponentOptions = {
	bindings: {
		measures: '<'
	},
	controller: MeasuresAvgTableCtrl,
	template: `
		<md-list class="md-dense">
			<md-subheader>Показатели мин/сред/макс</md-subheader>
			<md-list-item>
				<table>
				<thead class="md-caption">
					<tr>
						<th>#</th>
						<th>Показатель(ед.изм)</th>
						<th>Мин</th>
						<th>Сред</th>
						<th>Макс</th>
					</tr>
				</thead>
				<tbody class="md-caption">
					<tr ng-repeat="(key, measure) in $ctrl.measures track by key">
						<td>{{$index}}</td>
						<td>{{key}}</td>
						<td>{{measure.minValue | number}}</td>
						<td>{{measure.avgValue | number}}</td>
						<td>{{measure.maxValue | number}}</td>
					</tr>					
				</tbody>
			</table>			
			</md-list-item>
			
		</md-list>`

};

export default MeasuresAvgTableComponent;