import { module } from 'angular';
import satellizer from 'satellizer';
import SettingsUserComponent from './settings-user.component.js';
import SyncAdaptorService from './sync-adaptor.service';
import configure from './settings-user.config';
import SettingsZonesComponent from "./settings-zones/settings-zones.component";
import SettingsZonesEditComponent from "./settings-zones-edit/settings-zones-edit.component";
import SettingsNotificationComponent from "./settings-notification/settings-notification.component";

const SettingsUser = module('staminity.settings-user', [satellizer])
    .service('SyncAdaptorService', SyncAdaptorService)
    .component('settingsUserPersonal',{template: require('./articles/settings.personal.html') as string})
    .component('settingsUser', SettingsUserComponent)
    .component('settingsZones', SettingsZonesComponent)
    .component('settingsZonesEdit', SettingsZonesEditComponent)
    .component('settingsNotification', SettingsNotificationComponent)
    .config(configure)
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал
    .run(['$templateCache',($templateCache)=>{
        $templateCache.put('settings.personal.html', require('./articles/settings.personal.html') as string);
        $templateCache.put('settings.privacy.html', require('./articles/settings.privacy.html') as string);
        $templateCache.put('settings.display.html', require('./articles/settings.display.html') as string);
        $templateCache.put('settings.account.html', require('./articles/settings.account.html') as string);
        $templateCache.put('settings.sync.html', require('./articles/settings.sync.html') as string);
        //$templateCache.put('settings.zones.html', require('./articles/settings.zones.html') as string);
    }])
    .name;

export default SettingsUser;