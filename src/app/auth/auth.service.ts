import {PostData, IRESTService} from '../core/rest.service';
import {
    SetPasswordRequest, InviteRequest, UserCredentials, PostInviteRequest,
    ResetPasswordRequest
} from '../../../api/auth/auth.request';
import {ISessionService} from "../core/session.service";
import {IHttpService, IHttpPromise, IHttpPromiseCallbackArg, IPromise, HttpHeaderType, copy} from 'angular';
import {ISocketService} from "../core/socket.service";
import {IUserProfile} from "../../../api/user/user.interface";
import GroupService from "../core/group.service";
import {GetRequest} from "../../../api/calendar/calendar.request";
import {Observable} from "rxjs/Rx";


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
    resetPassword(email: string):IHttpPromise<{}>;
    setPassword(password:string,token:string):IHttpPromise<{}>;
    inviteUsers(group: number, users: Array<Object>):Promise<any>;
    putInvite(credentials: UserCredentials):IHttpPromiseCallbackArg<any>;
    storeUser(response: IHttpPromiseCallbackArg<any>):IHttpPromiseCallbackArg<any>;
}

export default class AuthService implements IAuthService {

    private permissions: any;
    static $inject = ['SessionService', 'RESTService', 'SocketService', 'GroupService'];

    constructor(private SessionService:ISessionService,
                private RESTService:IRESTService,
                private SocketService:ISocketService,
                private GroupService:GroupService) {

        SessionService.permissions.subscribe(permissions => this.permissions = copy(permissions));

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
        if (!this.permissions) {
            return false;
        }
        //console.log('auth', userRoles, authorizedRoles, new Date(userRoles[authorizedRoles[0]]), new Date());
        return authorizedRoles.every(role => this.permissions.hasOwnProperty(role) &&
            new Date(this.permissions[role]).setHours(0, 0, 0, 0) >= new Date());
    }

    isCoach(role: string = 'Calendar_Athletes'):boolean {
        return this.isAuthorized([role]);
    }

    isMyAthlete(user: IUserProfile = null):Promise<any> {
        if (!user) {
            throw 'userNotFound';
        }
        //console.log('current user', this.SessionService.getUser());
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
                if(response.data.hasOwnProperty('userProfile') && response.data.hasOwnProperty('token')) {
                    this.signOut();
                    this.SessionService.setToken(response.data);
                    //this.SocketService.open(response.data['token']).then(()=> response);
                    return response.data['userProfile'];
                } else {
                    throw new Error('dataError');
                }
            });
    }

    signOut():void {
        this.SessionService.delToken();
        this.SocketService.close({reason: 'signOut'});
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
     * Восстановление пароля
     * @param email
     * @returns {IPromise<TResult>}
     */
    resetPassword(email: string):IHttpPromise<{}>{
        return this.RESTService.postData(new ResetPasswordRequest(email)).then(result => result['data']);
    }
    /**
     * Установка нового пароля текущего пользователя
     * @param password
     * @returns {Promise<any>}
     */
    setPassword(password:string, token:string):IHttpPromise<{}> {
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

