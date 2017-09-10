import { Observable, Subject } from 'rxjs/Rx';
import moment from 'moment/min/moment-with-locales.js';
import * as momentTimezone from 'moment-timezone';
import * as angular from 'angular';

import {
    _NAVBAR, _DELIVERY_METHOD, _UNITS,
    _PRIVACY_LEVEL, _ZONE_CALCULATION_METHOD, _country_list, _SYNC_ADAPTORS, syncStatus
} from './settings-user.constants';
import { parseYYYYMMDD } from '../share/share.module';
import './settings-user.component.scss';


let emptyUser = {
    public: {

    },
    personal: {
        activity: []
    },
    display: {
        units: null,
        firstDayOfWeek: null,
        timezone: null,
        language: null
    }
};


class SettingsUserCtrl {

    constructor ($scope, UserService, AuthService, $http, $mdDialog, $auth, SyncAdaptorService, dialogs, message, BillingService, $translate, $mdMedia, display) {
        this.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._UNITS = _UNITS
        this._country_list = _country_list;
        this._SYNC_ADAPTORS = _SYNC_ADAPTORS;

        this.$scope = $scope;
        this.UserService = UserService;
        this.AuthService = AuthService;
        this.$http = $http
        this.$mdDialog = $mdDialog
        this.$auth = $auth
        this.SyncAdaptorService = SyncAdaptorService;
        this.dialogs = dialogs;
        this.message = message;
        this.BillingService = BillingService;
        this.$translate = $translate;
        this.$mdMedia = $mdMedia;
        this.display = display;

        this.destroy = new Subject();
        this.adaptors = [];

        console.log('SettingsUserCtrl', SettingsUserCtrl);
    }

    $onInit () {
        this.UserService.currentUser
        .takeUntil(this.destroy)
        .subscribe(this.setUser.bind(this));

        this.BillingService.messages
        .takeUntil(this.destroy)
        .subscribe(this.reload.bind(this));

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
    }

    $onDestroy () {
        this.destroy.next(); 
        this.destroy.complete();
    }

    setUser (user) {
        this.user = angular.copy(user);
    }

    successHandler (message) {
        return () => this.message.toastInfo(message);
    }
    
    errorHandler () {
        return (info) => {
            this.message.systemWarning(info);
            throw info;
        }
    }

    reload () {
        this.UserService.getProfile(this.user.public.uri)
        .then(this.setUser.bind(this), this.errorHandler());
    }

    prepareZones () {

    }

    getTimezoneTitle () {
        let timezone = this.user.display.timezone;
        return (timezone && `(GMT${momentTimezone.tz(timezone).format('Z')}) ${timezone}`) || null;
    }

    getDateFormat () {
        return moment().format('L');
    }

    changeLocale (locale) {
        this.user.display.language = locale;
        this.displayForm.$dirty = true;
    }

    changeTimezone (name) {
        this.user.display.timezone = name;
        this.displayForm.$dirty = true;
    }

    changeUnit (units) {
        this.user.display.units = units;
        this.displayForm.$dirty = true;
    }

    changeFirstDayOfWeek (number) {
        this.user.display.firstDayOfWeek = number;
        this.displayForm.$dirty = true;
    }

    countrySearch (query) {
        let countries = this._country_list[this.display.getLocale()];
        let regexp = new RegExp(query, 'i');

        return query ? Object.keys(countries).filter((key) => ~countries[key].search(regexp)) : countries;
    }

    citySearch (query) {
        let language = this.display.getLocale();
        let api = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
        let key = 'AIzaSyAOt7X5dgVmvxcx3WCVZ0Swm3CyfzDDTcM'
        let request = {
            method: 'GET',
            url: `${api}?input=${query}&types=(cities)&language=${language}&key=${key}`,
            headers: {
                'Access-Control-Allow-Headers': 'Content-Type, Content-Range, Content-Disposition, Content-Description',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Origin': '*'
            }
        };

        return this._$http(request).then((result) => result.predictions, (error) => []);
    }

    isDirty () {
        return this.publicForm && this.publicForm.$dirty ||
            this.personalFirstForm && this.personalFirstForm.$dirty ||
            this.personalSecondForm && this.personalSecondForm.$dirty ||
            this.privateFirstForm && this.privateFirstForm.$dirty ||
            this.privateSecondForm && this.privateSecondForm.$dirty ||
            this.displayForm && this.displayForm.$dirty ||
            this.notificationDirty ||
            this.privacyForm && this.privacyForm.$dirty
    }

    isValid () {
        return this.publicForm && this.publicForm.$valid ||
            this.personalFirstForm && this.personalFirstForm.$valid ||
            this.personalSecondForm && this.personalSecondForm.$valid ||
            this.privateFirstForm && this.privateSecondForm.$valid ||
            this.privateFirstForm && this.privateSecondForm.$valid ||
            this.displayForm && this.displayForm.$valid ||
            this.notificationsForm && this.notificationsForm.$valid ||
            this.privacyForm && this.privacyForm.$valid
    }

    update (form) {
        for (let name in form) {
            if (form[name]) {
                if (name === "personal" || name === "private") {
                    this[name + 'FirstForm'].$setPristine();
                    this[name + 'SecondForm'].$setPristine();
                } else if (this.hasOwnProperty(name+'Form')) {
                    this[name + 'Form'].$setPristine();
                }
            }
        }

        this.UserService.updateCurrentUser(this.user)
        .then(this.successHandler('settingsSaveComplete'), this.errorHandler());
    }

