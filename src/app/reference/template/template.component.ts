import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { maybe, prop } from '../../share/util.js';
import { activityTypes } from '../reference.constants';
import './template.component.scss';


class TemplateCtrl implements IComponentController {

	static $inject = ['$scope','$mdDialog', 'message', 'ReferenceService'];

	private template: IActivityTemplate;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;

	constructor (
		private $scope, 
		private $mdDialog, 
		private message,
		private ReferenceService
	) {

	}

	get activityType () {
		let { activityTypeId} = this.template.activityCategory;
		return activityTypes.find((activityType) => activityType.id === activityTypeId);
	}

	get description () {
		return maybe(this.template.content) (prop(0)) (prop('trainerPrescription')) () || this.template.description;
	}
}


const TemplateComponent: IComponentOptions = {
	bindings: {
		template: '<',
		onDelete: '&',
		onSelect: '&',
		onCopy: '&'
	},
	controller: TemplateCtrl,
	template: require('./template.component.html') as string
};


export default TemplateComponent;