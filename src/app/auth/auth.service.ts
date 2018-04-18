import {
    IUserProfile,
    SetPasswordRequest, UserCredentials, InviteUserRequest,
    ResetPasswordRequest, PutUserInviteRequest
} from '../../../api/';
import {SessionService, SocketService} from "../core";
import {PostData, RESTService} from '../core/rest.service';
import {IHttpPromise, IHttpPromiseCallbackArg, IPromise} from 'angular';
import GroupService from "../core/group.service";
import {toDay} from "../activity/activity-datamodel/activity.datamodel";
import ReferenceService from "../reference/reference.service";
import NotificationService from "../share/notification/notification.service";
import RequestsService from "../core/requests.service";
import UserService from "../core/user.service";
import * as _connection from "../core/env.js";



export interface IAuthService {
    isAuthenticated():boolean;
    isAuthorized(roles:Array<string>, strict?: boolean):boolean;
    isCoach(role?: string):boolean;
    isMyAthlete(user: IUserProfile):Promise<any>;
    isMyClub(uri: string):Promise<any>;
    isActivityPlan(role?: Array<string>):boolean;
    isActivityPlanAthletes(role?: Array<string>):boolean;
    isActivityPro(role?: Array<string>):boolean;
    signIn(request:Object): Promise<any>;
    signUp(request:Object):IHttpPromise<{}>;
    signOut():void;
    confirm(request:Object):IHttpPromise<{}>;
    resetPassword(email: string):IHttpPromise<{}>;
    setPassword(password:string,token:string):IHttpPromise<{}>;
    inviteUsers(group: number, users: Array<Object>):Promise<any>;
    putInvite(credentials: UserCredentials):IHttpPromiseCallbackArg<any>;
}

export default class AuthService implements IAuthService {

    private server: string = _connection.server;
    private permissions: Object = window.localStorage.getItem('permissions') && JSON.parse(window.localStorage.getItem('permissions'));
    static $inject = ['SessionService', 'RESTService', 'SocketService', 'GroupService', 'ReferenceService',
        'NotificationService', 'RequestsService', 'UserService'];

    constructor(
        private SessionService: SessionService,
        private RESTService: RESTService,
        private SocketService: SocketService,
        private GroupService:GroupService,
        private referenceService: ReferenceService,
        private notificationService: NotificationService,
        private requestService: RequestsService,
        private userService: UserService) {

    }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определен, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    isAuthenticated() : boolean {
        return !!this.SessionService.getToken();
    }

    /**
     * Проверка полномочий пользователя
     * @param authorizedRoles
     * @param strict
     * @returns {boolean}
     */
    isAuthorized(authorizedRoles: Array<any> = [], strict: boolean = true) : boolean {
        let userRoles = this.SessionService.getPermissions() || [];
        if (this.server === 'testapp.staminity.com:8080' && this.permissions) {
            Object.assign(userRoles, this.permissions);
        }
        return  strict ?
            authorizedRoles.every(role => userRoles.hasOwnProperty(role) && toDay(new Date(userRoles[role])) >= toDay(new Date())) :
            authorizedRoles.some(role => userRoles.hasOwnProperty(role) && toDay(new Date(userRoles[role])) >= toDay(new Date()));
    }

    isCoach(role: string = 'Calendar_Athletes') : boolean {
        return this.isAuthorized([role]);
    }

    isMyAthlete(user: IUserProfile = null) : Promise<any> {
        if (!user) { return Promise.reject('userNotFound'); }
        if (!this.SessionService.getUser().connections.hasOwnProperty('allAthletes') ||
            !   this.SessionService.getUser().connections.allAthletes.groupMembers) { return Promise.reject('coachConnectionsNotFound'); }

        if ( this.SessionService.getUser().connections.allAthletes.groupMembers.some(a => a.userId === user.userId) ) {
            return Promise.resolve();
        } else {
            return Promise.reject('forbidden_InsufficientRights');
        }

        /**let groupId = this.SessionService.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            return this.GroupService.getManagementProfile(groupId, 'coach')
                .then((result) => {
                    let athletes: Array<any> = result.members;
                    if (!athletes || !athletes.some(member => member.userProfile.userId === user.userId)) {
                        return Promise.reject('forbidden_InsufficientRights');
                    } else { return Promise.resolve(); }
                });
        } else { return Promise.reject('groupNotFound'); }**/
    }

