import {IUserProfile} from '../../../api/user/user.interface';
import { IWindowService } from 'angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface IAuthToken {
	userProfile: IUserProfile;
}

export interface ISessionService {
	userProfile: any;
	getToken():string;
	getUser():IUserProfile;
	setUser(value:IUserProfile):void;
	getPermissions():Array<Object>;
	getDisplaySettings():Object;
	setDisplaySettings(value:Object):void;
	setToken(value:Object):void;
	delToken():void;
}

export default class SessionService implements ISessionService {

	private memoryStore:any;
	private storageType:string = 'localStorage';
	private tokenKey:string = 'authToken';
	private userKey:string = 'userProfile';
	private permissionsKey:string = 'systemFunctions';
	private displayKey:string = 'display';
	private _userProfile: BehaviorSubject<IUserProfile>;
	public userProfile: any;


	static $inject = ['$window'];

	constructor(private $window:IWindowService) {
		this.memoryStore = {};
		this.$window = $window;
		this._userProfile = new BehaviorSubject(this.getUser());
		this.userProfile = this._userProfile.asObservable();
	}

	getAuth():Object {
		return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey));
	}

	getToken():string {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey)).token;
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	getUser():IUserProfile {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.userKey];
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	setUser(value:IUserProfile):void{
		try {
			let data = JSON.parse(this.$window[this.storageType].getItem(this.tokenKey));
			this._userProfile.next(value);
			Object.assign(data, {'userProfile': value});
			this.$window[this.storageType].setItem(this.tokenKey, JSON.stringify(data));
		} catch (e) {
			throw new Error(e);
		}
	}

	getPermissions():Array<Object> {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.permissionsKey];
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	getDisplaySettings():Object {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.displayKey];
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	setDisplaySettings(value:Object):void{
		try {
			let data = JSON.parse(this.$window[this.storageType].getItem(this.tokenKey));
			Object.assign(data, {'displaySettings': value});
			this.$window[this.storageType].setItem(this.tokenKey, JSON.stringify(data));
		} catch (e) {
			throw new Error(e);
		}
	}

	setToken(value:Object):void {
		try {
			this._userProfile.next(value['userProfile']);
			this.$window[this.storageType].setItem(this.tokenKey, JSON.stringify(value));
		} catch (e) {
			throw new Error(e);
		}
	}

	delToken():void {
		try {
			this.$window[this.storageType].removeItem(this.tokenKey);
		} catch (e) {
			delete this.memoryStore[this.tokenKey];
		}
	}
}
