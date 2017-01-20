import * as moment from "moment";
import { merge } from 'angular';
import * as angular from 'angular';
import {
    _NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
    _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list, _SYNC_ADAPTORS, syncStatus
} from './settings-user.constants';

import './settings-user.component.scss';

//import 'rxjs/add/operator/subscribe';

class SettingsUserCtrl {

    constructor(UserService,AuthService,SystemMessageService,ActionMessageService,$http,$mdDialog, $auth, SyncAdaptorService) {
        console.log('SettingsCtrl constructor=',this)
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._LANGUAGE = _LANGUAGE
        this._UNITS = _UNITS
        this._country_list = _country_list;
        this._SYNC_ADAPTORS = _SYNC_ADAPTORS;
        this._UserService = UserService;
        this._AuthService = AuthService;
        this._SystemMessageService = SystemMessageService
        this._ActionMessageService = ActionMessageService
        this._$http = $http
        this._$mdDialog = $mdDialog
        this.$auth = $auth
        this.SyncAdaptorService = SyncAdaptorService;
        this.adaptors = [];
        //this.profile$ = UserService.rxProfile.subscribe((profile)=>console.log('subscribe=',profile));
        //this.dialogs = dialogs

        //this._athlete$ = AthleteSelectorService._athlete$
        //	.subscribe((athlete)=> console.log('SettingsCtrl new athlete=', athlete))
        // Смена атлета тренера в основном окне приложения, необходмо перезагрузить все данные
    }

    $onInit() {
        // deep copy test
        this.user = angular.copy(this.user);
        console.log('settings=', this, moment().format(), moment.locale());
        this.user.public = this.user.public || {};
        this.user.personal = this.user.personal || {};

        /**
         *
         * @type {any|Array|U[]}
         */
        this.adaptors = this._SYNC_ADAPTORS.map((adaptor) => {
            let settings = this.user.externalDataProviders.filter((a) => a.provider === adaptor.provider)[0];
            adaptor = (settings && settings) || adaptor;
            adaptor['status'] = syncStatus(adaptor.lastSync,adaptor.state);
            adaptor['startDate'] = (adaptor.hasOwnProperty('startDate') && new Date(adaptor.startDate)) || new Date();
            return adaptor;
        });

        this.user = Object.assign(this.user,
            {
            billing: {
                tariffs: [
                    {
                        code: 'Базовый',
                        status: '',
                        enabled: true,
                        editable: false
                    },
                    {
                        code: 'Премиум',
                        status: 'Подкючен до 30.12.16',
                        enabled: true,
                        editable: true
                    },
                    {
                        code: 'Тренер',
                        status: 'Подкоючен за счет клуба ЦПС ТЕМП',
                        enabled: true,
                        editable: false
                    },
                    {
                        code: 'Клуб',
                        status: 'Пробный период до 30.01.17',
                        enabled: false,
                        editable: false
                    }
                ],
                bills: [
                    {
                        amount: '106',
                        start: new Date(),
                        end: new Date(),
                        status: 'new'
                    },
                    {
                        amount: '1072',
                        start: new Date(),
                        end: new Date(),
                        status: 'ready'
                    },
                    {
                        amount: '360',
                        start: new Date(),
                        end: new Date(),
                        status: 'complete'
                    }
                ]
            }
        })
    }

    changeUnit(units){
        this.user.display.units = units;
        this.displayForm.$dirty = true;
    }

    changefirstDayOfWeek(number){
        this.user.display.firstDayOfWeek = number;
        this.displayForm.$dirty = true;
    }

    countrySearch(query) {
        return query ?
            Object.keys(this._country_list['ru']).filter((key)=> {
                return this._country_list['ru'][key].toLowerCase().indexOf(query.toLowerCase()) === 0
            }) : this._country_list
    }

    citySearch(query) {

        let api = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
        let language = 'ru'
        let key = 'AIzaSyAOt7X5dgVmvxcx3WCVZ0Swm3CyfzDDTcM'
        let request = {
            method: 'GET',
            url: `${api}?input=${query}&types=(cities)&language=${language}&key=${key}`,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Origin': '*'
            }
        }

