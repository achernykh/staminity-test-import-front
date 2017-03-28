import { module } from 'angular';
import satellizer from 'satellizer';
import DashboardComponent from './dashboard.component';
//import SyncAdaptorService from './sync-adaptor.service';
import DashboardDay from './day/dashboard-day.component.js';
import DashboardAthlete from './athlete/dashboard-athlete.component.js';
import DashboardTotal from './total/dashboard-total.component.js';
import DashboardActivity from './activity/dashboard-activity.component.js';
import configure from './dashboard.config';

const SettingsUser = module('staminity.dashboard', [satellizer])
//    .service('SyncAdaptorService', SyncAdaptorService)
    //.component('settingsUserPersonal',{template: require('./articles/settings.personal.html') as string})
    .component('dashboard', DashboardComponent)
    .component('dashboardDay', DashboardDay)
    .component('dashboardAthlete', DashboardAthlete)
    .component('dashboardTotal', DashboardTotal)
    .component('dashboardActivity', DashboardActivity)
    .config(configure)
    // Пока не нашел рабочего плагина или загрузчика для webpack 2.0
    // ng-cache-loader@0.0.22 не сработал

    .name;

export default SettingsUser;