    isMyClub(uri: string) : Promise<any> {
        let userClubs = this.SessionService.getUser().connections['ControlledClubs'];
        if (userClubs && userClubs.some(club => club.groupUri === uri)) {
            return Promise.resolve();
        } else {
            return Promise.reject('forbidden_InsufficientRights');
        }
    }

    isActivityPlan (role: Array<string> = ['ActivitiesPlan_User']) : boolean {
        return this.isAuthorized([role[0]]);
    }

    isActivityPlanAthletes (role: Array<string> = ['ActivitiesPlan_Athletes']) : boolean {
        return this.isAuthorized([role[0]]);
    }

    isActivityPro(role: Array<string> = ['ActivitiesProView_User', 'ActivitiesProView_Athletes']) : boolean {
        return this.isCoach() && this.isAuthorized([role[1]]) ||  this.isAuthorized([role[0]]); //this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    /**
     * Регистрация пользователя
     * @param request
     * @returns {Promise<any>}
     */
    signUp(request) : IHttpPromise<any> {
        return this.RESTService.postData(new PostData('/signup', request));
    }

    /**
     * Вход пользователя
     * @param request
     * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
     */
    signIn(request) : Promise<any> {
        return this.RESTService.postData(new PostData('/signin', request))
            .then((response: IHttpPromiseCallbackArg<any>) =>
                response.data.hasOwnProperty('userProfile') &&
                response.data.hasOwnProperty('token') &&
                this.signedIn(response.data));
            /*.then(profile => )
                if(response.data.hasOwnProperty('userProfile') && response.data.hasOwnProperty('token')) {
                    this.signedIn(response.data);
                    return response.data['userProfile'];
                } else { throw new Error('dataError');}})
            .then(() => this.signedIn());*/
    }

    signedIn(sessionData: any): Promise<any> {
        this.SessionService.set(sessionData);
        return this.SocketService.init()
            .then( _ => {
                this.referenceService.resetCategories();
                this.referenceService.resetTemplates();
                this.notificationService.resetNotifications();
                this.requestService.resetRequests();
                this.userService.resetConnections();
            }, _ => {
                throw new Error('auth signin: ws connections disable');
            })
            .then( _ => this.SessionService.getUser());
    }

    signOut() {
        this.SessionService.set();
        this.SocketService.close();
        /**this.referenceService.clear();
        this.notificationService.clear();
        this.requestService.clear();**/
    }

    /**
     * Подтверждение регистрации пользователя
     * @param request
     * @returns {Promise<any>}
     */
    confirm(request) : IHttpPromise<{}> {
        return this.RESTService.postData(new PostData('/confirm', request));
    }

    /**
     * Восстановление пароля
     * @param email
     * @returns {IPromise<TResult>}
     */
    resetPassword(email: string) : IHttpPromise<{}>{
        return this.RESTService.postData(new ResetPasswordRequest(email))
            .then(result => result['data']);
    }
    /**
     * Установка нового пароля текущего пользователя
     * @param token
     * @param password
     * @returns {Promise<any>}
     */
    setPassword(password: string, token: string = this.SessionService.getToken()) : IHttpPromise<{}> {
        return this.RESTService.postData(new SetPasswordRequest(password, token))
            .then((result) => result['data']); // Ожидаем system message
    }

    /**
     * Приглашение пользователей тренером/менеджером
     * @param group - группа AllAthletes | ClubMembers
     * @param users -
     * @returns {Promise<any>}
     */
    inviteUsers(group: number, users: Array<Object>) : Promise<any> {
        return this.SocketService.send(new InviteUserRequest(group,users));
    }

    putInvite(credentials: UserCredentials) : Promise<any> {
        return this.RESTService.postData(new PostData('/api/wsgate', new PutUserInviteRequest(credentials)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }
}

