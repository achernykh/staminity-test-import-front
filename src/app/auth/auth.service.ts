import {PostData, IRESTService} from '../core/rest.service';
import {SetPasswordRequest, InviteRequest, UserCredentials, PostInviteRequest} from '../../../api/auth/auth.request';
import {ISessionService} from "../core/session.service";
import {IHttpService, IHttpPromise, IHttpPromiseCallbackArg, IPromise} from 'angular';
import {ISocketService} from "../core/socket.service";
import {IUserProfile} from "../../../api/user/user.interface";
import GroupService from "../core/group.service";
import HttpHeaderType = angular.HttpHeaderType;
import {GetRequest} from "../../../api/calendar/calendar.request";


export interface IAuthService {
    isAuthenticated():boolean;
    isAuthorized(roles:Array<string>):boolean;
    isCoach(role?: string):boolean;
    isMyAthlete(user: IUserProfile):Promise<any>;
    isMyClub(uri: string):Promise<any>;
    isActivityPlan(role?: Array<string>):boolean;
    isActivityPro(role?: Array<string>):boolean;
    signIn(request:Object):IPromise<void>;
    signUp(request:Object):IHttpPromise<{}>;
    signOut():void;
    confirm(request:Object):IHttpPromise<{}>;
    setPassword(request:Object):IHttpPromise<{}>;
    inviteUsers(group: number, users: Array<Object>):Promise<any>;
    putInvite(credentials: UserCredentials):IHttpPromiseCallbackArg<any>;
    storeUser(response: IHttpPromiseCallbackArg<any>):IHttpPromiseCallbackArg<any>;
}

export default class AuthService implements IAuthService {

    static $inject = ['SessionService', 'RESTService', 'SocketService', 'GroupService'];

    constructor(private SessionService:ISessionService,
                private RESTService:IRESTService,
                private SocketService:ISocketService,
                private GroupService:GroupService) {

    }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определен, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    isAuthenticated():boolean {
        return !!this.SessionService.getToken();
    }

    /**
     * Проверка полномочий пользователя
     * @param authorizedRoles
     * @returns {boolean}
     */
    isAuthorized(authorizedRoles: Array<any> = []):boolean {
        let userRoles = this.SessionService.getAuth();
        if (!userRoles) {
            return false;
        }
        console.log('auth', userRoles, authorizedRoles, new Date(userRoles[authorizedRoles[0]]), new Date());
        return authorizedRoles.every(role => userRoles.hasOwnProperty(role) && new Date(userRoles[role]) >= new Date());
    }

    isCoach(role: string = 'Calendar_Athletes'):boolean {
        return this.isAuthorized([role]);
    }

    isMyAthlete(user: IUserProfile = null):Promise<any> {
        if (!user) {
            throw 'userNotFound';
        }
        console.log('current user', this.SessionService.getUser());
        let groupId = this.SessionService.getUser().connections['allAthletes'].groupId;
        if (groupId) {
            return this.GroupService.getManagementProfile(groupId,'coach')
                .then(result => {
                    let athletes: Array<any> = result.members;
                    if (!athletes || !athletes.some(member => member.userProfile.userId === user.userId)) {
                        throw 'forbidden_InsufficientRights';
                    } else {
                        return true;
                    }
                });
        } else {
            throw 'groupNotFound';
        }
    }

    isMyClub(uri: string):Promise<any> {
        let userClubs = this.SessionService.getUser().connections['ControlledClubs'];
        if (userClubs && userClubs.some(club => club.groupUri === uri)) {
            return Promise.resolve();
        } else {
            return Promise.reject('forbidden_InsufficientRights');
        }
    }

    isActivityPlan(role: Array<string> = ['ActivitiesPlan_User','ActivitiesPlan_Athletes']):boolean {
        return this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    isActivityPro(role: Array<string> = ['ActivitiesProView_User','ActivitiesProView_Athletes']):boolean {
        return this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    /**
     * Регистрация пользователя
     * @param request
     * @returns {Promise<any>}
     */
    signUp(request):IHttpPromise<{}> {
        return this.RESTService.postData(new PostData('/signup', request));
    }

    /**
     * Вход пользователя
     * @param request
     * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
     */
    signIn(request): IPromise<void>{
        return this.RESTService.postData(new PostData('/signin', request))
            .then((response: IHttpPromiseCallbackArg<any>) => {
                this.SessionService.setToken(response.data);
                this.SocketService.open(response.data['token']).then(()=> response);
                return response.data['userProfile'];
            });
    }

    signOut():void {
        this.SessionService.delToken();
        this.SocketService.close();
    }

    /**
     * Подтверждение регистрации пользователя
     * @param request
     * @returns {Promise<any>}
     */
    confirm(request):IHttpPromise<{}> {
        return this.RESTService.postData(new PostData('/confirm', request));
    }

    /**
     * Установка нового пароля текущего пользователя
     * @param password
     * @returns {Promise<any>}
     */
    setPassword(password, token = this.SessionService.getToken()):IHttpPromise<{}> {
        return this.RESTService.postData(new SetPasswordRequest(token, password))
            .then((result) => {
                return result['data'];
            }); // Ожидаем system message
    }

    /**
     * Приглашение пользователей тренером/менеджером
     * @param group - группа AllAthletes | ClubMembers
     * @param users -
     * @returns {Promise<any>}
     */
    inviteUsers(group: number, users: Array<Object>):Promise<any> {
        return this.SocketService.send(new InviteRequest(group,users));
    }

    putInvite(credentials: UserCredentials):IHttpPromiseCallbackArg<any> {
        return this.RESTService.postData(new PostData('/api/wsgate', new PostInviteRequest(credentials)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    storeUser(response: IHttpPromiseCallbackArg<any>):IHttpPromiseCallbackArg<any>{
        this.SessionService.setToken(response.data);
        this.SocketService.open(response.data['token']).then(()=> response);
        return response;
    }
}

