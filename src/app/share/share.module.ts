import './components.scss';
import './notification/notification.scss';
import { module, isObject } from 'angular';
import { StateProvider } from "angular-ui-router";
import moment from 'moment/min/moment-with-locales.js';
import  { ageGroup } from '../../../api/user/user.interface';
import  { requestType } from '../../../api/group/group.interface';
import * as _connection from '../core/env.js';
import BackgroundComponent from './background/background.component';
import HeaderComponent from './header/header.component';
import ApplicationMenu from './application-menu/application-menu.component';
import UserMenuComponent from './user-menu/user-menu.component';
import {_application_menu} from './application-menu/application-menu.translate';
import {_user_menu} from "./user-menu/user-menu.tranlsate";
import {_MEASURE_TRANSLATE} from './measure/measure.translate';
import LoaderComponent from './loader/loader.component';
import LoaderService from './loader/loader.service';
import DialogsService from './dialogs';
import RequestsComponent from './requests/requests.component.js';
import {
    _measurement,
    _activity_measurement_view,
    _measurement_calculate,
    _measurement_system_calculate,
    _measurement_pace_unit,
    isDuration,
    isPace,
    measurementUnit,
    measurementUnitView,
    measurementUnitDisplay, measureValue, measureUnit, Measure
} from './measure/measure.constants';
import {duration} from './measure/measure.filter';
import {MeasurementInput} from "./measure/measure.directive";
import AthleteSelectorComponent from "./athlete-selector/athlete-selector.component";
import {translateRequestPanel} from "./requests/request.translate";
import {translateDialogs} from "./dialogs/dialogs.translate";
import {translateNotification} from "./notification/notification.translate";
import NotificationListComponent from "./notification/notification-list.component";
import NotificationService from "./notification/notification.service";
import {InitiatorType} from "../../../api/notification/notification.interface";
import { memorize, maybe, prop } from "./util.js";
import {calcTimezoneTime} from "./date/date.filter";
import PageNotFoundComponent from "./404/404.component";
import {Ng1StateDeclaration} from "angular-ui-router/lib/index";
import {_translate_PageNotFound} from "./404/404.translate";
import UniversalChartComponent from "./universal-chart/universal-chart.component";
import {translateHeader} from "./header/header.translate";
import {compareTo} from "./directives/form.directive";
import {SessionService} from "../core";
import ApplicationFrameComponent from "./application-frame/application-frame.component";
import ApplicationUserToolbarComponent from "./application-user-toolbar/application-user-toolbar.component";
import ApplicationProfileTemplateComponent from "./application-frame/profile-template/profile-template.component";
import { shareStates } from "./share.states";
import { htmlToPlainText } from "./text/plain-text.filter";
import { quillConfig } from "./quill/quill.config";


export const parseUtc = memorize(date => moment.utc(date));

export const parseYYYYMMDD = memorize(date => moment(date, 'YYYY-MM-DD'));

export const fromNow = () => (date) => moment.utc(date).fromNow(true);


const image = () => (sub: string, url:string = 'default.jpg') : string => {
    return url.indexOf('http') !== -1 ? url : _connection.content + '/content' + sub + url;
};

const userBackground = () => (url:string) => url && url !== 'default.jpg' ? _connection.content + '/content/user/background/' + url : '/assets/picture/default_background.jpg';

const avatar = () => (user) => `url(${user && user.public && user.public.hasOwnProperty('avatar') && user.public.avatar !== 'default.jpg' ? image() ('/user/avatar/',user.public.avatar) : '/assets/picture/default_avatar.png'})`;

const userName = () => (user, options) => maybe(user) (prop('public')) (
    options === 'short'? prop('firstName') : ({ firstName, lastName }) => `${firstName} ${lastName}`
) ();

const clubName = () => (club) => maybe(club) (prop('public')) (prop('name')) ();

const avatarUrl = () => (avatar: string, type: InitiatorType = InitiatorType.user):string => {
    let url: string = '/assets/picture/default_avatar.png';
    switch (type) {
        case InitiatorType.user: {
            url = `url(${avatar && avatar !== 'default.jpg' ? image() ('/user/avatar/', avatar) : '/assets/picture/default_avatar.png'})`;
            break;
        }
        case InitiatorType.group: case InitiatorType.club: {
            url = `url(${avatar ? image() ('/group/avatar/',avatar) : image() (null,'/assets/picture/default_avatar.png')})`;
            break;
        }
        case InitiatorType.provider: {
            url = `url(/assets/icon/${avatar.toLowerCase()}_on.png)`;
            break;
        }
        case InitiatorType.staminity: {
            url = `url(/assets/icon/apple-touch-icon-57x57.png)`;
            break;
        }
    }
    return url;
};