    weekdays (day) {
        return moment.weekdays(false, day);
    }

    syncEnabled (adaptor) {
        return adaptor.state === "Enabled";
    }

    changeProviderSettings (ev, adaptor){

    }

    showProviderSettings (ev, adaptor, toggle) {

        //1. Отключить синхронизацию через тумблер switch == off
        if(!toggle && adaptor.status.switch) {

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
            // Подключение стравы
            this.$auth.link(adaptor.provider,{
                internalData: {
                    userId: this.user.userId,
                    startDate: moment().subtract(3,'months'),
                    postAsExternalProvider: true,
                    provider: adaptor.provider
                }
            }).then(response => {
                // You have successfully linked an account.
                this.updateAdaptor(adaptor, response.data.data);
                console.log('response', response);
                this.toggle[adaptor.provider] = toggle;
            }, error => {
                    if (error.hasOwnProperty('stack') && error.stack.indexOf('The popup window was closed') !== -1) {
                        this.message.toastInfo('userCancelOAuth');
                    } else {
                        this.message.toastInfo(error.data.errorMessage || error.errorMessage || error);
                    }
                    this.toggle[adaptor.provider] = !toggle;
                }).catch(response => {
                    // Handle errors here.
                    console.error('response', response);
                    this.message.toastInfo(response);
                    this.toggle[adaptor.provider] = !toggle;
            });
        } //3. Подключить user/pass синхронизацию или 4. Изменить настройки синхронизации
        else if(toggle) {
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
                if (adaptor.status.code === 'offSyncNeverEnabled') {// подключение
                    this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
                        .then(response => {
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
                    if (adaptor.status.switch) {// операция изменения данных подключения
                        this.SyncAdaptorService.post(adaptor.provider, form.username, form.password, form.startDate)
                            .then(response => {
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
                        this.updateAdaptor(adaptor, response);
                        console.info(response);
                    }, error => {
                        console.error(error);
                    }), (error) => {
                        //adaptor.status.switch = true;
                    });
        }
    }

    updateAdaptor (adaptor, response) {
        let idx = this.adaptors.findIndex(a => a.provider === adaptor.provider);
        this.adaptors[idx].state = response.state;
        this.adaptors[idx].lastSync = response.lastSync;
        this.adaptors[idx].status = syncStatus(response.lastSync, response.state);
        //this.$scope.$apply();
        this.message.toastInfo('settingsSaveComplete');
    }

    showPasswordChange (ev) {
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
        }).then((password) => {
            this.AuthService.setPassword(password)
            .then(this.successHandler('setPasswordSuccess'))
            .catch(this.errorHandler());
        });
    }

    tariffStatus (tariff) {
        return this.BillingService.tariffStatus(tariff);
    }

    tariffIsEnabled (tariff) {
        return (isOn) => {
            if (typeof isOn === 'undefined') {
                return tariff.isOn;
            }

            return tariff.isOn? this.disableTariff(tariff) : this.enableTariff(tariff);
        }
    }

    selectTariff (tariff) {
        if (!tariff.isBlocked) {
            tariff.isOn? this.viewTariff(tariff) : this.enableTariff(tariff);
        }
    }

    enableTariff (tariff) {
        return this.dialogs.enableTariff(tariff, this.user)
            .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    disableTariff (tariff) {
        return (tariff.isAvailable && tariff.isBlocked?
            this.BillingService.disableTariff(tariff.tariffId, this.user.userId)
            .then((info) => {
                message.systemSuccess(info.title);
                $mdDialog.hide();
            }, (error) => {
                message.systemWarning(error);
            }) : this.dialogs.disableTariff(tariff, this.user)
        )
        .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    viewTariff (tariff) {
        return this.dialogs.tariffDetails(tariff, this.user)
            .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    invoiceStatus (bill) {
        return this.BillingService.billStatus(bill);
    }

    hasPaidBill () {
        return this.user.billing.bills.find((bill) => bill.receiptDate);
    }

    billsList () {
        return this.dialogs.billsList(this.user)
            .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    viewBill (bill) {
        return this.dialogs.billDetails(bill, this.user)
            .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    autoPayment (isOn) {
        if (typeof isOn === 'undefined') {
            return this.user.billing.autoPayment;
        }

        let userChanges = { 
            billing: { autoPayment: isOn } 
        };

        this.UserService.updateCurrentUser(userChanges)
        .then(this.successHandler('settingsSaveComplete'))
        .catch(this.errorHandler());
    }

    uploadAvatar () {
        this.dialogs.uploadPicture()
        .then(picture => this.UserService.postProfileAvatar(picture))
        .then(this.successHandler('updateAvatar'))
        .catch(this.errorHandler());
    }

    uploadBackground () {
        this.dialogs.uploadPicture()
        .then((picture) => this.UserService.postProfileBackground(picture))
        .then(this.successHandler('updateBackgroundImage'))
        .catch(this.errorHandler());
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

SettingsUserCtrl.$inject = [
    '$scope', 'UserService', 'AuthService', '$http', '$mdDialog', '$auth', 'SyncAdaptorService', 'dialogs', 'message', 'BillingService', '$translate', '$mdMedia', 'DisplayService'
];


function DialogController($scope, $mdDialog) {

    $scope.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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
