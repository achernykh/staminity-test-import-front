import ApplicationService from './application/app.service';
import StorageService from './storage/storage.service';
import AuthService from './auth/auth.service';
import UserService from './user/user.service';
import GroupsService from './groups/groups.service';
import ApiService from './api/api.service';
import ApplicationMessageService from './appmessage/appmessage.service';

import { CalendarService } from './calendar/calendar.service.js';
//import ViewConstants from './app.service.constants';

let serviceModule = angular.module('staminity.services',[]);
//    serviceModule.constant('_SETTINGS', ViewConstants);
    serviceModule.service('Application', ApplicationService);
    serviceModule.service('Storage', StorageService);
    serviceModule.service('AppMessage', ApplicationMessageService);
    serviceModule.service('Auth', AuthService);
    serviceModule.service('User', UserService);
    serviceModule.service('Groups', GroupsService);
    serviceModule.service('Calendar', CalendarService);
    serviceModule.service('API', ApiService);

export default serviceModule
