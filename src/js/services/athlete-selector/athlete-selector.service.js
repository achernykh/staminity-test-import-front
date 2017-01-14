export default class AthleteSelectorService {
    constructor($compile, $timeout, $rootScope, $mdDialog) {
        'ngInject';
        this.count = 0;
        this._$compile = $compile;
        this._$timeout = $timeout;
        this._$rootScope = $rootScope;
        //this._athlete$ = new Rx.Subject();
        //this.athlete = this.athlete.asObservable();
        this._$mdDialog = $mdDialog
    }

    show(ev) {
        this._$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            templateUrl: 'services/athlete-selector/athlete-selector.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: {
                athletes: [
                    {
                        userProfile: {
                            userId: 12,
                            public: {
                                firstName: 'Александр',
                                lastName: 'Черных',
                                uri: ''
                            }
                        }
                    },
                    {
                        userProfile: {
                            userId: 13,
                            public: {
                                firstName: 'Евгений',
                                lastName: 'Захаринский',
                                uri: ''
                            }
                        }
                    },
                    {
                        userProfile: {
                            userId: 14,
                            public: {
                                firstName: 'Егвений',
                                lastName: 'Хабаров',
                                uri: ''
                            }
                        }
                    }
                ]
            },
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: true // Only for -xs, -sm breakpoints.
        })
            .then((answer) => {
                console.log(`You said the information was ${answer}.`);
                //this._athlete$.onNext(answer)
                /*this._AuthService.setPassword(password)
                    .then((response) => {
                        console.log(response)
                        this._SystemMessageService.show(response.title, response.status,)
                    }, (error) => {
                        console.log(error)
                    })*/
            }, () => {
                // Если диалог открывается по вызову ng-change
                if (typeof ev === 'undefined') provider.enabled = false
                this.status = 'You cancelled the dialog.';
            })
        //}
    }

    set() {

    }

    get() {

    }

    subscribe() {

    }

    toggle() {

        let element = angular.element(document.getElementsByTagName('athlete-selector'))

        if (element[0] === 'undefined') console.log('not exist')
        // Если элемент уже открыт, то закрываем его, если нет то создаем обьект
        if (element.length > 0)
            element.remove()
        else {
            angular
                .element(document.getElementsByTagName('staminity-application'))
                .append(this._$compile(
                    '<athlete-selector show="true"></athlete-selector>')(this._$rootScope));

            if (!this._$rootScope.$$phase)
                this._$rootScope.$apply();
        }
    }
}

function DialogController($scope, $mdDialog) {
    'ngInject'
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}