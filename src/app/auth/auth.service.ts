import {PostData, IRESTService} from '../core/rest.service';
import {SetPasswordRequest} from '../../../api/auth/auth.request';
import {ISessionService} from "../core/session.service";
import { IHttpService, IHttpPromise } from 'angular';


export interface IAuthService {
	isAuthenticated():boolean;
	isAuthorized(roles: Array<string>):boolean;
	signIn(request: Object): IHttpPromise<{}>;
	signUp(request: Object): IHttpPromise<{}>;
	confirm(request: Object): IHttpPromise<{}>;
	setPassword(request: Object): IHttpPromise<{}>;

}

export default class AuthService implements IAuthService{

	static $inject = ['SessionService','RESTService'];

	constructor(
		private SessionService: ISessionService,
		private RESTService: IRESTService){

	}

	/**
	 * Проверка аутентификации пользователя. Если атрибут session определен, значит сессия пользователя установлена.
	 * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
	 * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
	 * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
	 * @returns {boolean} - true - авторизован, false - не авторизован
	 */
	isAuthenticated():boolean{
		return !!this.SessionService.getToken();
	}

	/**
	 * Проверка полномочий пользователя
	 * @param authorizedRoles
	 * @returns {boolean}
	 */
	isAuthorized(authorizedRoles):boolean {
		// TODO модель полномочий изменилась на функциональную с ролевой, код ниже надо переписать
		return true;
	}

	/**
	 * Регистрация пользователя
	 * @param request
	 * @returns {Promise<any>}
	 */
	signUp(request):IHttpPromise<{}> {
		return this.RESTService.postData(new PostData('/signup',request))
			.then(response => {return response['value'];});
	}

	/**
	 * Вход пользователя
	 * @param request
	 * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
	 */
	signIn(request):IHttpPromise<{}> {
		return this.RESTService.postData(new PostData('/signin',request))
			.then((response) => {return response['data'];});
	}

	/**
	 * Подтверждение регистрации пользователя
	 * @param request
	 * @returns {Promise<any>}
	 */
	confirm(request):IHttpPromise<{}> {
		return this.RESTService.postData(new PostData('/confirm',request))
			.then((result) => {return result['value'];}); // Ожидаем system message
	}
	/**
	 * Установка нового пароля текущего пользователя
	 * @param password
	 * @returns {Promise<any>}
	 */
	setPassword(password, token = this.SessionService.getToken()):IHttpPromise<{}> {
		return this.RESTService.postData(new SetPasswordRequest(token, password))
			.then((result) => {return result['data'];}); // Ожидаем system message
	}
}

