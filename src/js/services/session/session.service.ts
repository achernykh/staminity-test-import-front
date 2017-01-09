import {IUserProfile} from '../../../../api/user/user.interface';

export interface ISessionService {
	getToken():string;
	getUser():IUserProfile;
	getPermissions():Array<Object>
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
	private displayKey:string = 'displaySettings';
	private $window:any;

	constructor($window:any) {
		this.memoryStore = {};
		this.$window = $window;
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
