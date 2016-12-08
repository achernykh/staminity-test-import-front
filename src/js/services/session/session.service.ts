import {IUserProfile} from '../../../../api/user/user.interface';

export interface ISessionService {
	getToken():string;
	getUser():IUserProfile;
	getPermissions():Array<Object>
	setToken(value:Object):void;
	delToken():void;
}

export default class SessionService implements ISessionService {

	private memoryStore:any;
	private storageType:string;
	private tokenKey:string;
	private userKey:string;
	private permissionsKey:string;
	private $window:any;

	constructor($window:any) {
		this.storageType = 'localStorage';
		this.tokenKey = 'authToken';
		this.userKey = 'userProfile';
		this.permissionsKey = 'systemFunctions';
		this.memoryStore = {};
		this.$window = $window;
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

	getPermissions():Array<Object> {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey))[this.permissionsKey];
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	setToken(value:Object):void {
		try {
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
