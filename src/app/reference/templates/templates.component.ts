import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";


class TemplatesCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	private user : any;
	private cathegories : any;
	private templates : Array<IActivityTemplate>;
	private filters : any;
	private onTemplateChange : () => any;
	private onTemplatesChange : () => any;

	constructor (
		private $scope, 
		private $mdDialog, 
		private message,
		private ReferenceService
	) {
		
	}

	newTemplate () {

	}
}

const TemplatesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		templates: '<',
		filters: '<',
		onTemplateChange: '<',
		onTemplatesChange: '<'
	},
	controller: TemplatesCtrl,
	template: require('./templates.component.html') as string
};


export default TemplatesComponent;