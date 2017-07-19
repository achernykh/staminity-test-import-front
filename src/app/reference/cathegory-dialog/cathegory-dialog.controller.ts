import { IComponentController } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { cathegoryOwner } from '../reference.datamodel';
import { activityTypes } from '../reference.constants';
import './cathegory-dialog.scss';
import ReferenceService from "../../core/reference.service";


export class CathegoryCtrl implements IComponentController {

	static $inject = ['$scope', '$mdSelect', '$mdDialog', '$translate', 'message', 'ReferenceService', 'mode', 'cathegory', 'user', 'onCathegoriesChange', 'onCathegoryChange', 'onCathegoryDelete'];

	private activityTypes: Array<any> = activityTypes;
	private activityTypeSelection: any;
	private submit = { 
		create: () => this.create(),
		edit: () => this.update(),
		view: () => this.close()
	};

	constructor (
		private $scope, 
		private $mdSelect,
		private $mdDialog, 
		private $translate,
		private message,
		private ReferenceService: ReferenceService,
		private mode,
		private cathegory,
		private user,
		private onCathegoriesChange,
		private onCathegoryChange,
		private onCathegoryDelete
	) {
		let activityType = activityTypes.find((activityType) => activityType.id === cathegory.activityTypeId);
		this.activityTypeSelection = [activityType];

		let isSystem = cathegoryOwner(user)(cathegory) === 'system';
		if (isSystem) {
			cathegory.code = $translate.instant('category.' + cathegory.code);
		}
		console.log(CathegoryCtrl, this);
	}

	closeSelect () {
		this.$mdSelect.hide();
	}

	close () {
		this.$mdDialog.cancel();
	}

	delete () {
		this.ReferenceService.deleteActivityCategory(this.cathegory.id)
		.then(() => this.$mdDialog.hide())
		.then(() => this.onCathegoryDelete(this.cathegory.id))
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	create () {
		let { id, code, description, groupId, sortOrder, visible } = this.cathegory;

		Promise.all(this.activityTypeSelection.map((activityType) => 
			this.ReferenceService.postActivityCategory(
				activityType.id, code, description, groupId
			)
		))
		.then((info) => this.$mdDialog.hide())
		.then(this.onCathegoriesChange)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	update () {
		let { id, code, description, groupId, sortOrder, visible } = this.cathegory;

		this.ReferenceService.putActivityCategory(
			id, code, description, groupId, sortOrder, visible
		)
		.then((info) => this.$mdDialog.hide())
		.then(() => this.onCathegoryChange(id, { code, description }))
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

}