import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { maybe, prop, find } from '../../share/util.js';
import { nameFromInterval } from "../reference.datamodel";
import { getType, activityTypes } from "../../activity/activity.constants";
import './template.component.scss';


class TemplateCtrl implements IComponentController {

	static $inject = ['$scope', '$filter', '$mdDialog', '$mdMedia', 'message', 'ReferenceService'];

	private template: IActivityTemplate;
	private isScreenSmall: boolean;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;

	constructor (
		private $scope, 
		private $filter, 
		private $mdDialog,
		private $mdMedia, 
		private message,
		private ReferenceService
	) {
		$scope.$watch(
			() => !$mdMedia('gt-sm'), 
			(value, prev) => {
				$scope.isScreenSmall = value;
			}
		);
	}

	get activityType () {
		let { activityTypeId } = this.template.activityCategory;
		return getType(activityTypeId);
	}

	get description () {
		return maybe(this.template.content) (prop(0)) (prop('trainerPrescription')) () || this.template.description;
	}

	get name () {
		return this.template.code 
			|| maybe(this.template.content) (find((interval) => interval.type === 'pW')) (nameFromInterval) ();
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