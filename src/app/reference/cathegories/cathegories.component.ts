import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityType } from "../../../../api/activity/activity.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

import { cathegoryOwner } from "../reference.datamodel";
import { CathegoryCtrl } from '../cathegory-dialog/cathegory-dialog.controller';
import { getType, activityTypes } from "../../activity/activity.constants";
import { pipe, prop, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined } from '../../share/util';

import './cathegories.component.scss';


const cathegoriesFilters = {
	activityType: (activityType) => (cathegory) => cathegory.activityTypeId === activityType.id
};

const filterCathegories = (filters) => (cathegory) => (
	keys(filters).every((key) => cathegoriesFilters[key] (filters[key]) (cathegory))
);

class CathegoriesCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	private user : IUserProfile;
	private cathegories : Array<IActivityCategory>;
	private cathegoriesByOwner : any;
	private templates : Array<IActivityTemplate>;
	private activityTypes : Array<any> = activityTypes;
	private getType: (id: number) => IActivityType = getType;
	private filters : any;
	private onCathegoryChange : (id: number, changes: any) => any;
	private onCathegoryDelete : (id: number) => any;
	private onCathegoriesChange : () => any;

	constructor (
		private $scope, 
		private $mdDialog, 
		private message,
		private ReferenceService
	) {
		
	}

	$onChanges (changes) {
		this.handleChanges();
	}

	handleChanges () {
		this.cathegoriesByOwner = pipe(
			filter(filterCathegories(this.filters)),
			orderBy(prop('sortOrder')),
			groupBy(cathegoryOwner(this.user))
		) (this.cathegories);
	}

	cathegoryEnabled (cathegory) {
		return (visible) => {
			if (isUndefined(visible)) {
				return cathegory.visible;
			}

			let { id, code, description, groupProfile, sortOrder } = cathegory;
			let groupId = groupProfile && groupProfile.groupId;

			this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
			.catch((info) => { 
				this.message.systemWarning(info);
				throw info;
			})
			.then(() => this.onCathegoryChange(id, { visible }));
		};
	}

	cathegoryReorder (index, cathegory) {
		let { id, code, description, groupProfile, visible } = cathegory;
		let owner = cathegoryOwner(this.user) (cathegory);
		let groupId = groupProfile && groupProfile.groupId;
		let targetCathegory = this.cathegoriesByOwner[owner][index];
		let sortOrder = targetCathegory? targetCathegory.sortOrder : 999999;

		this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		})
		.then(this.onCathegoriesChange);
	}

	createCathegory () {
		this.cathegoryDialog({ activityTypeId: this.filters.activityType.id }, 'create');
	}

	viewCathegory (cathegory) {
		this.cathegoryDialog(cathegory, 'view');
	}

	editCathegory (cathegory) {
		this.cathegoryDialog(cathegory, 'edit');
	}

	cathegoryDialog (cathegory, mode) {
		let locals = {
			mode,
			cathegory: { ...cathegory },
			user: this.user,
			onCathegoryChange: this.onCathegoryChange,
			onCathegoryDelete: this.onCathegoryDelete,
			onCathegoriesChange: this.onCathegoriesChange
		};
		
		return this.$mdDialog.show({
			template: require('../cathegory-dialog/cathegory-dialog.template.html') as string,
			controller: CathegoryCtrl,
			locals: locals,
			controllerAs: '$ctrl',
			clickOutsideToClose: true
		});
	}
}

const CathegoriesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		filters: '<',
		onCathegoryChange: '<',
		onCathegoryDelete: '<',
		onCathegoriesChange: '<'
	},
	controller: CathegoriesCtrl,
	template: require('./cathegories.component.html') as string
};


export default CathegoriesComponent;