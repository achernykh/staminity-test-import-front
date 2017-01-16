import { module } from 'angular';
import SettingsUserComponent from './settings-user.component.js';
import configure from './settings-user.config';

const SettingsUser = module('staminity.settings-user', [])
    .component('settingsUserPersonal',{template: require('./articles/settings.personal.html') as string})
    .component('settingsUser', SettingsUserComponent)
    .config(configure)
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал
    .run(['$templateCache',($templateCache)=>{
        $templateCache.put('settings.personal.html', require('./articles/settings.personal.html') as string);
        $templateCache.put('settings.privacy.html', require('./articles/settings.privacy.html') as string);
        $templateCache.put('settings.display.html', require('./articles/settings.display.html') as string);
        $templateCache.put('settings.account.html', require('./articles/settings.account.html') as string);
        $templateCache.put('settings.sync.html', require('./articles/settings.sync.html') as string);
    }])
    .name;

export default SettingsUser;