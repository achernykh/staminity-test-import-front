import { Observable, Subject } from "rxjs/Rx";

import { ISocketService } from '../core/socket.service-ajs';
import { ISessionService } from '../core/session.service-ajs';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { 
	GetActivityCategory, PostActivityCategory, PutActivityCategory, DeleteActivityCategory,
	GetActivityTemplate, PostActivityTemplate, PutActivityTemplate, DeleteActivityTemplate
} from "../../../api/reference/reference.request";


export default class ReferenceService {

	public categories: Array<IActivityCategory> = [];
	public categoriesChanges = new Subject<IActivityCategory[]>();

	private categoriesReducers = {
		"I": (category: IActivityCategory) => [...this.categories, category],
		"U": (category: IActivityCategory) => this.categories.map((c) => c.id === category.id? category : c),
		"D": (category: IActivityCategory) => this.categories.filter((c) => c.id !== category.id)
	};

	private resetCategories = () => {
		this.getActivityCategories(undefined, false, true)
			.then((categories) => {
				this.categories = categories;
				this.categoriesChanges.next(this.categories);
			});
	}

	public templates: Array<IActivityTemplate> = [];
	public templatesChanges = new Subject<IActivityTemplate[]> ();
	private templatesReducers = {
		"I": (template: IActivityTemplate) => [...this.templates, template],
		"U": (template: IActivityTemplate) => this.templates.map((t) => t.id === template.id? template : t),
		"D": (template: IActivityTemplate) => this.templates.filter((t) => t.id !== template.id)
	};

	private resetTemplates = () => {
		this.getActivityTemplates(undefined, undefined, false, false)
			.then((templates) => {
				this.templates = templates;
				this.templatesChanges.next(this.templates);
			});
	}

	static $inject = ['SocketService', 'SessionService'];

	constructor (
		private SocketService: ISocketService, 
		private SessionService: ISessionService
	) {
		this.resetCategories();
		this.SocketService.connections.subscribe(this.resetCategories);
		this.SocketService.messages
			.filter(message => message.type === 'activityCategory')
			.subscribe((message) => {
				let reducer = this.categoriesReducers[message.action];
				if (reducer) {
					this.categories = reducer(message.value);
					this.categoriesChanges.next(this.categories);
				}
			});

		this.resetTemplates();
		this.SocketService.connections.subscribe(this.resetTemplates);
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

	getActivityCategories (
		activityTypeId: number, 
		onlyMine: boolean, 
		showInvisible: boolean
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new GetActivityCategory(
			activityTypeId, onlyMine, showInvisible
		));
	}

	postActivityCategory (
		activityTypeId: number, 
		code: string, 
		description: string, 
		groupId: number
	) : Promise<any> {
		return this.SocketService.send(new PostActivityCategory(
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
		return this.SocketService.send(new PutActivityCategory(
			activityCategoryId, code, description, groupId, sortOrder, visible
		));
	}

	deleteActivityCategory (activityCategoryId: number) : Promise<any> {
		return this.SocketService.send(new DeleteActivityCategory(activityCategoryId));
	}

	getActivityTemplates (
		activityCategoryId: number, 
		activityTypeId: number,
		onlyVisible: boolean,
		onlyFavourites: boolean
	) : Promise<[IActivityTemplate]> {
		return this.SocketService.send(new GetActivityTemplate(
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
		return this.SocketService.send(new PostActivityTemplate( 
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
		return this.SocketService.send(new PutActivityTemplate(
			id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible, content
		));
	}

	deleteActivityTemplate (id: number) : Promise<any> {
		return this.SocketService.send(new DeleteActivityTemplate(id));
	}
}
