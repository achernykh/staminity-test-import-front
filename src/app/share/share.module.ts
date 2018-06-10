import "./components.scss";
import "./notification/notification.scss";
import { module, isObject } from "angular";
import { StateProvider } from "angular-ui-router";
import { requestType } from "../../../api/group/group.interface";
import BackgroundComponent from "./background/background.component";
import HeaderComponent from "./header/header.component";
import ApplicationMenu from "./application-menu/application-menu.component";
import UserMenuComponent from "./user-menu/user-menu.component";
import { _application_menu } from "./application-menu/application-menu.translate";
import { _user_menu } from "./user-menu/user-menu.tranlsate";
import { _MEASURE_TRANSLATE } from "./measure/measure.translate";
import LoaderComponent from "./loader/loader.component";
import LoaderService from "./loader/loader.service";
import DialogsService from "./dialogs/";
import { translateDialogs } from "./dialogs/dialogs.translate";
import RequestsComponent from "./requests/requests.component.js";
import { translateRequestPanel } from "./requests/request.translate";
import { MeasurementInput } from "./measure/measure.directive";
import { duration } from "./measure/measure.filter";
import NotificationListComponent from "./notification/notification-list.component";
import NotificationService from "./notification/notification.service";
import { translateNotification } from "./notification/notification.translate";
import { memorize, maybe, prop } from "./util.js";
import { calcTimezoneTime, fromNow } from "./date/date.filter";
import PageNotFoundComponent from "./404/404.component";
import { _translate_PageNotFound } from "./404/404.translate";
import UniversalChartComponent from "./universal-chart/universal-chart.component";
import { translateHeader } from "./header/header.translate";
import { compareTo } from "./directives/form.directive";
import ApplicationFrameComponent from "./application-frame/application-frame.component";
import ApplicationUserToolbarComponent from "./application-user-toolbar/application-user-toolbar.component";
import ApplicationProfileTemplateComponent from "./application-frame/profile-template/profile-template.component";
import { shareStates } from "./share.states";
import { htmlToPlainText } from "./text/plain-text.filter";
import { quillConfig } from "./quill/quill.config";
import { stQuillPostImage } from "./quill/st-quill-post-image.directive";
import { keyboardShortcut } from "./keyboard/keyboard-shortcut.filter";
import AthleteSelectorComponent from "./athlete-selector/athlete-selector.component";
import { measurePrintIntensity } from "./measure/measure-print-intensity.filter";
import { stringToDate } from "./date/stringToDate.filter";
import { ApplicationGuestMenuComponent } from "./application-guest-menu/application-guest-menu.component";
import { QuillHtmlViewerComponent } from "./quill/quill-html-viewer.component";
import { OmniFabComponent } from "./omni/omni-fab.component";
import { OmniFormComponent } from "./omni/form/omni-form.component";
import { OmniService } from "./omni/omni.service";
import { fullImageUrl, avatarUrl } from "./image/image.functions";
import { measureValue, measureUnit, measureCalcInterval, measureSave, measureEdit } from "./measure/measure.functions";
import { autoFocus } from "./directives/autofocus.directive";
import { onFiles } from "./directives/onfiles.directive";
import { truncateFilter } from "./text/truncate.filter";
import { toUppercase } from "./text/text.functions";
import { countToDirective } from "./animation/count-to.directive";

// import