        return this._$http(request)
            .then((result)=> {
                console.log('citySearch result:', result.predictions)
                return result.predictions
            }, (error) => {
                console.log('citySearch error:', error)
                return []
            })
    }

    isDirty() {
        return this.publicForm && this.publicForm.$dirty ||
            this.personalFirstForm && this.personalFirstForm.$dirty ||
            this.personalSecondForm && this.personalSecondForm.$dirty ||
            this.privateForm && this.privateForm.$dirty ||
            this.displayForm && this.displayForm.$dirty ||
            this.notificationsForm && this.notificationsForm.$dirty ||
            this.privacyForm && this.privacyForm.$dirty
    }

    isValid() {
        return this.publicForm && this.publicForm.$valid ||
            this.personalFirstForm && this.personalFirstForm.$valid ||
            this.personalSecondForm && this.personalSecondForm.$valid ||
            this.privateForm && this.privateForm.$valid ||
            this.displayForm && this.displayForm.$valid ||
            this.notificationsForm && this.notificationsForm.$valid ||
            this.privacyForm && this.privacyForm.$valid
    }

    update(form) {
        var profile = {
            userId: this.user.userId,
            revision: this.user.revision
        };
        for (var name in form) {
            if (form[name]) {
                profile[name] = this.user[name];
                console.log('settings ctrl => update profile form: ', name);
                if (name == "personal") {
                    this[name + 'FirstForm'].$setPristine();
                    this[name + 'SecondForm'].$setPristine();
                } else
                    this[name + 'Form'].$setPristine();
            }
        }
        console.log('settings ctrl => update profile form: ', profile);
        this._UserService.putProfile(profile)
            .then((success)=> {
                console.log('success=', success)
                this._ActionMessageService.simple(success)
                this.user.revision = success.value.revision
            }, (error)=> {
                //this._SystemMessageService.show(error)
                this._ActionMessageService.simple(error)
            });
    }

    get language() {

    }

    set language(id) {

    }

    get firstDayOfWeek() {
        return ((this.user.display.hasOwnProperty('firstDayOfWeek')) && moment.weekdays(this.user.display.firstDayOfWeek)) || null
    }

    set firstDayOfWeek(number) {
        this.user.display.firstDayOfWeek = number;
        this.displayForm.$dirty = true;
    }

    log() {
        console.log('settings=', this)
    }

    weekdays(day) {
        return moment.weekdays(day)
    }

    syncEnabled(adaptor) {
        return adaptor.state === "Enabled";
    }

    showProviderSettings(ev, adaptor) {

        /* Подключение стравы
        this.$auth.link('strava',{userId: this.user.userId})
            .then(function(response) {
                // You have successfully linked an account.
                console.log('auth success', response)
            })
            .catch(function(response) {
                // Handle errors here.
                console.log('auth error', response)
            });*/

        if(adaptor.status.switch) {
            this._$mdDialog.show({
                controller: DialogController,
                controllerAs: '$ctrl',
                template: require('./dialogs/provider.html'),
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    adaptor: adaptor
                },
                bindToController: true,
                clickOutsideToClose: true,
                escapeToClose: true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
                .then((form) => {
                    this.SyncAdaptorService.put(adaptor.provider, form.username, form.password,
                        form.startDate, adaptor.status.switch ? "Enabled" : "Disabled")
                        .then(response=>console.info(response), error=> adaptor.status.switch = false)
                }, () => {
                    // Если диалог открывается по вызову ng-change
                    if (typeof ev === 'undefined') adaptor.status.switch = false
                    this.status = 'You cancelled the dialog.';
                })
        }

        if(!adaptor.status.switch) {
            var confirm = this._$mdDialog.confirm()
                .title('Вы хотите отключить синхронизацию?')
                .textContent('После отключения данные из внешнего источника останутся достыпными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Продолжить')
                .cancel('Отменить');

            this._$mdDialog.show(confirm)
                .then(() => this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
                    moment(adaptor.startDate).format('YYYY-MM-DD'), adaptor.status.switch ? "Enabled" : "Disabled")
                                .then(response=>console.info(response), error=> console.error(error),
                                    () => this.status = 'You decided to keep your debt.'));
        }
    }

    showPasswordChange(ev) {
        //console.log('provider settings =', typeof ev, service, provider)

        //if(provider.enabled) {
        this._$mdDialog.show({
            controller: DialogController,
            controllerAs: '$ctrl',
            template: require('./dialogs/changepassword.html'),
            parent: angular.element(document.body),
            targetEvent: ev,
            bindToController: true,
            clickOutsideToClose: true,
            escapeToClose: true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then((password) => {
                console.log(`You said the information was ${password}.`);
                this._AuthService.setPassword(password)
                    .then((response) => {
                        console.log(response);
                        this._SystemMessageService.show(response.title, response.status);
                    }, (error) => {
                        console.log(error);
                    })
            }, () => {
                // Если диалог открывается по вызову ng-change
                if (typeof ev === 'undefined') provider.enabled = false
                this.status = 'You cancelled the dialog.';
            })
        //}
    }

    /*uploadAvatar () {
        this.dialogs.uploadPicture()
            .then((picture) => this._UserService.postProfileAvatar(picture))
            .then((user) => { this.user = user })
    }

    uploadBackground () {
        this.dialogs.uploadPicture()
            .then((picture) => this._UserService.postProfileBackground(picture))
            .then((user) => { this.user = user })
    }*/
};
SettingsUserCtrl.$inject = ['UserService','AuthService','SystemMessageService','ActionMessageService','$http','$mdDialog', '$auth','SyncAdaptorService'];

function DialogController($scope, $mdDialog) {

    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

DialogController.$inject = ['$scope','$mdDialog'];

let SettingsUser = {
    bindings: {
        user: '<'
    },
    transclude: false,
    controller: SettingsUserCtrl,
    template: require("./settings-user.component.html")
};

export default SettingsUser
