import {_PageAccess} from '../config/app.constants.js';


class AuthCtrl {
    constructor(AuthService, SystemMessageService){
        'ngInject'
        this._AuthService = AuthService;
        this._SystemMessageService = SystemMessageService;
        this.enabled = true;

    }

    signin(credentials){
        this.enabled = false; // форма ввода недоступна до получения ответа
        this._AuthService.signIn(credentials)
            .finally(()=>this.enabled = true)
            .then((success) => {
                console.log('signin success=', success)
            }, (error) => {
                console.log('signin error=', error)
                this._SystemMessageService.show(error)
            })
    }
}

export let Auth = {
    bindings: {
        view: '<'
    },
    transclude: false,
    controller: AuthCtrl,
    templateUrl: "auth/auth.html"
}

class SignUpCtrl {
    constructor($log, AuthService) {
        'ngInject';
        this._$log = $log;
        this._AuthService = AuthService;
        this.state = 'form';
        this.formEnabled = true;
        this.credentials = {
            firstName: 'Alexander',
            lastName: 'Chernykh',
            email: 'chernykh@me.com',
            password: 'qPTwkl!1234',
            personal: {
                role: true
            }
        }
    }
    $onInit() {

    }

    /**
     * Регистрация нового пользователя
     * @param credentials
     */
    onSignUp(credentials) {
        this.formEnabled = false;
        credentials.personal.role = credentials.personal.role ? 'coach' : 'user';
        this._AuthService.signUp(credentials).then(
            (result) => {
                this._$log.debug('SignUp: onSignUp success = ', result);
                this.changeState('confirm');
            }, (error) => {
                this._$log.debug('SignUp: onSignUp error = ', error);
            });
    }
    changeState(state){
        this.state = state;
    }

}

class SignOutCtrl {
    constructor ($log, $location, $timeout, AuthService, User) {
        'ngInject';
        this._$log = $log;
        this._$location = $location;
        this._$timeout = $timeout;
        this._AuthService = AuthService;
        this._User = User;
    }
    $onInit(){
        this._$log.debug('SignOut: onInit()');
        this._AuthService.signOut().finally(() => {
                this._User.logout();
                this.app.userLogout();
                this._$timeout(() => this._$location.path("/welcome"),3000);
            }
        )
    }
}

class SignInCtrl {
    constructor ($q, $log, $location, AuthService, Storage, User) {
        'ngInject';
        this._$log = $log;
        this._$q = $q;
        this._$location = $location;
        this._AuthService = AuthService;
        this._Storage = Storage;
        this._User = User;
        this.request = 'request';
        this.storage = false;
        this.formEnabled = true;
        this.credentials = {
            email: 'chernykh@me.com',
            password: 'qPTwkl!1234'
        }
    }
    $onInit(){
    }
    $routerOnActivate(next){
        /**
         * Если в строке присутсвует параметр request - значит пользователь прошел по ссылке на активацию аккаунта.
         * Необходимо подтвердить актуальность ссылки на сервере и если все ок, то предложить ввести свой логин и пароль
         */
        if(next.params[this.request])
            this._AuthService.confirmAccount(next.params[this.request]).then(
                (result) => this.$router.navigate(['SignIn']),
                (error) => {

                }
            )
    }

    /**
     * Активация/деактивация хранения данных в localStorage. Если установлено false, то данные будут сохраняться в
     * sessionStorage
     * @param value
     */
    onStorage(value){
        this._Storage.setIncognitoSession(value);
    }
    onSignIn(credentials){
        this._Storage.setIncognitoSession(this.storage);
        this.formEnabled = false;
        this._AuthService.signIn(credentials).then(
            (response) => {
                this._$log.debug('SignIn: SignIn success, response', response);
                // Устанавливаем текущего пользователя
                this._User.setCurrentUser(response.userId).then(
                    (result) => {
                        this.app.userLogin(result);
                        this._$log.debug('SignIn: SignIn success, userId=', this.app.currentUser.userId);
                        this.$router.navigate(['Calendar']);
                    }, (error) => {});

            }, (error) => {
                this._$log.debug('SignIn: SignIn error = ', error);
                this.formEnabled = true;
            });
    }
}
export let SignOut = {
    bindings: {
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: SignOutCtrl,
    templateUrl: 'auth/state/signin.html'
};

export let SignUp = {
    bindings: {
    },
    transclude: false,
    controller: SignUpCtrl,
    templateUrl: 'auth/state/signup.html'
};

export let SignIn = {
    bindings: {
        $router: '<'
    },
    require: {
        app: '^staminityApplication'
    },
    transclude: false,
    controller: SignInCtrl,
    templateUrl: 'auth/state/signin.html'
};

