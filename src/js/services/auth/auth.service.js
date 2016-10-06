import {_UserRoles} from '../../config/app.constants.js';

export default class AuthService {
    constructor($q, $log, $rootScope, $timeout, API, Storage, User){
        'ngInject';
        this.session = null;
        this._$q = $q;
        this._$log = $log;
        this._$rootScope = $rootScope;
        this._$timeout = $timeout;
        this._Storage = Storage;
        this._User = User;
        this._api = API;
        //this.firstAuthRequest = true;
    }
    /**
     *
     * @returns {*}
     */
    getSession(){
        let result = this._$q.defer();

        if (this.session != null)
            result.resolve(this.session);
        else
            this._Storage.get('authToken').then(
                (data) => {
                    this._$log.debug('AuthService: getSession success, data =', data);
                    this.login(data);
                    result.resolve(this.session)
                },(error) => result.reject(error)
            );
         return result.promise;
    }

    /**
     * Проверка аутентификации пользователя. Если атрибут session определ, значит сессия пользователя установлена.
     * Параметр session может быть определен при получении обьекта authToken во время запроса api/signin, или
     * восстанолен при инициализации приложения из хранилища браузера. Провервка авторизации используется как для
     * отображения отдельных закрытых страниц сервиса для не зарегестрированных пользователей
     * @returns {boolean} - true - авторизован, false - не авторизован
     */
    isAuthenticated(){
        /*if (this.firstAuthRequest) {
            this._$timeout(()=> angular.noop(),5000).then(()=> {
                this._$log.info('AuthService: isAuthenticated', !!this.session, this.firstAuthRequest);
                this.firstAuthRequest = false;
                return !!this.session;
            });
        } else {
            this._$log.info('AuthService: isAuthenticated', !!this.session, this.firstAuthRequest);
            return !!this.session;
        }*/
        this._$log.debug(`AuthService: isAuthenticated() check`);
        return !!this.session;
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
            (authorizedRoles == _UserRoles.all);
    }
    signUp(request) {
        return this._api.post('/signup', request);
    }
    signIn(request) {
        return this._api.post('/signin', request).then(
            (success) => {
                this._$log.debug('AuthService: signIn => response success:', success);
                // Регистрируем полученную сессию, для дальнейшей работы сервиса
                this.login(success[success.map(x => x.type).indexOf('authToken')].value);
                // Открываем веб-сокет сессию
                this._api.wsOpen( this.session.token);
                return  this.session;
            },
            (error) => this._$log.debug('AuthService: signIn => response error:', error)
        );
    }
    signOut() {
        return this._api.post('/signout').finally(
            () => {
                //this._$log.debug('AuthService: logout start...');
                // Закрываем ws сессию
                this._api.wsClose();
                // Очищаем данные по открытой сессии
                this.logout();
                // Сообщаем rootScope, что данные по авторизации изменились
                // TODO Очищаем данные хранилища браузера, если был установлен режим ???
                this._Storage.clear('authToken');
            }
        );
    }
    confirmAccount(request) {
        return this._api.post('/confirm', request);
    }
    login(data){
        this.session = data;
    }
    logout(){
        //this._$log.debug('AuthService: session clear for userid=', this.session.userId);
        this.session = null;
    }
}