import { BehaviorSubject, Observable } from "rxjs/Rx";
import { merge } from "angular";
import { IUserProfile } from '../../../../api';
import { ISession, StorageService } from "../index";
import { path } from '../../share/utility';


export const getUser = (session: ISession): IUserProfile => session.userProfile;
export const getCurrentUserId: (session: ISession) => number | string = path([ getUser, 'userId' ]);
export const getToken = (session: ISession): string => session.token;
export const getPermissions = (session: ISession): Object => session.systemFunctions;

export class SessionService {

    private session: BehaviorSubject<ISession>;

    static $inject = [ 'storage' ];

    constructor (private storage: StorageService) {
        let session = storage.get('session') || {};
        this.session = new BehaviorSubject<ISession>(session);
    }

    set (session: ISession = {}) {
        this.storage.set('session', session);
        this.session.next(session);
    }

    change (changes: Object) {
        let session = this.get();
        this.set(merge({}, session, changes));
    }

    get (): ISession {
        return this.session.getValue();
    }

    getObservable (): Observable<ISession> {
        return this.session.asObservable();
    }

    getUser (): IUserProfile {
        return getUser(this.get()) || {};
    }

    getCurrentUserId (): number | string {
        return getCurrentUserId(this.get());
    }

    isCurrentUserId (userId: number | string): boolean {
        return userId === this.getCurrentUserId();
    }

    updateUser (userProfile: Object) {
        if (!userProfile[ 'userId' ] || this.isCurrentUserId(userProfile[ 'userId' ])) {
            this.change({ userProfile: { ...userProfile } });
        }
    }

    getToken (): string {
        return getToken(this.get());
    }

    getPermissions (): Object {
        return getPermissions(this.get());
    }

    setPermissions (permissions: Object) {
        this.change({ systemFunctions: { ...permissions } });
    }
}