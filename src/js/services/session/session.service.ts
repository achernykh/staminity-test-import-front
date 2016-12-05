export interface ISessionService {
	getToken():string;
	getUser():number;
	setToken(value:string):void;
	delToken():void;
}

export default class SessionService implements ISessionService {

	private memoryStore:any;
	private storageType:string;
	private tokenKey:string;
	private userKey:string;
	private $window: any;

	constructor($window:any) {
		this.storageType = 'sessionStorage';
		this.tokenKey = 'authToken';
		this.userKey = 'authToken';
		this.memoryStore = {};
		this.$window = $window;
		console.log('SessionService => constructor =', this)
	}

	getToken():string {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.tokenKey)).token;
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	getUser():number {
		try {
			return JSON.parse(this.$window[this.storageType].getItem(this.userKey)).userId;
		} catch (e) {
			return this.memoryStore[this.tokenKey];
		}
	}

	setToken(value:string):void {
		//console.log('SessionService => setToken =', JSON.stringify(value), this);
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
