/**
 * Created by akexander on 22/07/16.
 */
class StaminityApplicationCtrl {
    constructor ($q, $log, $timeout, $location, $window, $mdDialog, $mdSidenav, $rootScope, Application, Auth, User) {
        'ngInject';
        this._$log = $log;
        this._$timeout = $timeout;
        this._$window = $window;
        this._$location = $location;
        this._$mdSidenav = $mdSidenav;
        this._$rootScope = $rootScope;
        this.settings = {};
        this._Application = Application;
        this._Auth = Auth;
        this._User = User;
        this.currentUser = null;
        this.currentAthlete = null;
        this.isAuthenticated = false;
        this.notification = 0;
    }
    toggleSlide(component){
        this._$mdSidenav(component).toggle().then(() => angular.noop);
    }
    /**
     * В инициализации контроллера компонента необходимо получить данные по текущей сессии пользователя: есть ли
     * авторизация, и если есть, то какой пользователь авторизован. В дальнешем параметрв userId будет исользован для
     * запроса всех остальных данных по окружению пользователя. Смена параметров сессии отслеживается в функции
     * $onChanges(changes = auth)
     */
    $onInit() {
        // Запрашиваем сессию пользователя
        this._Auth.getSession().then(
            (response) => {
                // Если сессия установлена
                if (response)
                    // Устанавливаем текущего пользователя. В ответ приходит userProfile
                    this._User.setCurrentUser(response.userId).then(
                        (result) => {
                            this.currentUser = result;
                            this._$log.info('StaminityApplication: onInit => session repair for userId=', this.currentUser.userId);
                        // TODO случай, если по номеру сессии не удается получить обьект пользователя
                        }, (error) => {});
                // Пользовательская сессия не восстановлена
                else
                    this._$log.debug('StaminityApplication: onInit => user session not find');

            },(error) => this._$log.debug('StaminityApplication: onInit => error', error)
        );
    }
    /**
     * Настройка отоборажания текущего представления. В набор параметров входят, стиль окна, формат отображения
     * заголовка, доступность режима выбора атлетов и т.д. Фнукция вызывается в ответ на событиее изменения
     * входящего парамтера комопнента = application, который в свою очередь меняется, когда успешно завершен переход
     * на новое состояние роутера страниц
     * @param application - совпадает с названием страницы, например, calendar, settings...
     * @returns {*}
     */
    $onChanges(changes){
          if (changes.application){
              this.settings = this._Application.getParams(this.application);
              this._$log.debug('StaminityApplication: onChange, application=', changes.application);
          }
          // TODO возможно можно обойтись без rootScope и входящего параметра auth
          if (changes.auth){
            //this._$log.debug('StaminityApplication: onChange, auth=', changes.auth);
            if (changes.auth.userId)
                this.isAuthenticated = true;
          }
    }
    $routerOnActivate(next){
        this._$log.debug('StaminityApllication: $routerOnActivate with url=', next.urlPath);
    }
    // TODO перенести в компонент application-header

    // TODO скорее всего должно быть в сервисе User
    getLanguage() {
        return this._Application.getLanguage()

    }
    // TODO Подумать о переносе в отдельный компонент AppToolbar или HeaderToolbar
    goTo(link){
        this._$location.path('link');
    }
    goBack(){
        this._$window.history.back();
    }
    // TODO Перенести в самостоятельный компонент language-selector вместе с разметкой и функцией смены
    languageClick($mdOpenMenu, $event){
        $mdOpenMenu($event);
    }
    changeLanguage(language){
        this._Application.setLanguage(language);
        //TODO: add storage
    }
    userLogin(user){
        this.currentUser = user;
    }
    userLogout(){
        this.currentUser = null;
    }
    // TODO Перенести в отдельный компонент application-header
    athleteSelect(athlete){
        this.showAthleteSelector = false;
        this.currentAthlete = athlete;
        //this._$log.debug('StaminityApplication: athleteSelect=', this.currentAthlete);
        this._$rootScope.$broadcast('changeAthlete', this.currentAthlete);
    }
    athleteDiscard(){
        this.currentAthlete = null;
        this._$rootScope.$broadcast('changeAthlete', this.currentAthlete);
    }
}

let StaminityApplication = {
    bindings: {
        application: '<',
        auth: '<',
        xs: '<'
    },
    transclude: false,
    controller: StaminityApplicationCtrl,
    templateUrl: 'layout/application/staminity-application.html',
    $routeConfig: [
        { path: "/welcome", component: "landingPage", name: "LandingPage", useAsDefault: true},
        { path: "/signin", component: "signIn", name: "SignIn"},
        { path: "/signup", component: "signUp", name: "SignUp"},
        { path: "/confirm", component: "signIn", name: "Confirm"},
        { path: "/signout", component: "signOut", name: "SignOut"},
        { path: "/calendar", component: "calendar", name: "Calendar"},
        { path: "/**", redirectTo: ["LandingPage"]}
    ]
};

export default StaminityApplication;
