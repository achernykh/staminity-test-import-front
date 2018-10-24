import { BehaviorSubject, Observable } from "rxjs/Rx";
import { merge } from "angular";
import { IUserProfile } from '../../../../api';
import { ISession, StorageService } from "../index";
import { path } from '../../share/utility/path';


export const getUser = (session: ISession): IUserProfile => session.userProfile;
export const getCurrentUserId: (session: ISession) => number | string = path([ getUser, 'userId' ]);
export const getToken = (session: ISession): string => session.token;
export const getPermissions = (session: ISession): Object => session.systemFunctions;

export class SessionService {

    private session: BehaviorSubject<ISession>;

    static $inject = [ 'storage', 'configAuthData' ];

    constructor (private storage: StorageService, private configAuthData: any ) {
        // поддержка старого решения с синхронным получением данных в localStorage
        this.session = new BehaviorSubject<ISession>(this.configAuthData || this.storage.get('session') || {});
        //this.storage.getItem('session').then(d => this.session.next(d || {}));
    }

    set (session: ISession = {}) {
        //this.storage.set('session', session);
        this.session.next(session);
        this.storage.setItem('session', session).then(d => {}, e => console.error('session set: ', e));
        //this.session.next(session);
    }

    // async set item (use un auth.signedIn)
    setItem (session: ISession = {}): Promise<any> {
        this.session.next(session);
        return this.storage.setItem('session', session);
    }

    refresh (changes: Object) {
        let session = this.get();
        this.set(Object.assign(session, changes));
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
        //console.debug('session getUserId', this.get(), getCurrentUserId(this.get()));
        return getCurrentUserId(this.get());
    }

    isCurrentUserId (userId: number | string): boolean {
        return userId === this.getCurrentUserId();
    }

    updateUser (userProfile: Object) {
        console.info('session service: update user', userProfile);
        if (!userProfile[ 'userId' ] || this.isCurrentUserId(userProfile[ 'userId' ])) {
            this.refresh({ userProfile: Object.assign({}, this.getUser(), { ...userProfile }) });
        }
    }

    setUser (userProfile: Object) {
        console.info('session service: set user', userProfile);
        if (!userProfile['userId'] || this.isCurrentUserId(userProfile['userId'])) {
            this.refresh({ userProfile: { ...userProfile } });
        }
    }

    getToken (): string {
        //console.debug('session getToken', this.get(), getToken(this.get()));
        return getToken(this.get());
    }

    getPermissions (): Object {
        return getPermissions(this.get());
    }

    setPermissions (permissions: Object) {
        this.change({ systemFunctions: { ...permissions } });
    }
}
