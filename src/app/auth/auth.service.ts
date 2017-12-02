import {IHttpPromise, IHttpPromiseCallbackArg, IPromise} from "angular";
import {
    InviteUserRequest,
    IUserProfile, PutUserInviteRequest, ResetPasswordRequest,
    SetPasswordRequest, UserCredentials,
} from "../../../api/";
import {toDay} from "../activity/activity.datamodel";
import {SessionService, SocketService} from "../core";
import GroupService from "../core/group.service";
import {IRESTService, PostData} from "../core/rest.service";

export interface IAuthService {
    isAuthenticated(): boolean;
    isAuthorized(roles: string[]): boolean;
    isCoach(role?: string): boolean;
    isMyAthlete(user: IUserProfile): Promise<any>;
    isMyClub(uri: string): Promise<any>;
    isActivityPlan(role?: string[]): boolean;
    isActivityPlanAthletes(role?: string[]): boolean;
    isActivityPro(role?: string[]): boolean;
    signIn(request: Object): IPromise<void>;
    signUp(request: Object): IHttpPromise<{}>;
    signOut(): void;
    confirm(request: Object): IHttpPromise<{}>;
    resetPassword(email: string): IHttpPromise<{}>;
    setPassword(password: string, token: string): IHttpPromise<{}>;
    inviteUsers(group: number, users: Object[]): Promise<any>;
    putInvite(credentials: UserCredentials): IHttpPromiseCallbackArg<any>;
}

export default class AuthService implements IAuthService {

    public static $inject = ["SessionService", "RESTService", "SocketService", "GroupService"];

    constructor(
        private SessionService: SessionService,
        private RESTService: IRESTService,
        private SocketService: SocketService,
        private GroupService: GroupService,
    ) {

    }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определен, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    public isAuthenticated(): boolean {
        return !!this.SessionService.getToken();
    }

    /**
     * Проверка полномочий пользователя
     * @param authorizedRoles
     * @returns {boolean}
     */
    public isAuthorized(authorizedRoles: any[] = []): boolean {
        const userRoles = this.SessionService.getPermissions();
        return authorizedRoles.every((role) => userRoles.hasOwnProperty(role) && toDay(new Date(userRoles[role])) >= toDay(new Date()));
    }

    public isCoach(role: string = "Calendar_Athletes"): boolean {
        return this.isAuthorized([role]);
    }

    public isMyAthlete(user: IUserProfile = null): Promise<any> {
        if (!user) {
            throw new Error("userNotFound");
        }

        const groupId = this.SessionService.getUser().connections.allAthletes.groupId;
        if (groupId) {
            return this.GroupService.getManagementProfile(groupId, "coach")
                .then((result) => {
                    const athletes: any[] = result.members;
                    if (!athletes || !athletes.some((member) => member.userProfile.userId === user.userId)) {
                        throw new Error("forbidden_InsufficientRights");
                    } else {
                        return true;
                    }
                });
        } else {
            throw new Error("groupNotFound");
        }
    }

    public isMyClub(uri: string): Promise<any> {
        const userClubs = this.SessionService.getUser().connections.ControlledClubs;
        if (userClubs && userClubs.some((club) => club.groupUri === uri)) {
            return Promise.resolve();
        } else {
            return Promise.reject("forbidden_InsufficientRights");
        }
    }

    public isActivityPlan(role: string[] = ["ActivitiesPlan_User"]): boolean {
        return this.isAuthorized([role[0]]);
    }

    public isActivityPlanAthletes(role: string[] = ["ActivitiesPlan_Athletes"]): boolean {
        return this.isAuthorized([role[0]]);
    }

    public isActivityPro(role: string[] = ["ActivitiesProView_User", "ActivitiesProView_Athletes"]): boolean {
        return this.isCoach() && this.isAuthorized([role[1]]) ||  this.isAuthorized([role[0]]); //this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    /**
     * Регистрация пользователя
     * @param request
     * @returns {Promise<any>}
     */
    public signUp(request): IHttpPromise<{}> {
        return this.RESTService.postData(new PostData("/signup", request));
    }

    /**
     * Вход пользователя
     * @param request
     * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
     */
    public signIn(request): IPromise<void> {
        return this.RESTService.postData(new PostData("/signin", request))
            .then((response: IHttpPromiseCallbackArg<any>) => {
                if (response.data.hasOwnProperty("userProfile") && response.data.hasOwnProperty("token")) {
                    this.signedIn(response.data);
                    return response.data.userProfile;
                } else {
                    throw new Error("dataError");
                }
            });
    }

    public signedIn(sessionData: any) {
        this.SessionService.set(sessionData);
        this.SocketService.open(sessionData.token);
    }

    public signOut() {
        this.SessionService.set();
        this.SocketService.close();
    }

    /**
     * Подтверждение регистрации пользователя
     * @param request
     * @returns {Promise<any>}
     */
    public confirm(request): IHttpPromise<{}> {
        return this.RESTService.postData(new PostData("/confirm", request));
    }

    /**
     * Восстановление пароля
     * @param email
     * @returns {IPromise<TResult>}
     */
    public resetPassword(email: string): IHttpPromise<{}> {
        return this.RESTService.postData(new ResetPasswordRequest(email))
            .then((result) => result.data);
    }
    /**
     * Установка нового пароля текущего пользователя
     * @param password
     * @returns {Promise<any>}
     */
    public setPassword(password: string, token: string): IHttpPromise<{}> {
        return this.RESTService.postData(new SetPasswordRequest(token, password))
            .then((result) => result.data); // Ожидаем system message
    }

    /**
     * Приглашение пользователей тренером/менеджером
     * @param group - группа AllAthletes | ClubMembers
     * @param users -
     * @returns {Promise<any>}
     */
    public inviteUsers(group: number, users: Object[]): Promise<any> {
        return this.SocketService.send(new InviteUserRequest(group, users));
    }

    public putInvite(credentials: UserCredentials): Promise<any> {
        return this.RESTService.postData(new PostData("/api/wsgate", new PutUserInviteRequest(credentials)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }
}