const isPremium = () => (userProfile) => userProfile && userProfile.billing.find((tariff) => tariff.tariffCode === 'Premium');

const truncate = () => (s, max = 140) => s && (s.length <= max? s : s.slice(0, max - 1) + '…');

const userpic = {
    bindings: {
        profile: '<',
        isPremium: '<',
        unlink: '<'
    },
    transclude: true,
    controller: ['$scope', class UserpicController {
        constructor ($scope) {
        }
    }],
    template: require('./userpic.component.html') as string
};

const AvatarPicComponent = {
    bindings: {
        type: '<',
        avatar: '<',
        sref: '<',
        isPremium: '<'
    },
    controller: ['$scope', class AvatarPicCtrl {
        constructor ($scope) {
        }
    }],
    template: require('./avatar-pic.component.html') as string
};

const userInfo = {
    bindings: {
        user: "<"
    },
    template: require('./user-info.component.html') as string
};

function onFiles() {
    return {
        scope: {
            onFiles: "<"
        },

        link (scope, element, attributes) {
            let onFiles = (event) => (scope) => scope.onFiles(event.target.files);
            element.bind("change", (event) => scope.$apply(onFiles(event)));
        }
    };
}

function autoFocus() {
    return {
        link: {
            post (scope, element, attr) {
                element[0].focus();
            }
        }
    };
}

