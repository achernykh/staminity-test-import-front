import { Observable, Subject } from "rxjs/Rx";

import { SocketService, SessionService } from '../core';
import {  } from '../core/session.service';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { 
	GetActivityCategoryRequest, PostActivityCategoryRequest, PutActivityCategoryRequest,
	DeleteActivityCategoryRequest, GetActivityTemplateRequest, PostActivityTemplateRequest,
	PutActivityTemplateRequest, DeleteActivityTemplateRequest
} from "../../../api";


export default class ReferenceService {

	public categories: Array<IActivityCategory> = [];
	public categoriesChanges = new Subject<IActivityCategory[]>();

	private setIndex = (obj: IActivityCategory | IActivityTemplate): IActivityCategory | IActivityTemplate => {
		return Object.assign({}, obj, {index: Number(`${obj.id}${obj.revision}`)});
	}

	private categoriesReducers = {
		"I": (category: IActivityCategory) => [...this.categories, this.setIndex(category)],
		"U": (category: IActivityCategory) => this.categories.map((c) => c.id === category.id? this.setIndex(category) : c),
		"D": (category: IActivityCategory) => this.categories.filter((c) => c.id !== category.id)
	};

	public resetCategories = () => {
		this.getActivityCategories(undefined, false, true)
			.then((categories) => {
				this.categories = categories.map(c => this.setIndex(c)) as Array<IActivityCategory>;
				this.categoriesChanges.next(this.categories);
			});
	}

	public templates: Array<IActivityTemplate> = [];
	public templatesChanges = new Subject<IActivityTemplate[]> ();
	private templatesReducers = {
		"I": (template: IActivityTemplate) => [...this.templates, this.setIndex(template)],
		"U": (template: IActivityTemplate) => this.templates.map((t) => t.id === template.id? this.setIndex(template) : t),
		"D": (template: IActivityTemplate) => this.templates.filter((t) => t.id !== template.id)
	};

	public resetTemplates = () => {
		this.getActivityTemplates(undefined, undefined, false, false)
			.then((templates) => {
				this.templates = templates.map(c => this.setIndex(c)) as Array<IActivityTemplate>;
				this.templatesChanges.next(this.templates);
			});
	}

	static $inject = ['SocketService', 'SessionService'];

	constructor (
		private SocketService: SocketService,
		private SessionService: SessionService) {
		//this.resetCategories();
		this.SocketService.connections.subscribe(status => status && this.resetCategories());
		this.SocketService.messages
			.filter(message => message.type === 'activityCategory')
			.subscribe((message) => {
				let reducer = this.categoriesReducers[message.action];
				if (reducer) {
					this.categories = reducer(message.value);
					this.categoriesChanges.next(this.categories);
				}
			});

		//this.resetTemplates();
		this.SocketService.connections.subscribe(status => status && this.resetTemplates());
		this.SocketService.messages
			.filter(message => message.type === 'activityTemplate')
			.subscribe((message) => {
				let reducer = this.templatesReducers[message.action];
				if (reducer) {
					this.templates = reducer(message.value);
					this.templatesChanges.next(this.templates);
				}
			});
	}

	clear (): void {
		this.categories = [];
		this.templates = [];
	}

	getActivityCategories (
		activityTypeId: number, 
		onlyMine: boolean, 
		showInvisible: boolean
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new GetActivityCategoryRequest(
			activityTypeId, onlyMine, showInvisible
		));
	}

	postActivityCategory (
		activityTypeId: number, 
		code: string, 
		description: string, 
		groupId: number
	) : Promise<any> {
		return this.SocketService.send(new PostActivityCategoryRequest(
			activityTypeId, code, description, groupId
		));
	}

	putActivityCategory (
		activityCategoryId: number, 
		code: string, 
		description: string, 
		groupId: number, 
		sortOrder: number, 
		visible: boolean
	) : Promise<any> {
		return this.SocketService.send(new PutActivityCategoryRequest(
			activityCategoryId, code, description, groupId, sortOrder, visible
		));
	}

	deleteActivityCategory (activityCategoryId: number) : Promise<any> {
		return this.SocketService.send(new DeleteActivityCategoryRequest(activityCategoryId));
	}

	getActivityTemplates (
		activityCategoryId: number, 
		activityTypeId: number,
		onlyVisible: boolean,
		onlyFavourites: boolean
	) : Promise<[IActivityTemplate]> {
		return this.SocketService.send(new GetActivityTemplateRequest(
			activityCategoryId, activityTypeId, onlyVisible, onlyFavourites
		))
		.then((response) => response.arrayResult);
	}

	postActivityTemplate ( 
		id: number, 
		activityCategoryId: number, 
		groupId: number, 
		code: string, 
		description: string, 
		favourite: boolean, 
		content: any 
	) : Promise<any> { 
		return this.SocketService.send(new PostActivityTemplateRequest(
			id, activityCategoryId, groupId, code, description, favourite, content 
		)); 
	}

	putActivityTemplate (
		id: number,
		activityCategoryId: number,
		groupId: number,
		sortOrder: number,
		code: string,
		description: string,
		favourite: boolean,
		visible: boolean,
		content: any
	) : Promise<any> {
		return this.SocketService.send(new PutActivityTemplateRequest(
			id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible, content
		));
	}

	deleteActivityTemplate (id: number) : Promise<any> {
		return this.SocketService.send(new DeleteActivityTemplateRequest(id));
	}
}
