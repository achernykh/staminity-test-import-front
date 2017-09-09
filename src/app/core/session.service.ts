import { BehaviorSubject, Observable } from "rxjs/Rx";
import { merge } from "angular";

import { IUserProfile } from '../../../api/user/user.interface';
import { IStorageService } from "./storage.service";
import { path } from '../share/utility';


export interface ISession {
	userProfile?: IUserProfile;
	token?: string;
	systemFunctions?: Object;
}

export const getUser = (session: ISession) : IUserProfile => session.userProfile;
export const getToken = (session: ISession) : string => session.token;
export const getPermissions = (session: ISession) : Object => session.systemFunctions;

export interface ISessionService  {
	set (session?: ISession);
	change (changes: Object);
	get () : ISession;
	getObservable() : Observable<ISession>;

	getUser () : IUserProfile;
	getToken () : string;
	getPermissions () : Object;
	setPermissions (permissions: Object);
	isCurrentUserId (userId: number | string) : boolean;
	updateUser (userChanges: Object);
}

export default class SessionService implements ISessionService {

	private session: BehaviorSubject<ISession>;

	static $inject = ['StorageService'];

	constructor (
		private storage: IStorageService
	) {
		let session = storage.get('session') || {};
		this.session = new BehaviorSubject<ISession> (session);
	}

	set (session: ISession = {}) {
		this.storage.set('session', session);
		this.session.next(session);
	}

	change (changes: Object) {
		let session = this.get();
		this.set(merge(session, changes));
	}

	get () : ISession {
		return this.session.getValue();
	}

	getObservable () : Observable<ISession> {
		return this.session.asObservable();
	}

	getUser () : IUserProfile {
		return getUser(this.get());
	}

	getToken () : string {
		return getToken(this.get());
	}

	getPermissions () : Object {
		return getPermissions(this.get());
	}

	setPermissions (permissions: Object) {
		this.change({ systemFunctions: permissions });
	}

	isCurrentUserId (userId: number | string) : boolean {
		return userId === path([getUser, 'userId']) (this.get());
	}

	updateUser (userChanges: Object) {
		if (!userChanges['userId'] || this.isCurrentUserId(userChanges['userId'])) {
			this.change({ userProfile: userChanges });
		}
	}
}
