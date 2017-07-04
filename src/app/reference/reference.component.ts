import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";

import './reference.component.scss';


class ReferenceCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'SystemMessageService'];

	private user: any;
	private cathegories: [IActivityCategory];
	private templates: [IActivityTemplate];

	constructor (
		private $scope, 
		private $mdDialog, 
		private dialogs, 
		private SystemMessageService
	) {
		this.$scope = $scope;
		this.$mdDialog = $mdDialog;
		this.SystemMessageService = SystemMessageService;
		console.log('ReferenceCtrl', this);
	}

	getUserCathegories () {
		return this.cathegories.filter((cathegory) => cathegory.userProfileCreator.userId === this.user.userId);
	}

	getCoachCathegories () {
		return this.cathegories.filter((cathegory) => cathegory.userProfileCreator.userId !== this.user.userId && !cathegory.groupProfile);
	}

	getClubCathegories () {
		return this.cathegories.filter((cathegory) => cathegory.userProfileCreator.userId !== this.user.userId && cathegory.groupProfile);
	}

	getSystemCathegories () {
		return this.cathegories.filter((cathegory) => !cathegory.userProfileCreator.userId);
	}
}

const ReferenceComponent: IComponentOptions = {
	bindings: {
		user: '<',
		auth: '<',
		cathegories: '<',
		templates: '<'
	},
	controller: ReferenceCtrl,
	template: require('./reference.component.html') as string
};


export default ReferenceComponent;