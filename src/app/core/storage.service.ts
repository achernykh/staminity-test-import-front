import { IWindowService, copy } from 'angular';
import { ISessionService } from "./session.service";
import { Observable } from "rxjs/Rx";
import { IUserProfile } from "../../../api/user/user.interface";

export interface IStorageService {
	get (key: string) : any;
	set (key: string, data: any) : void;
}

export default class StorageService implements IStorageService {

	private readonly location: string = 'localStorage';
	private storage: any;

	static $inject = ['$window'];

	constructor (
		private $window: IWindowService
	) {
		this.storage = $window[this.location];
	}

	get (key: string) : any {
		return JSON.parse(this.storage.getItem(key)) || null;
	}

	set (key: string, data: any) : void {
		this.storage.setItem(key, JSON.stringify(data));
	}

}