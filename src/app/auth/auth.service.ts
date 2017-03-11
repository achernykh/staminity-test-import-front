import {PostData, IRESTService} from '../core/rest.service';
import {SetPasswordRequest} from '../../../api/auth/auth.request';
import {ISessionService} from "../core/session.service";
import {IHttpService, IHttpPromise, IHttpPromiseCallbackArg, IPromise} from 'angular';
import {ISocketService} from "../core/socket.service";
import {IUserProfile} from "../../../api/user/user.interface";


export interface IAuthService {
    isAuthenticated():boolean;
    isAuthorized(roles:Array<string>):boolean;
    isCoach(role?: string):boolean;
    isMyAthlete(user: IUserProfile):boolean;
    isActivityPlan(role?: Array<string>):boolean;
    signIn(request:Object):IPromise<void>;
    signUp(request:Object):IHttpPromise<{}>;
    signOut():void;
    confirm(request:Object):IHttpPromise<{}>;
    setPassword(request:Object):IHttpPromise<{}>;

}

export default class AuthService implements IAuthService {

    static $inject = ['SessionService', 'RESTService', 'SocketService'];

    constructor(private SessionService:ISessionService,
                private RESTService:IRESTService,
                private SocketService:ISocketService) {

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

    isMyAthlete(user: IUserProfile = null):boolean {
        if (!user) {
            return false;
        }
        console.log('current user', this.SessionService.getUser());
        let athletes: Array<any> = this.SessionService.getUser()['connections']['allAthletes']['groupMembers'] || null;
        if (!athletes || !athletes.some(profile => profile.userId === user.userId)) {
            return false;
        }
        return true;
    }

    isActivityPlan(role: Array<string> = ['ActivitiesPlan_User','ActivitiesPlan_Athletes']):boolean {
        return this.isAuthorized([role[0]]) || this.isAuthorized([role[1]]);
    }

    /**
     * Регистрация пользователя
     * @param request
     * @returns {Promise<any>}
     */
    signUp(request):IHttpPromise<{}> {
        return this.RESTService.postData(new PostData('/signup', request))
            .then(response => {
                return response['value'];
            });
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
        return this.RESTService.postData(new PostData('/confirm', request))
            .then((result) => {
                return result['value'];
            }); // Ожидаем system message
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
}

