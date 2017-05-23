import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import * as angular from 'angular';
import {
    _NAVBAR, _DELIVERY_METHOD, _LANGUAGE, _UNITS,
    _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list, _SYNC_ADAPTORS, syncStatus
} from './settings-user.constants';

import './settings-user.component.scss';

class SettingsUserModel {
    // deep copy test and initial data
    constructor (user) {
        Object.assign(this, {
            public: {},
            personal: {},
            display: {
                units: null,
                firstDayOfWeek: null,
                timezone: null
            }
        }, user);

        this.personal.activity = this.personal.activity || [];
        this.personal.birthday = (this.personal.hasOwnProperty('birthday') && new Date(this.personal.birthday)) || null;
    }
}

class SettingsUserCtrl {

    constructor($scope, UserService, AuthService, $http, $mdDialog, $auth, SyncAdaptorService, dialogs, message) {
        console.log('SettingsCtrl constructor=', this)
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._LANGUAGE = _LANGUAGE
        this._UNITS = _UNITS
        this._country_list = _country_list;
        this._SYNC_ADAPTORS = _SYNC_ADAPTORS;
        this.$scope = $scope;
        this._UserService = UserService;
        this._AuthService = AuthService;
        this._$http = $http
        this._$mdDialog = $mdDialog
        this.$auth = $auth
        this.SyncAdaptorService = SyncAdaptorService;
        this.dialogs = dialogs;
        this.message = message;
        this.adaptors = [];

        //this.profile$ = UserService.rxProfile.subscribe((profile)=>console.log('subscribe=',profile));
        //this.dialogs = dialogs

        //this._athlete$ = AthleteSelectorService._athlete$
        //	.subscribe((athlete)=> console.log('SettingsCtrl new athlete=', athlete))
        // Смена атлета тренера в основном окне приложения, необходмо перезагрузить все данные
    }

    $onInit() {
        // deep copy & some transormation
        this.user = new SettingsUserModel(this.user);
        /**
         *
         * @type {any|Array|U[]}
         */
        this.adaptors = this._SYNC_ADAPTORS.map((adaptor) => {
            let settings = this.user.externalDataProviders.filter((a) => a.provider === adaptor.provider)[0];
            adaptor = (settings && settings) || adaptor;
            adaptor['status'] = syncStatus(adaptor.lastSync, adaptor.state);
            adaptor['startDate'] = (adaptor.hasOwnProperty('startDate') && new Date(adaptor.startDate)) || new Date('2017-01-01');
            return adaptor;
        });

        this.timeZones = momentTimezone.tz.names().map(z => ({
            title: `(GMT${momentTimezone.tz(z).format('Z')}) ${z}`,
            name: z,
            offset: momentTimezone.tz(z).offset
        }));

        this.prepareZones();

        moment.locale('ru');
        moment.lang('ru');
    }

    prepareZones() {


    }

    setUser (user) {
        this.user = user;
        this.user.public = this.user.public || {};
        this.user.public.activityTypes = this.user.public.activityTypes || [];
        //this.$scope.$apply();
    }

    getTimezoneTitle(){
        let timezone = this.user.display.timezone;
        return (timezone && `(GMT${momentTimezone.tz(timezone).format('Z')}) ${timezone}`) || null;
    }

    changeTimezone(name){
        this.user.display.timezone = name;
        this.displayForm.$dirty = true;
    }

    changeUnit(units) {
        this.user.display.units = units;
        this.displayForm.$dirty = true;
    }

    changeFirstDayOfWeek(number) {
        this.user.display.firstDayOfWeek = number;
        this.displayForm.$dirty = true;
    }

    changeLanguage(lng) {
        this.user.display.language = lng;
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
            this.privateFirstForm && this.privateFirstForm.$dirty ||
            this.privateSecondForm && this.privateSecondForm.$dirty ||
            this.displayForm && this.displayForm.$dirty ||
            this.notificationsForm && this.notificationsForm.$dirty ||
            this.privacyForm && this.privacyForm.$dirty
    }

