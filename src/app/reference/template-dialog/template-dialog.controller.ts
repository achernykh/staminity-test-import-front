import { IComponentController } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { measuresByCode, activityTypes } from '../reference.constants';
import './template-dialog.scss';


export class TemplateDialogCtrl implements IComponentController {

	static $inject = ['$scope', '$mdSelect', '$mdDialog', '$translate', 'message', 'ReferenceService', 'activityTemplate', 'cathegories', 'user', 'mode', 'onTemplatesChange', 'onTemplateChange', 'onTemplateDelete'];

	private activityTypes : Array<any> = activityTypes;
	private measuresByCode : any = measuresByCode;
	private submit : any = {
		create: this.create.bind(this),
		edit: this.update.bind(this),
		view: this.close.bind(this)
	};

	constructor (
		private $scope, 
		private $mdSelect,
		private $mdDialog, 
		private $translate,
		private message,
		private ReferenceService,
		private activityTemplate,
		private cathegories,
		private user,
		private mode,
		private onTemplatesChange,
		private onTemplateChange,
		private onTemplateDelete
	) {
		console.log('TemplateDialogCtrl', this);
	}

	get activityType () {
		let activityTypeId = this.activityTemplate.activityCategory.activityTypeId;
		return activityTypes.find((activityType) => activityType.id === activityTypeId);
	}

	set activityType (activityType) {
		this.activityTemplate.activityCategory = this.cathegories.find((cathegory) => cathegory.activityTypeId === activityType.id);
	}

	get cathegoriesByActivityType () {
		let activityTypeId = this.activityTemplate.activityCategory.activityTypeId;
		return this.cathegories.filter((cathegory) => cathegory.activityTypeId === activityTypeId);
	}

	close () {
		this.$mdDialog.cancel();
	}

	create () {
		let { id, code, description, groupProfile, activityCategory, favourite, content } = this.activityTemplate;
		let activityCategoryId = activityCategory && activityCategory.id;
		let groupId = groupProfile && groupProfile.id;

		return this.ReferenceService.postActivityTemplate(
			id, activityCategoryId, groupId, code, description, favourite, content
		)
		.then((info) => this.$mdDialog.hide())
		.then(this.onTemplatesChange)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	update () {
		let { id, code, description, groupProfile, activityCategory, sortOrder, favourite, content, visible } = this.activityTemplate;
		let activityCategoryId = activityCategory && activityCategory.id;
		let groupId = groupProfile && groupProfile.id;

		return this.ReferenceService.putActivityTemplate(
			id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible
		)
		.then((info) => this.$mdDialog.hide())
		.then(() => this.onTemplateChange(id, this.activityTemplate))
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	delete () {
		let { id } = this.activityTemplate;
		return this.ReferenceService.deleteActivityTemplate(id)
		.then((info) => this.$mdDialog.hide())
		.then(() => this.onTemplateDelete(id))
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

}