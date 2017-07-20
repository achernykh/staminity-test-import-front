import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { maybe, prop } from '../../share/util.js';
import { getType, activityTypes } from "../../activity/activity.constants";
import './template.component.scss';


class TemplateCtrl implements IComponentController {

	static $inject = ['$scope','$mdDialog', '$mdMedia', 'message', 'ReferenceService'];

	private template: IActivityTemplate;
	private isScreenSmall: boolean;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;

	constructor (
		private $scope, 
		private $mdDialog,
		private $mdMedia, 
		private message,
		private ReferenceService
	) {
		this.isScreenSmall = !$mdMedia('gt-sm');
	}

	get activityType () {
		let { activityTypeId } = this.template.activityCategory;
		return getType(activityTypeId);
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