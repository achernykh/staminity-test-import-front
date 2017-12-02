import { merge } from "angular";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { IUserProfile } from "../../../../api";
import { path } from "../../share/utility";
import { ISession, StorageService } from "../index";

export const getUser = (session: ISession): IUserProfile => session.userProfile;
export const getCurrentUserId: (session: ISession) => number | string = path([ getUser, "userId" ]);
export const getToken = (session: ISession): string => session.token;
export const getPermissions = (session: ISession): Object => session.systemFunctions;

export class SessionService {

    private session: BehaviorSubject<ISession>;

    public static $inject = [ "storage" ];

    constructor(private storage: StorageService) {
        const session = storage.get("session") || {};
        this.session = new BehaviorSubject<ISession>(session);
    }

    public set(session: ISession = {}) {
        this.storage.set("session", session);
        this.session.next(session);
    }

    public change(changes: Object) {
        const session = this.get();
        this.set(merge({}, session, changes));
    }

    public get(): ISession {
        return this.session.getValue();
    }

    public getObservable(): Observable<ISession> {
        return this.session.asObservable();
    }

    public getUser(): IUserProfile {
        return getUser(this.get()) || {};
    }

    public getCurrentUserId(): number | string {
        return getCurrentUserId(this.get());
    }

    public isCurrentUserId(userId: number | string): boolean {
        return userId === this.getCurrentUserId();
    }

    public updateUser(userProfile: Object) {
        if (!userProfile.userId || this.isCurrentUserId(userProfile.userId)) {
            this.change({ userProfile: { ...userProfile } });
        }
    }

    public getToken(): string {
        return getToken(this.get());
    }

    public getPermissions(): Object {
        return getPermissions(this.get());
    }

    public setPermissions(permissions: Object) {
        this.change({ systemFunctions: { ...permissions } });
    }
}
