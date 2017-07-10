import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { CathegoryCtrl } from '../cathegory-dialog/cathegory-dialog.controller';
import { sports, activityTypes } from '../reference.constants';
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

	private user : any;
	private cathegories : any;
	private cathegoriesByOwner : any;
	private templates : Array<IActivityTemplate>;
	private activityTypes : Array<any> = activityTypes;
	private filters : any;
	private onCathegoryChange : (id: number, changes: any) => any;
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
			groupBy(this.ReferenceService.cathegoryOwner)
		) (this.cathegories);
	}

	activityType (id) {
		return this.activityTypes.find((activityType) => activityType.id === id);
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
		let owner = this.ReferenceService.cathegoryOwner(cathegory);
		let groupId = groupProfile && groupProfile.groupId;
		let targetCathegory = this.cathegoriesByOwner[owner][index];
		let sortOrder = targetCathegory? targetCathegory.sortOrder : 999999;

		// if (targetCathegory === cathegory) {
		// 	return;
		// }

		this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		})
		.then(this.onCathegoriesChange);
	}

	newCathegory () {
		this.cathegoryDialog({ activityTypeId: this.filters.activityType.id }, 'create');
	}

	cathegoryDialog (cathegory, mode) {
		let locals = {
			cathegory: { ...cathegory },
			user: this.user,
			mode
		};
		
		return this.$mdDialog.show({
			template: require('../cathegory-dialog/cathegory-dialog.template.html') as string,
			controller: CathegoryCtrl,
			locals: locals,
			controllerAs: '$ctrl',
			clickOutsideToClose: true
		})
		.then(this.onCathegoriesChange);
	}
}

const CathegoriesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		filters: '<',
		onCathegoryChange: '<',
		onCathegoriesChange: '<'
	},
	controller: CathegoriesCtrl,
	template: require('./cathegories.component.html') as string
};


export default CathegoriesComponent;