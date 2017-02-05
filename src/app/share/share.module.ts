import { module } from 'angular';
import moment from 'moment/src/moment.js';
import  { ageGroup } from '../../../api/user/user.interface';
import  { requestType } from '../../../api/group/group.interface';

import { _connection } from '../core/api.constants';
import BackgroundComponent from './background/background.component';
import HeaderComponent from './header/header.component';
import ApplicationMenu from './application-menu/application-menu.component';
import UserMenuComponent from './user-menu/user-menu.component';
import {_application_menu} from './application-menu/application-menu.translate';
import {_user_menu} from "./user-menu/user-menu.tranlsate";
import {_MEASURE_TRANSLATE} from './measure.translate';
import LoaderComponent from './loader/loader.component';
import LoaderService from './loader/loader.service';
import DialogsService from './dialogs/';
import RequestsComponent from './requests/requests.component.js';

import {
    _measurement,
    _activity_measurement_view,
    _measurement_calculate,
    _measurement_system_calculate,
    _measurement_pace_unit
} from './measure.constants';

import './components.scss';
import GroupService from "../core/group.service";
import UserService from "../core/user.service";

const fromNow = () => (date) => moment(date).fromNow(true);
const image = () => (relativeUrl) => _connection.content + '/content' + relativeUrl;
const avatar = () => (user) => `url(${user && user.public && user.public.avatar? image() ('/user/avatar/' + user.public.avatar) : '/assets/avatar/default.png'})`;
const username = () => (user, options) => options === 'short' ? `${user.public.firstName}` : `${user.public.firstName} ${user.public.lastName}`;

const userpic = {
    bindings: {
        profile: '<',
        isPremium: '<'
    },
    controller: ['$scope', class UserpicController {
        constructor ($scope) {
            console.log('UserpicController', this, $scope);
        }
    }],
    template: require('./userpic.component.html') as string
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
            let onFiles = (event) => (scope) => { scope.onFiles(event.target.files) ;};
            element.bind("change", (event) => { scope.$apply(onFiles(event)); });
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

const Share = module('staminity.share', [])
    .filter('fromNow', fromNow)
    .filter('avatar', avatar)
    .filter('image', image)
    .filter('username', username)
    .filter('ageGroup', () => ageGroup)
    .filter('requestType', () => requestType)
    .filter('measureCalc', ['UserService',(UserService)=> {
        return (data, sport, measure) => {
            if (!!data) {
                let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit;
                let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed;

                // Необходимо пересчет единиц измерения
                if (unit !== _measurement[measure].unit){
                    data = _measurement_calculate[_measurement[measure].unit][unit](data);
                }

                // Необходим пересчет системы мер
                if (UserService.profile.display.units !== 'metric'){
                    data = data * _measurement_system_calculate[unit].multiplier;
                }

                // Показатель релевантен для пересчета скорости в темп
                if (_measurement_pace_unit.indexOf(unit) !== -1){
                    return moment().startOf('day').seconds(data).format('mm:ss');
                }
                else {
                    return Number(data).toFixed(fixed);
                }
            }
        };
    }])
    .filter('measureUnit', ['UserService',(UserService)=> {
        return (measure, sport) => {
            let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) || _measurement[measure].unit;
            return (UserService.profile.display.units === 'metric') ? unit : _measurement_system_calculate[unit].unit;
        };
    }])
    .filter('duration', ()=> {
        return (second = 0) => {
            return moment().startOf('day').seconds(second).format('H:mm:ss');
        };
    })
    .component('staminityBackground',BackgroundComponent)
    .component('staminityHeader',HeaderComponent)
    .component('userMenu',UserMenuComponent)
    .component('applicationMenu',ApplicationMenu)
    .service('LoaderService',LoaderService)
    .service("dialogs", DialogsService)
    .component('loader', LoaderComponent)
    .component('userInfo', userInfo)
    .component('requests', RequestsComponent)
    .component('userpic', userpic)
    .directive("onFiles", onFiles)
    .directive('autoFocus', autoFocus)
    .config(['$translateProvider',($translateProvider)=>{

        $translateProvider.translations('ru', {appMenu: _application_menu['ru']});
        $translateProvider.translations('en', {appMenu: _application_menu['en']});
        $translateProvider.translations('ru', {userMenu: _user_menu['ru']});
        $translateProvider.translations('en', {userMenu: _user_menu['en']});
        $translateProvider.translations('ru',_MEASURE_TRANSLATE.ru);
        $translateProvider.translations('en',_MEASURE_TRANSLATE.en);
    }])
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал
    .run(['$templateCache',($templateCache)=>{
        $templateCache.put('header/appmenutoolbar.html', require('./header/panels/appmenutoolbar.html') as string);
        $templateCache.put('header/backbar.html', require('./header/panels/backbar.html') as string);
        $templateCache.put('header/logo.html', require('./header/panels/logo.html') as string);
        $templateCache.put('header/usertoolbar.html', require('./header/panels/usertoolbar.html') as string);
        $templateCache.put('header/welcome.links.html', require('./header/panels/welcome.links.html') as string);
    }])
    .name;

export default Share;