const Share = module('staminity.share', ['ui.router','pascalprecht.translate'])
    .filter('calcTimezoneTime', calcTimezoneTime)
    .filter('fromNow', fromNow)
    .filter('avatar', avatar)
    .filter('avatarUrl', avatarUrl)
    .filter('image', image)
    .filter('userBackground', userBackground)
    .filter('username', userName)
    .filter('username', userName)
    .filter('isPremium', isPremium)
    .filter('clubName', clubName)
    .filter('ageGroup', () => ageGroup)
    .filter('requestType', () => (request) => requestType(request) + '.action')
    .filter('measureCalc', () => measureValue)
    .filter('measureCalcInterval', ['$filter',($filter) => {
        return (input: {intensityLevelFrom: number, intensityLevelTo: number}, sport: string, name: string, chart:boolean = false, units:string = 'metric') => {
            if (!input.hasOwnProperty('intensityLevelFrom') || !input.hasOwnProperty('intensityLevelTo')) {
                return null;
            }

            let measure: Measure = new Measure(name,sport,input.intensityLevelFrom);

            if(input.intensityLevelFrom === input.intensityLevelTo){
                return $filter('measureCalc')(input.intensityLevelFrom,sport,name,chart,units);
            } else if (measure.isPace()) {
                return $filter('measureCalc')(input.intensityLevelTo,sport,name,chart,units)+'-'+$filter('measureCalc')(input.intensityLevelFrom,sport,name,chart,units);
            } else {
                return $filter('measureCalc')(input.intensityLevelFrom,sport,name,chart,units)+'-'+$filter('measureCalc')(input.intensityLevelTo,sport,name,chart,units);
            }
        };
    }])
    .filter('measureUnit', () => measureUnit)
    .filter('duration', duration)
    .filter('percentByTotal', ['$filter',($filter)=> {
        return (value, total, decimal = 0) => {
            if (value && total) {
                return $filter('number')((value/total)*100,decimal)+'%';
            }
        };
    }])
    .filter('percent', ['$filter',($filter)=> {
        return (value, decimal = 0) => {
            if (value >= 0) {
                return $filter('number')(value*100,decimal)+'%';
            }
        };
    }])
    .filter('measureEdit',['$filter',($filter)=>{
        return (measure, value, sport) => {
            let unit = measurementUnitDisplay(sport, measure);
            if(isDuration(unit)) {
                return new Date(moment().startOf('day').seconds(value));
            } else if(isPace(unit)){
                return new Date(moment($filter('measureCalc')(value,sport,measure),'mm:ss'));
            } else {
                return Number($filter('measureCalc')(value,sport,measure));
            }
        };
    }])
    .filter('measureSave',['SessionService',(session: SessionService)=> {
        return (measure, value,sport) => {

            let unit = measurementUnitDisplay(sport, measure);

            if(isDuration(unit)) {
                return moment(value, ['ss','mm:ss','hh:mm:ss']).diff(moment().startOf('day'),'seconds');
            } else {
                if (isPace(unit)) {
                    value = moment(value,['ss','mm:ss']).diff(moment().startOf('day'),'seconds');
                }
                // обратный пересчет по системе мер
                if (session.getUser().display.units !== 'metric'){
                    value = value / _measurement_system_calculate[unit].multiplier;
                }
                // пересчет от единиц представления в еденицы обмена данными
                if (unit !== measurementUnit(measure)) {
                    value = _measurement_calculate[unit][measurementUnit(measure)](value);
                }

                return value;
            }
        };
    }])
    //https://github.com/petebacondarwin/angular-toArrayFilter
    .filter('toArray', function () {
        return function (obj, addKey) {
            if (!isObject(obj)){
                return obj;
            }
            if ( addKey === false ) {
                return Object.keys(obj).map(function(key) {
                    return obj[key];
                });
            } else {
                return Object.keys(obj).map(function (key) {
                    var value = obj[key];
                    return isObject(value) ?
                        Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
                    { $key: key, $value: value };
                });
            }
        };
    })
    .component('stApplicationFrame', ApplicationFrameComponent)
    .component('stApplicationUserToolbar', ApplicationUserToolbarComponent)
    .filter('htmlToPlainText', htmlToPlainText)
    .component('staminityBackground',BackgroundComponent)
    .component('staminityHeader',HeaderComponent)
    .component('userMenu',UserMenuComponent)
    .component('applicationMenu',ApplicationMenu)
    .service('LoaderService',LoaderService)
    .service('NotificationService', NotificationService)
    .service("dialogs", DialogsService)
    .component('loader', LoaderComponent)
    .component('userInfo', userInfo)
    .component('requests', RequestsComponent)
    .component('userpic', userpic)
    .component('avatarPic', AvatarPicComponent)
    .component('athleteSelector', AthleteSelectorComponent)
    .component('notificationList', NotificationListComponent)
    .component('pageNotFound', PageNotFoundComponent)
    .component('universalChart', UniversalChartComponent)
    .directive("onFiles", onFiles)
    .directive('autoFocus', autoFocus)
    .directive('measureInput', ['$filter',MeasurementInput])
    .directive('compareTo', compareTo) // сравниваем значение в поля ввода (пароли)
    .filter('truncate', truncate)
    .component('stApplicationProfileTemplate', ApplicationProfileTemplateComponent)
    .constant('quillConfig', quillConfig)
    .config(['$stateProvider', ($stateProvider: StateProvider) => shareStates.map(s => $stateProvider.state(s))])
    .config(['$translateProvider',($translateProvider)=>{

        $translateProvider.translations('ru', {appMenu: _application_menu['ru']});
        $translateProvider.translations('en', {appMenu: _application_menu['en']});
        $translateProvider.translations('ru', {userMenu: _user_menu['ru']});
        $translateProvider.translations('en', {userMenu: _user_menu['en']});
        $translateProvider.translations('ru',_MEASURE_TRANSLATE.ru);
        $translateProvider.translations('en',_MEASURE_TRANSLATE.en);
        $translateProvider.translations('ru', {request: translateRequestPanel['ru']});
        $translateProvider.translations('en', {request: translateRequestPanel['en']});
        $translateProvider.translations('ru', {dialogs: translateDialogs['ru']});
        $translateProvider.translations('en', {dialogs: translateDialogs['en']});
        $translateProvider.translations('ru', translateNotification['ru']);
        $translateProvider.translations('en', translateNotification['en']);
        $translateProvider.translations('ru', {'404': _translate_PageNotFound['ru']});
        $translateProvider.translations('en', {'404': _translate_PageNotFound['en']});
        $translateProvider.translations('ru', {header: translateHeader['ru']});
        $translateProvider.translations('en', {header: translateHeader['en']});
    }])
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал
    .run(['$templateCache',($templateCache)=>{
        $templateCache.put('header/appmenutoolbar.html', require('./header/panels/appmenutoolbar.html') as string);
        $templateCache.put('header/backbar.html', require('./header/panels/backbar.html') as string);
        $templateCache.put('header/logo.html', require('./header/panels/logo.html') as string);
        $templateCache.put('header/usertoolbar.html', require('./header/panels/usertoolbar.html') as string);
        $templateCache.put('header/welcome.links.html', require('./header/panels/welcome.links.html') as string);
        $templateCache.put('header/backbar.html', require('./header/panels/backbar.html') as string);
        $templateCache.put('notification/notification.html', require('./notification/notification.html') as string);
    }])
    .name;

export default Share;