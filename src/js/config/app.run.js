function AppRun($rootScope, $mdMedia, AuthService, $transitions) {
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
     *  Для переход на защищенные страницы использует проверка аутенитифкации и авторизации пользователя.
     *  Запрос полномочий осуществляется в настройках $stateProvider.state, через параметры:
     *  1) loginRequired - true/false 2) authRequired - [функции доступа]
     */
    $transitions.onBefore(
        {to: '*', from: '*'},
        (state) => {
            let toState = state.$to()
            $rootScope.isLoading = true;
            console.info('transition start to state = ', state.$to().name)
            return new Promise((resolve, reject) => {

                    if (toState.loginRequired) {
                        // Проверка авторизации
                        if (AuthService.isAuthenticated()) {
                            console.log('transition check authenticated success')
                            if (!!toState.authRequired)
                            // Проверка полномочий
                                AuthService.isAuthorized(toState.authRequired)
                                    .then(()=>{
                                        console.log('transition check authorized success')
                                        resolve()
                                    },
                                    ()=>{
                                        console.log('transition check authorized error')
                                        reject()
                                    })
                        }
                        else {
                            console.log('transition check authenticated error')
                            reject()
                        }
                    } else resolve()

            })
        }
    )

    $transitions.onSuccess({to: '*', from: '*'}, (state) => $rootScope.isLoading = false)

    restore();

    $rootScope.$watch(function() { return $mdMedia('gt-xs'); }, function(result) {
        $rootScope.xs = !result;
    });
}

export default AppRun;
