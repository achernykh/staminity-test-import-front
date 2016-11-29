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
     * Восстанавливаем сессию пользователя из хранилища браузера
     */
    function restore(){
        "use strict";

        //User.currProfile().then((result)=>console.log('user=',result), (error)=>console.log('user error=', error))
        /*Auth.getSession().then(
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
        );*/
    }

    /**
     *
     */
    function watch(){
        "use strict";

    }
    /**
     *  Для переход на защищенные страницы использует проверка аутенитифкации и авторизации пользователя.
     *  Запрос полномочий осуществляется в настройках $stateProvider.state, через параметры:
     *  1) loginRequired - true/false 2) authRequired - [функции доступа]
     */
    $transitions.onBefore(
        {to: '*', from: '*'},
        (state) => {
            let toState = state.$to()
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

    $transitions.onSuccess(
        {to: '*', from: '*'}, (state) => console.info('transition success to state = ', state.$to().name)
    )

    restore();

    $rootScope.$watch(function() { return $mdMedia('gt-xs'); }, function(result) {
        $rootScope.xs = !result;
    });
}

export default AppRun;
