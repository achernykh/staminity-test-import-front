import { IComponentOptions, IComponentController, IPromise } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";

import { TemplateDialogCtrl } from "../template-dialog/template-dialog.controller";
import { pipe, prop, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined, log } from '../../share/util.js';
import "./templates.component.scss";


const templatesFilters = {
	activityType: (activityType, template) => template.activityCategory.activityTypeId === activityType.id,
	cathegory: (cathegory, template) => template.activityCategory.id === cathegory.id
};

const filterTemplates = (filters) => (template) => (
	keys(filters).every((key) => !filters[key] || templatesFilters[key] (filters[key], template))
);

class TemplatesCtrl implements IComponentController {

	static $inject = ['$scope', '$mdDialog', 'message', 'ReferenceService'];

	private user : any;
	private cathegories : any;
	private templates : Array<IActivityTemplate>;
	private templatesByOwner : any;
	private filters : any;
	private onTemplatesChange : () => any;
	private onTemplateChange : (id, changes) => any;
	private onTemplateDelete : (id) => any;

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
		console.log('templates filters', this.templates, this.filters);
		this.templatesByOwner = pipe(
			filter(filterTemplates(this.filters)),
			orderBy(prop('sortOrder')),
			groupBy(this.ReferenceService.templateOwner),
		) (this.templates);
	}

	templateReorder (index, template) {
		let { id, activityCategory, code, description, groupProfile, favourite, visible } = template;
		let owner = this.ReferenceService.templateOwner(template);
		let groupId = groupProfile && groupProfile.groupId;
		let activityCategoryId = activityCategory && activityCategory.id;
		let targetTemplate = this.templatesByOwner[owner][index];
		let sortOrder = targetTemplate? targetTemplate.sortOrder : 999999;

		this.ReferenceService.putActivityTemplate(id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		})
		.then(this.onTemplatesChange);
	}

	createTemplate () {
		this.templateDialog({
			activityCategory: this.filters.cathegory || this.cathegories.find((cathegory) => cathegory.activityTypeId === this.filters.activityType.id),
			content: [this.ReferenceService.createInterval('pW')]
		}, 'create');
	}

	copyTemplate (template) {
		let { id, activityCategory, code, description, groupProfile, favourite, content } = template;
		let groupId = groupProfile && groupProfile.id;
		let activityCategoryId = activityCategory && activityCategory.id;

		this.ReferenceService.postActivityTemplate(
			null, activityCategoryId, groupId, code, description, favourite, content
		)
		.then(this.onTemplatesChange)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		});
	}

	viewTemplate (template) {
		return this.templateDialog(template, 'view');
	}

	editTemplate (template) {
		return this.templateDialog(template, 'edit');
	}

	deleteTemplate (template) {
		let { id } = template;
		return this.ReferenceService.deleteActivityTemplate(id)
		.catch((info) => { 
			this.message.systemWarning(info);
			throw info;
		})
		.then(() => this.onTemplateDelete(id));
	}

	templateDialog (template, mode) {
		let locals = {
			mode,
			activityTemplate: { ...template },
			user: this.user,
			cathegories: this.cathegories,
			onTemplatesChange: this.onTemplatesChange,
			onTemplateChange: this.onTemplateChange,
			onTemplateDelete: this.onTemplateDelete
		};

		return this.$mdDialog.show({
			controller: TemplateDialogCtrl,
			controllerAs: '$ctrl',
			template: require('../template-dialog/template-dialog.template.html') as string,
			parent: angular.element(document.body),
			locals: locals,
			clickOutsideToClose: true
		});
	}
}


const TemplatesComponent: IComponentOptions = {
	bindings: {
		user: '<',
		cathegories: '<',
		templates: '<',
		filters: '<',
		onTemplateChange: '<',
		onTemplateDelete: '<',
		onTemplatesChange: '<'
	},
	controller: TemplatesCtrl,
	template: require('./templates.component.html') as string
};


export default TemplatesComponent;