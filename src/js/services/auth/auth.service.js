import {_UserRoles} from '../../config/app.constants.js';
import {PostData, PostFile, IRESTService} from '../api/rest.service'

export default class AuthService {
    constructor($q, $log, $rootScope, $timeout, API, StorageService, UserService, SessionService, RESTService){
        'ngInject';
        this.session = null;
        this._$q = $q;
        this._$log = $log;
        this._$rootScope = $rootScope;
        this._$timeout = $timeout;
        this._StorageService = StorageService;
        this._UserService = UserService;
        this._api = API;
        this._SessionService = SessionService;
        this._RESTService = RESTService;
    }
    /**
     *
     * @returns {*}
     */
    getSession(){

        return !!this.session ? this.session: new Promise ((resolve, reject) => {
            this._StorageService.getToken('authToken').then(
                (data) => {
                    // если данные не найдены в хранилище, то data == null
                    // если данные найдены по сессии, то осуществялет вход и запуск websocket сессии
                    if (data) this.login(data)
                    resolve(this.session)
                },
                (error) => reject(error)
            )
        })
    }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определ, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    isAuthenticated(){
        return !!this._SessionService.getToken()
    }

    /**
     * Проверка полномочий пользователя. Запрашивается как для перехода по отдельным страницам сервиса, так и для
     * отображения или скрытия отдельных частей экрана. Полномочия пользователя определяются по его активным подпискам,
     * которые передаются в обьекте userProfile.subscriptions. Доступ по страницам описан в контстанте _PageAccess, где
     * параметром является ссылка на окно (calendar, settings..)
     * @param authorizedRoles - заправшиваемая роль в формате массива, напрмимер ['proUser', 'coach']
     * @returns {boolean}
     */
    isAuthorized(authorizedRoles) {

        // TODO модель полномочий изменилась на функциональную с ролевой, код ниже надо переписать

        return new Promise((resolve) => {
            this._UserService.permissions.then((roles)=> resolve(roles))
        })

        /*
        // Роли пользователя храняться в UserService
        let userRoles = this._User.getCurrentUserRole();
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        // Обьединяем массивы прав пользователя и массив запрашиваемых прав.
        // Если колчиество элементов полученного массива меньше, чем сумма элементов двух
        // исходных массивов, то это означает, что необходимые права у пользователя есть

        let unionRoles = authorizedRoles.concat(userRoles.filter( (item) => {
            return authorizedRoles.indexOf(item) < 0}));

        //this._$log.debug('AuthService: check authorized for=', authorizedRoles, userRoles, authorizedRoles.length, unionRoles.length, userRoles.length, this.isAuthenticated(),(unionRoles.length < (authorizedRoles.length + userRoles.length)));

        return (this.isAuthenticated() && (unionRoles.length < (authorizedRoles.length + userRoles.length))) ||
            (authorizedRoles == _UserRoles.all);*/
    }

	/**
	 * Регистрация пользователя
	 * @param request
	 * @returns {Promise<any>}
	 */
    signUp(request) {
        return this._RESTService.postData(new PostData('/signup',request))
	        .then((response) => {
				return response.value; // ожидаем получить systemMessage
			})
    }

	/**
	 * Вход пользователя
	 * @param request
	 * @returns {Promise<any>|Promise<TResult2|TResult1>|Promise<TResult>|*|Promise.<TResult>}
	 */
	signIn(request) {
        return this._RESTService.postData(new PostData('/signin',request))
            .then((response) => {
                // Согласно API результат передается в {data: [0]}, в value лежит authToken
                return response.data[0].value
            })
        /*return this._api.post('/signin', request).then(
            (success) => {
                this._$log.debug('AuthService: signIn => response success:', success);
                // Регистрируем полученную сессию, для дальнейшей работы сервиса
                this.login(success[success.map(x => x.type).indexOf('authToken')].value);
                // Открываем веб-сокет сессию
                this._api.wsOpen( this.session.token);
                return  this.session;
            },
            (error) => this._$log.debug('AuthService: signIn => response error:', error)
        );*/
    }

	/***
	 * Выход пользователя из сервиса
	 * @returns {*}
	 */
	signOut() {
        return this._api.post('/signout').finally(
            () => {
                // Закрываем ws сессию
                this._api.wsClose()
                // Очищаем данные по открытой сессии
                this.logout()
                // Сообщаем rootScope, что данные по авторизации изменились
                // TODO Очищаем данные хранилища браузера, если был установлен режим
                this._StorageService.clear('authToken')
            }
        )
    }
    confirmAccount(request) {
        return this._api.post('/confirm', request);
    }
    login(data){
        return this.session = data;
        //this._api.wsOpen(this.session.token);
    }
    logout(){
        //this._$log.debug('AuthService: session clear for userid=', this.session.userId);
        this.session = null;
        this._api.wsClose();
    }
}