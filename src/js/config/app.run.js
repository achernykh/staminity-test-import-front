function AppRun($rootScope, $timeout, $log, $location, $mdMedia, $window) {
    'ngInject';
    $log.debug('AppRun: Start');

    $rootScope.path = '';
    $rootScope.auth = {};
    $rootScope.xs = $mdMedia('gt-xs');


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
