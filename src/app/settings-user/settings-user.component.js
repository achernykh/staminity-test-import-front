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

    constructor ($scope, SessionService, UserService, AuthService, $http, $mdDialog, $auth, SyncAdaptorService, dialogs, message, BillingService, $translate, $mdMedia, display) {
        this.passwordStrength = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        this._NAVBAR = _NAVBAR
        this._ACTIVITY = ['run', 'swim', 'bike', 'triathlon', 'ski']
        this._DELIVERY_METHOD = _DELIVERY_METHOD
        this._PRIVACY_LEVEL = _PRIVACY_LEVEL
        this._UNITS = _UNITS
        this._country_list = _country_list;
        this._SYNC_ADAPTORS = _SYNC_ADAPTORS;

        this.$scope = $scope;
        this.SessionService = SessionService;
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

        /**this.SessionService.getObservable()
            .takeUntil(this.destroy)
            .map((session) => session.userProfile)
            .distinctUntilChanged()
            .subscribe(this.setUser.bind(this));**/

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

    isOwnSettings () {
        return this.SessionService.isCurrentUserId(this.user.userId);
    }

    setUser (user) {

        if (user.userId === this.user.userId) {
            this.user = angular.copy(user);
        }

        this.user = angular.merge(this.user, { personal: { activity: [] } });
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
        if(this.user.public.isCoach) {
            this.checkProfileComplete();
        }
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

        this.UserService.putProfile(this.user)
        .then(this.successHandler('settingsSaveComplete'), this.errorHandler());
    }

    /**
     * Проверка полноты заполнения профиля тренера
     */
    checkProfileComplete() {
        debugger;
        if ((this.user.public.avatar !== 'default.jpg') &&
            (this.user.public.firstName && this.user.public.lastName) &&
            (this.user.personal.city && this.user.personal.country) &&
            (this.user.personal.about && this.user.personal.about.length > 5) &&
            (this.user.personal.price && this.user.personal.price.length > 5) &&
            (this.user.personal.contact && this.user.personal.contact.length > 5) &&
            (this.user.privacy.some(s => s.key === 'userProfile.personal' && s.setup === 10))) {

            this.user.public.profileComplete = true;

        } else { this.user.public.profileComplete = false; }
    }

    isProfileComplete() {

    }

    changeProviderSettings (ev, adaptor){

    }

    showPasswordChange (ev) {
        this.$mdDialog.show({
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

    hasPaidBill () {
        return this.user.billing.bills.find((bill) => bill.receiptDate);
    }

    billsList () {
        return this.dialogs.billsList(this.user)
            .then(this.reload.bind(this), (error) => { error && this.reload(); });
    }

    autoPayment (isOn) {
        if (typeof isOn === 'undefined') {
            return this.user.billing.autoPayment;
        }

        let userChanges = {
            billing: { autoPayment: isOn }
        };

        this.UserService.putProfile(userChanges)
        .then(() => {
            this.user.billing.autoPayment = isOn;
            this.message.toastInfo('settingsSaveComplete');
            this.$scope.$apply();
        })
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
    '$scope', 'SessionService', 'UserService', 'AuthService', '$http', '$mdDialog', '$auth', 'SyncAdaptorService', 'dialogs', 'message', 'BillingService', '$translate', '$mdMedia', 'DisplayService'
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
