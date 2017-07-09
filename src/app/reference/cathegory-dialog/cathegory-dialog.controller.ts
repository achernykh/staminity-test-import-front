import { IComponentController } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { sports, activityTypes } from '../reference.constants';
import './cathegory-dialog.scss';


export class CathegoryCtrl implements IComponentController {

	static $inject = ['$scope', '$mdSelect', '$mdDialog', '$translate', 'message', 'ReferenceService', 'cathegory', 'user', 'mode'];

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
		private ReferenceService,
		private cathegory,
		private user,
		private mode
	) {
		let activityType = activityTypes.find((activityType) => activityType.id === cathegory.activityTypeId);
		this.activityTypeSelection = [activityType];

		let cathegoryOwner = this.ReferenceService.cathegoryOwner(cathegory);
		if (cathegoryOwner === 'system') {
			cathegory.code = $translate.instant('category.' + cathegory.code);
		}
	}

	closeSelect () {
		this.$mdSelect.hide();
	}

	close () {
		this.$mdDialog.cancel();
	}

	delete () {
		this.ReferenceService.deleteActivityCategory(this.cathegory.id)
		.then((info) => this.$mdDialog.hide())
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
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

}