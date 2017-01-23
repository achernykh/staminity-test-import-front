import { IComponentOptions, IComponentController} from 'angular';
import './measure-main-button.component.scss';

class MeasureMainButtonCtrl implements IComponentController{

	private measures: Object;

	//static $inject = [''];

	constructor() {

	}
}

const MeasureMainButtonComponent: IComponentOptions = {
	bindings: {
		measures: '<'
	},
	controller: MeasureMainButtonCtrl,
	template: `
		<md-list class="md-dense">
			<md-subheader>Основные показатели</md-subheader>
			<md-list-item layout="row" layout-wrap>				
				<md-button class="md-exclude" ng-repeat="(key, measure) in $ctrl.measures">{{key}}</md-button>			
			</md-list-item>
		</md-list>`

};

export default MeasureMainButtonComponent;