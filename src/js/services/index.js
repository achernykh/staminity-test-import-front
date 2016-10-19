import ApplicationService from './application/app.service';
import StorageService from './storage/storage.service';
import AuthService from './auth/auth.service';
import UserService from './user/user.service';
import GroupsService from './groups/groups.service';
import ApiService from './api/api.service';
import ApplicationMessageService from './appmessage/appmessage.service';

import { CalendarService } from './calendar/calendar.service.js';
//import ViewConstants from './app.service.constants';

export const services = angular.module('staminity.services',[])
    .service('ViewService', ApplicationService)
    .service('Storage', StorageService)
    .service('AppMessage', ApplicationMessageService)
    .service('Auth', AuthService)
    .service('User', UserService)
    .service('Groups', GroupsService)
    .service('Calendar', CalendarService)
    .service('API', ApiService);

export default services
