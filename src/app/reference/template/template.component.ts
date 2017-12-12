import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { ReferenceCtrl } from '../reference.component';
import { path } from '../../share/utility';
import { getType, activityTypes } from "../../activity/activity.constants";
import './template.component.scss';
import { getIntervalsChartData } from "../../activity/activity.function";
import { IActivityIntervalP } from "@api/activity";


class TemplateCtrl implements IComponentController {

	private template: IActivityTemplate;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;
	private reference: ReferenceCtrl;
	private segmentChart: any;

	static $inject = ['$scope', '$filter', '$mdDialog'];

	constructor (
		private $scope, 
		private $filter, 
		private $mdDialog) {

	}

	$onInit (): void {
	    this.segmentChart = this.isStructured ?
            getIntervalsChartData(<Array<IActivityIntervalP>>this.template.content.filter(i => i.type === 'P')) :
            null;
    }

	get isStructured (): boolean {
	    return this.template.content.some(i => i.type === 'P');
    }

	get activityType () {
		let { activityTypeId } = this.template.activityCategory;
		return getType(activityTypeId);
	}

	get description () {
		return path(['content', 0, 'trainerPrescription'])(this.template) || this.template.description;
	}

	get name () {
		return this.template.code;
	}
}


const TemplateComponent: IComponentOptions = {
	bindings: {
		template: '<',
        isMobileLayout: '<',
		onDelete: '&',
		onSelect: '&',
		onCopy: '&'
	},
	controller: TemplateCtrl,
	template: require('./template.component.html') as string
};


export default TemplateComponent;