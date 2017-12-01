import { IComponentController, IComponentOptions, IPromise } from "angular";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { activityTypes, getType } from "../../activity/activity.constants";
import { path } from "../../share/utility";
import { ReferenceCtrl } from "../reference.component";
import "./template.component.scss";


class TemplateCtrl implements IComponentController {

	private template: IActivityTemplate;
	private onDelete: () => any;
	private onSelect: () => any;
	private onCopy: () => any;
	private reference: ReferenceCtrl;

	static $inject = ["$scope", "$filter", "$mdDialog"];

	constructor (
		private $scope, 
		private $filter, 
		private $mdDialog,
	) {
	}

	get activityType () {
		let { activityTypeId } = this.template.activityCategory;
		return getType(activityTypeId);
	}

	get description () {
		return path(["content", 0, "trainerPrescription"])(this.template) || this.template.description;
	}

	get name () {
		return this.template.code;
	}
}


const TemplateComponent: IComponentOptions = {
	bindings: {
		template: "<",
        isMobileLayout: "<",
		onDelete: "&",
		onSelect: "&",
		onCopy: "&",
	},
	controller: TemplateCtrl,
	template: require("./template.component.html") as string,
};


export default TemplateComponent;