    isValid() {
        return this.publicForm && this.publicForm.$valid ||
            this.personalFirstForm && this.personalFirstForm.$valid ||
            this.personalSecondForm && this.personalSecondForm.$valid ||
            this.privateFirstForm && this.privateSecondForm.$valid ||
            this.privateFirstForm && this.privateSecondForm.$valid ||
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
                if (name === "personal" || name === "private") {
                    this[name + 'FirstForm'].$setPristine();
                    this[name + 'SecondForm'].$setPristine();
                } else
                    if (this.hasOwnProperty(name+'Form')) {
                        this[name + 'Form'].$setPristine();
                    }
            }
        }
        console.log('settings ctrl => update profile form: ', profile);
        this._UserService.putProfile(profile)
            .then((success)=> {
                console.log('success=', success)
                this.message.toastInfo('settingsSaveComplete');
                this.user.revision = success.value.revision
            }, (error)=> {
                this.message.toastError(error)
            });
    }

    get language() {

    }

    set language(id) {

    }

    weekdays(day) {
        return moment.weekdays(false, day);
    }

    syncEnabled(adaptor) {
        return adaptor.state === "Enabled";
    }

    changeProviderSettings(ev, adaptor){

    }

    showProviderSettings(ev, adaptor, toggle) {
        debugger;
        //1. Отключить синхронизацию через тумблер switch == off
        if(!toggle && adaptor.status.switch) {
            debugger;
            var confirm = this._$mdDialog.confirm()
                .title('Вы хотите отключить синхронизацию?')
                .textContent('После отключения данные из внешнего источника останутся доступными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Продолжить')
                .cancel('Отменить');

            this._$mdDialog.show(confirm)
                .then(() => this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
                    moment(adaptor.startDate).format('YYYY-MM-DD'), toggle ? "Enabled" : "Disabled")
                    .then(response => {
                        debugger;
                        this.updateAdaptor(adaptor, response);
                        console.info(response);
                        this.toggle[adaptor.provider] = toggle;
                    }, error => {
                        console.error(error);
                        this.toggle[adaptor.provider] = !toggle;
                    }), (error) => {
                        this.toggle[adaptor.provider] = !toggle;
                        //adaptor.status.switch = true;
                    });

        } else if(toggle && !adaptor.status.switch && adaptor.isOAuth && adaptor.status.code === 'offSyncNeverEnabled') { //2. Подключить OAuth синхронизацию
            debugger;
            // Подключение стравы
            this.$auth.link(adaptor.provider,{
                internalData: {
                    userId: this.user.userId,
                    startDate: moment().subtract(3,'months'),
                    postAsExternalProvider: true,
                    provider: adaptor.provider
                }
            }).then(response => {
                debugger;
                // You have successfully linked an account.
                this.updateAdaptor(adaptor, response.data.data);
                console.log('response', response);
                this.toggle[adaptor.provider] = toggle;
            }, error => {
                    debugger;
                    this.message.toastInfo(error.errorMessage || error.data.errorMessage);
                    this.toggle[adaptor.provider] = !toggle;
                }).catch(response => {
                    // Handle errors here.
                    debugger;
                    console.error('response', response);
                    this.message.toastInfo(response);
                    this.toggle[adaptor.provider] = !toggle;
            });
        } //3. Подключить user/pass синхронизацию или 4. Изменить настройки синхронизации
        else if(toggle) {
            debugger;
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
            }).then((form) => {
                debugger;
                if (adaptor.status.code === 'offSyncNeverEnabled') {// подключение
                    this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
                        .then(response => {
                        debugger;
                        this.updateAdaptor(adaptor, response);
                        console.info(response);
                        this.toggle[adaptor.provider] = toggle;
                    },
                        error => {
                            this.message.toastError(error);
                            return !toggle;
                        });
                } else { // операция изменения данных подключения
                    this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
                        form.startDate, toggle ? "Enabled" : "Disabled")
                        .then(response => {
                            this.updateAdaptor(adaptor, response);
                            this.toggle[adaptor.provider] = toggle;
                        }, error => {
                            this.message.toastError(error);
                            this.toggle[adaptor.provider] = !toggle;
                        });
                }
            });/*, () => {
                    // Если диалог открывается по вызову ng-change
                    if (typeof ev === 'undefined') {
                        adaptor.status.switch = false
                    }
                    this.status = 'You cancelled the dialog.';
                });
            }*/
        } else if (toggle && !adaptor.status.switch && typeof ev === 'undefined') {

        }

        return;

                debugger;
        if (adaptor.status.switch) { // Идет подключение или настройка подключенного провайдера
            if(adaptor.isOAuth && adaptor.status.code === 'offSyncNeverEnabled') { // Если идет подключение по OAuth

            } else {  // Идет подключение или изменение синхронизации
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
                }).then((form) => {
                    debugger;
                    if (adaptor.status.switch) {// операция изменения данных подключения
                        this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
                            .then(response => {
                                debugger;
                                this.updateAdaptor(adaptor, response);
                                console.info(response);
                            },
                            error => {
                                this.message.toastError(error);
                                adaptor.status.switch = false;
                            });
                    } else { // подключение
                        this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
                            form.startDate, adaptor.status.switch ? "Enabled" : "Disabled")
                            .then(response => {
                                this.updateAdaptor(adaptor, response);
                            }, error => this.message.toastError(error));
                    }
                }, () => {
                    // Если диалог открывается по вызову ng-change
                    if (typeof ev === 'undefined') {
                        adaptor.status.switch = false
                    }
                    this.status = 'You cancelled the dialog.';
                });
            }
        } else { // Выполняется отлкючение синхронизации
            var confirm = this._$mdDialog.confirm()
                .title('Вы хотите отключить синхронизацию?')
                .textContent('После отключения данные из внешнего источника останутся доступными, последующие данные синхронизированы не будут. Нажмите "Продолжить" для отключения или "Отменить" для сохранения параметров синхронизации')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Продолжить')
                .cancel('Отменить');

            this._$mdDialog.show(confirm)
                .then(() => this.SyncAdaptorService.put(adaptor.provider, adaptor.username, adaptor.password,
                    moment(adaptor.startDate).format('YYYY-MM-DD'), adaptor.status.switch ? "Enabled" : "Disabled")
                    .then(response => {
                        debugger;
                        this.updateAdaptor(adaptor, response);
                        console.info(response);
                    }, error => {
                        console.error(error);
                    }), (error) => {
                        //adaptor.status.switch = true;
                    });
        }
    }

    updateAdaptor(adaptor, response){
        let idx = this.adaptors.findIndex(a => a.provider === adaptor.provider);
        this.adaptors[idx].state = response.state;
        this.adaptors[idx].lastSync = response.lastSync;
        this.adaptors[idx].status = syncStatus(response.lastSync, response.state);
        //this.$scope.$apply();
        this.message.toastInfo('settingsSaveComplete');
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
                        this.message.toastInfo('setPasswordSuccess');
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

    uploadAvatar() {
        this.dialogs.uploadPicture()
            .then(picture => this._UserService.postProfileAvatar(picture))
            .then(user => this.setUser(user))
            .then(() => this.message.toastInfo('updateAvatar'))
            //.then(user => this.)
    }

    uploadBackground() {
        this.dialogs.uploadPicture()
            .then((picture) => this._UserService.postProfileBackground(picture))
            .then(user => this.setUser(user))
            .then(() => this.message.toastInfo('updateBackgroundImage'))
    }

	toggleActivity (activity) {

        this.personalSecondForm.$setDirty();
		if (this.isActivityChecked(activity)) {
			let index = this.user.personal.activity.indexOf(activity);
			this.user.personal.activity.splice(index, 1);
		} else {
			this.user.personal.activity.push(activity);
		}
	}

	isActivityChecked (activity) {
		return this.user.personal.activity.includes(activity)
	}
};
SettingsUserCtrl.$inject = ['$scope','UserService','AuthService','$http',
    '$mdDialog', '$auth', 'SyncAdaptorService', 'dialogs','message'];

function DialogController($scope, $mdDialog) {

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

DialogController.$inject = ['$scope', '$mdDialog'];

let SettingsUser = {
    bindings: {
        user: '<',
        athlete: '<'
    },
    transclude: false,
    controller: SettingsUserCtrl,
    template: require("./settings-user.component.html")
};

export default SettingsUser
