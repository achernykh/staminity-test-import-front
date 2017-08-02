import { Observable } from "rxjs/Rx";

import { ISocketService } from '../core/socket.service';
import { ISessionService } from '../core/session.service';
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { 
	GetActivityCategory, PostActivityCategory, PutActivityCategory, DeleteActivityCategory,
	GetActivityTemplate, PostActivityTemplate, PutActivityTemplate, DeleteActivityTemplate
} from "../../../api/reference/reference.request";


export default class ReferenceService {
	
	static $inject = ['SocketService', 'SessionService'];

	constructor (
		private SocketService: ISocketService, 
		private SessionService: ISessionService
	) {
		
	}
	
	get activityCategoriesMessages () : Observable<any> {
		return this.SocketService.messages
			.filter(message => message.type === 'activityCategory')
			.share();
	}
	
	get activityTemplatesMessages () : Observable<any> {
		return this.SocketService.messages
			.filter(message => message.type === 'activityTemplate')
			.share();
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
	) : Promise<[IActivityCategory]> { 
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
	) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new PutActivityTemplate(
			id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible, content
		));
	}

	deleteActivityTemplate (id: number) : Promise<[IActivityCategory]> {
		return this.SocketService.send(new DeleteActivityTemplate(id));
	}
}
