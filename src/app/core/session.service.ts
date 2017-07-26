import {IUserProfile} from '../../../api/user/user.interface';
import { IWindowService } from 'angular';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {ISocketService} from "./socket.service";
import {MessageGroupMembership} from "../../../api/group/group.interface";

export interface IAuthToken {
	userProfile: IUserProfile;
}

export interface ISessionService {
	profile: any;
	getAuth():any;
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
	private _profile: BehaviorSubject<IUserProfile>;
	private _user: IUserProfile;
	public profile: any;


	static $inject = ['$window'];

	constructor(private $window:IWindowService, private socket: ISocketService) {
		this.memoryStore = {};
		try {
			this._user = JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.userKey];
		} catch (e) {
			
		}
		this._profile = new BehaviorSubject(this.getUser());
		this.profile = this._profile.asObservable();

		this.socket.messages
            .filter(m => m.type === 'groupMembership' || m.type === 'controlledClub')
            .map(this.updateProfile);

	}

	updateProfile(message: MessageGroupMembership):void{

	}

	getAuth():Object {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.permissionsKey];
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
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
			return this._user;
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	setUser(value:IUserProfile):void{
		try {
			this._user = value;
			let data = JSON.parse(this.$window[this.storageType].getItem(this.tokenKey));
			Object.assign(data, {'userProfile': value});
			this.$window[this.storageType].setItem(this.tokenKey, JSON.stringify(data));
			this._profile.next(value);
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
		debugger;
		try {
			this.$window[this.storageType].setItem(this.tokenKey, JSON.stringify(value));
			let userProfile = value['userProfile'];
			this._user = userProfile;
			this._profile.next(userProfile);
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