const Share = module("staminity.share", ["ui.router", "pascalprecht.translate"])
    .filter("calcTimezoneTime", calcTimezoneTime)
    .filter("fromNow", fromNow)
    .filter("avatarUrl", avatarUrl)
    .filter("image", fullImageUrl)
    .filter("clubName", () => (club) => maybe(club)(prop('public'))(prop('name'))())
    .filter("requestType", () => (request) => requestType(request) + ".action")
    .filter('measureCalc', () => measureValue)/**
     .filter("measureCalc", ["SessionService", (session: SessionService) =>
     (input: number,
     sport: string,
     measure: string,
     chart:boolean = false,
     units:string = session.getUser().display.units) => {
             if (!input) { return input;}

            let unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].unit) ||
                    (_measurement[measure].hasOwnProperty('view') && _measurement[measure]['view']) || _measurement[measure].unit;
            let fixed = ((_activity_measurement_view[sport].hasOwnProperty(measure)) && _activity_measurement_view[sport][measure].fixed) || _measurement[measure].fixed;
            // Необходимо пересчет единиц измерения
            if (unit !== _measurement[measure].unit){
                input = _measurement_calculate[_measurement[measure].unit][unit](input);
            }
            // Необходим пересчет системы мер
            if (units && units === 'imperial' && _measurement_system_calculate.hasOwnProperty(unit)){
                input = _measurement_system_calculate[unit].multiplier(input);
            }
            // Показатель релевантен для пересчета скорости в темп
            if (!chart && (isDuration(unit) || isPace(unit))){
                let format = input >= 60*60 ? 'HH:mm:ss' : 'mm:ss';
                let time = moment().startOf('day').millisecond(input*1000).startOf('millisecond');

                if(time.milliseconds() >= 500) {time.add(1, 'second');}
                    return time.format(format);
                }
                else {
                    return Number(input).toFixed(fixed);
                }
         }
     ])**/
    /**.filter("measureCalcInterval", ["$filter", ($filter) => {
        return (input: {intensityLevelFrom: number, intensityLevelTo: number}, sport: string, name: string, chart: boolean = false, units: string = "metric") => {
            if (!input.hasOwnProperty("intensityLevelFrom") || !input.hasOwnProperty("intensityLevelTo")) {
                return null;
            }
            const measure: Measure = new Measure(name, sport, input.intensityLevelFrom);
            if (input.intensityLevelFrom === input.intensityLevelTo) {
                return $filter("measureCalc")(input.intensityLevelFrom, sport, name, chart, units);
            } else if (measure.isPace()) {
                return $filter("measureCalc")(input.intensityLevelTo, sport, name, chart, units) + "-" + $filter("measureCalc")(input.intensityLevelFrom, sport, name, chart, units);
            } else {
                return $filter("measureCalc")(input.intensityLevelFrom, sport, name, chart, units) + "-" + $filter("measureCalc")(input.intensityLevelTo, sport, name, chart, units);
            }
        };
    }])**/
    .filter('measureCalcInterval', measureCalcInterval)
    .filter("measureUnit", () => measureUnit)
    /**
     .filter("measureUnit", ['SessionService', (session:SessionService) => {
        return (measure,
                sport = 'default',
                units = session.getUser().display.units): string => {

            let unit: string;
            try {
                unit = ((_activity_measurement_view[sport].hasOwnProperty(measure)) &&
                    _activity_measurement_view[sport][measure].unit) ||
                    (_measurement[measure].hasOwnProperty('view') && _measurement[measure]['view']) ||
                    _measurement[measure].unit;

                unit = (units && units === 'imperial' && _measurement_system_calculate.hasOwnProperty(unit)) ?
                    _measurement_system_calculate[unit].unit :
                    unit;
            } catch (e) {console.error('measureUnit error', e, measure, sport, units);}
            return unit;
        };
    }])**/
    .filter("duration", duration)
    .filter("percentByTotal", ["$filter", ($filter) => {
        return (value, total, decimal = 0) => {
            if ( value && total ) {
                return $filter("number")((value / total) * 100, decimal) + "%";
            }
        };
    }])
    .filter("percent", ["$filter", ($filter) => {
        return (value, id, decimal = 0, percent: boolean = true) => {
            if ( value ) {
                return `${$filter('number')(value * 100, decimal)}${percent ? '%' : ''}`;
            }
        };
    }])
    .filter("stPercent", ["$filter", ($filter) => {
        return (value, decimal = 0, percent: boolean = true) => {
            if ( value ) {
                return `${$filter('number')(value * 100, decimal)}${percent ? '%' : ''}`; //$filter('number')(value*100,decimal) + percent ? '%': '';
            }
        };
    }])
    .filter("stNumberCeil", () => (input: number) => input && Math.ceil(input))
    .filter('measureEdit', () => measureEdit)
    /**.filter("measureEdit", ["$filter", ($filter) => {
        return (measure, value, sport) => {
            let unit = measurementUnitDisplay(sport, measure);
            if(isDuration(unit)) {
                return new Date(moment().startOf('day').seconds(value));
            } else if(isPace(unit)){
                return new Date(moment($filter('measureCalc')(value,sport,measure),'mm:ss'));
            } else {
                return Number($filter("measureCalc")(value, sport, measure));
            }
        };
    }])**/
    .filter('measureSave', () => measureSave)
    /**.filter("measureSave", ["SessionService", (session: SessionService) => {
        return (measure, value, sport) => {

            const unit = measurementUnitDisplay(sport, measure);
            if (isDuration(unit)) {
                return moment(value, ["ss", "mm:ss", "hh:mm:ss"]).diff(moment().startOf("day"), "seconds");
            } else {
                if (isPace(unit)) {
                    value = moment(value, ["ss", "mm:ss"]).diff(moment().startOf("day"), "seconds");
                }
                // обратный пересчет по системе мер
                if (session.getUser().display.units === "imperial" && _measurement_system_calculate[unit]) {
                    let convertUnit: string = _measurement_system_calculate[unit].unit;
                    value = _measurement_system_calculate[convertUnit].multiplier(value);
                }
                // пересчет от единиц представления в еденицы обмена данными
                if (unit !== measurementUnit(measure)) {
                    value = _measurement_calculate[unit][measurementUnit(measure)](value);
                }
                return value;
            }
        };
    }])**/
    //https://github.com/petebacondarwin/angular-toArrayFilter
    .filter("toArray", function () {
        return function (obj, addKey) {
            if ( !isObject(obj) ) {
                return obj;
            }
            if ( addKey === false ) {
                return Object.keys(obj).map(function (key) {
                    return obj[key];
                });
            } else {
                return Object.keys(obj).map(function (key) {
                    const value = obj[key];
                    return isObject(value) ?
                        Object.defineProperty(value, "$key", { enumerable: false, value: key }) :
                    { $key: key, $value: value };
                });
            }
        };
    })
    .filter('keyboardShortcut', keyboardShortcut)
    .component('stApplicationFrame', ApplicationFrameComponent)
    .component('stApplicationUserToolbar', ApplicationUserToolbarComponent)
    .filter('htmlToPlainText', htmlToPlainText)
    .filter('stMeasurePrintIntensity', measurePrintIntensity)
    .filter('stUppercase', toUppercase)
    .component('staminityBackground', BackgroundComponent)
    .component('staminityHeader', HeaderComponent)
    .component('userMenu', UserMenuComponent)
    .component('applicationMenu', ApplicationMenu)
    .component('stApplicationGuestMenu', ApplicationGuestMenuComponent)
    .service('LoaderService', LoaderService)
    .service('NotificationService', NotificationService)
    .service("dialogs", DialogsService)
    .component('loader', LoaderComponent)
    .component('requests', RequestsComponent)
    .component('athleteSelector', AthleteSelectorComponent)
    .component('notificationList', NotificationListComponent)
    .component('pageNotFound', PageNotFoundComponent)
    .component('universalChart', UniversalChartComponent)
    .component('stQuillHtmlViewer', QuillHtmlViewerComponent)
    .component('stOmniFab', OmniFabComponent)
    .component('stOmniForm', OmniFormComponent)
    .service('OmniService', OmniService)
    .directive("onFiles", onFiles)
    .directive('autoFocus', autoFocus)
    .directive('measureInput', ['$filter', MeasurementInput])
    .directive('compareTo', compareTo) // сравниваем значение в поля ввода (пароли)
    .directive('stQuillPostImage', stQuillPostImage)
    .directive('countTo', ['$timeout', countToDirective])
    .filter('truncate', truncateFilter)
    .filter('stringToDate', stringToDate)
    .component('stApplicationProfileTemplate', ApplicationProfileTemplateComponent)
    .constant('quillConfig', quillConfig)
    .config(['$stateProvider', ($stateProvider: StateProvider) => shareStates.map(s => $stateProvider.state(s))])
    .config(['$translateProvider', ($translateProvider)=> {

        $translateProvider.translations('ru', { appMenu: _application_menu['ru'] });
        $translateProvider.translations('en', { appMenu: _application_menu['en'] });
        $translateProvider.translations('ru', { userMenu: _user_menu['ru'] });
        $translateProvider.translations('en', { userMenu: _user_menu['en'] });
        $translateProvider.translations('ru', _MEASURE_TRANSLATE.ru);
        $translateProvider.translations('en', _MEASURE_TRANSLATE.en);
        $translateProvider.translations('ru', { request: translateRequestPanel['ru'] });
        $translateProvider.translations('en', { request: translateRequestPanel['en'] });
        $translateProvider.translations('ru', { dialogs: translateDialogs['ru'] });
        $translateProvider.translations('en', { dialogs: translateDialogs['en'] });
        $translateProvider.translations('ru', translateNotification['ru']);
        $translateProvider.translations('en', translateNotification['en']);
        $translateProvider.translations('ru', { '404': _translate_PageNotFound['ru'] });
        $translateProvider.translations('en', { '404': _translate_PageNotFound['en'] });
        $translateProvider.translations('ru', { header: translateHeader['ru'] });
        $translateProvider.translations('en', { header: translateHeader['en'] });
    }])
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал
    .run(['$templateCache', ($templateCache)=> {
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
