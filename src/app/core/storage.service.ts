import { IWindowService, copy } from 'angular';
import { ISessionService } from "./session.service";
import { Observable } from "rxjs/Rx";
import { IUserProfile } from "../../../api/user/user.interface";

export interface IStorageService {
	get (key: string, byUser?: boolean) : any;
	set (key: string, data: any, byUser?: boolean) : void;
}

export default class StorageService implements IStorageService {

	private readonly location: string = 'localStorage';
	private storage: any;

	static $inject = ['$window', 'SessionService'];

	constructor (
		private $window: IWindowService,
		private sessionService: ISessionService
	) {
		this.storage = $window[this.location];
	}

	getKey (key: string, byUser: boolean = true) {
		let user = this.sessionService.getUser();
		return user && byUser ? `${user.userId}#${key}` : key;
	}

	get (key: string, byUser?: boolean) : any {
		return JSON.parse(this.storage.getItem(this.getKey(key, byUser))) || null;
	}

	set (key: string, data: any, byUser?: boolean) : void {
		this.storage.setItem(this.getKey(key, byUser), JSON.stringify(data));
	}

}