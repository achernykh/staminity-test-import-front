function AppRun($rootScope, $timeout, $log, $location, $mdMedia, $window, Auth, User, $state, $stateParams) {
    'ngInject';
    console.log('AppRun: Start');

    // Параметры ниже передаются на вход главному компоненту сервиса StaminityApplication
    // Сессия пользователя, включает userId и набор полномочий пользователя
    $rootScope.session = {};
    $rootScope.screen = { xs : $mdMedia('gt-xs'), md : $mdMedia('gt-md'), lg : $mdMedia('gt-lg') };
    $rootScope.currentUser = null;  // Текущий пользователь сервсиа, содержит public от userProfile
    $rootScope.currentAthlete = null; // Текущий атлет тренера, содержит public от userProfile
    $rootScope.fullTitle = 'app.landing.fullTitle';
    $rootScope.description = 'app.landing.description';
    $rootScope.keywords = 'app.landing.keywords';

    /**
     * Восстанавливаем сессию пользователя из хранилища браузера
     */
    function restore(){
        "use strict";
        Auth.getSession().then(
            (session) => {
                // Если сессия установлена
                if (session) {
                    $rootScope.session = session;
                    // Устанавливаем текущего пользователя. В ответ приходит userProfile
                    User.setCurrentUser(session.userId).then(
                        (user) => {
                            $rootScope.currentUser = user;
                            $log.debug('AppRun: restoreSession => session repair for userId=', $rootScope.currentUser.userId);
                        }, (error) => {
                            // TODO случай, если по номеру сессии не удается получить обьект пользователя
                            $log.debug('AppRun: restoreSession => not find user with id =', session.userId);
                        });
                }
                // Пользовательская сессия не восстановлена
                else
                    $log.debug('AppRun: restoreSession => user session not find');

            },(error) => $log.debug('AppRun: restoreSession => error', error)
        );
    }

    /**
     *
     */
    function watch(){
        "use strict";

    }

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options) {
            "use strict";
            console.log('$stateChangeStart ', toState, toParams);
        });

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams){
            "use strict";
            $rootScope.fullTitle = 'Landing Page';
            console.log('$stateChangeSuccess ', toState, toParams);
        });

    restore();

    /**
     * Необходимо отслеживать изменения трех входящих параметров для основного компонента StaminityApplication:
     * 1) application - какое представление необходимо отобразить на экране (Календарь, Настройки...). Его значение
     * определяется через путь в браузре 2) auth - определяет текущую сессиию пользователя и содержит номер пользователя
     * и дополнительные аттрибуты. При изменение значений, они будут автоматически обработаны в компоненте через
     * &onChanges
     */

    $rootScope.$on( "$routeChangeSuccess", function() {
        let path = $location.$$path;
        $rootScope.path = path.substr(1);
				$log.debug('AppRun: Route change success:', path, $rootScope.path);
				//$rootScope.$broadcast('viewUpdate', GUIService.getParams($location.$$path.substr(1)));
			});

    /**
     * В Component Router нет возможности использования события $routerChangeStart, в котором можно было прописать
     * общий алгоритм проверки полномочий по страницам. Есть несколько решений: 1) ui-router с событиями state
     * 2) использовать $locationChangeStart, но в нем нет параметров роутера 3) создать событие $routerChangeStart -
     * http://weblogs.asp.net/dwahlin/cancelling-route-navigation-in-angularjs 4) запускать проверку параметром
     * $caActivate в каждом компоненте
     */


    $rootScope.$watch(function() { return $mdMedia('gt-xs'); }, function(result) {
        $rootScope.xs = !result;
    });
}

export default AppRun;
