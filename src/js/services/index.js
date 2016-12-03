import ApplicationService from './application/app.service';
import StorageService from './storage/storage.service';
import AuthService from './auth/auth.service';
import UserService from './user/user.service';
import GroupsService from './groups/groups.service';
import ApiService from './api/api.service';
import ApplicationMessageService from './appmessage/appmessage.service';
import { ActionMessageService } from './actionmessage/actionmessage.component.js';
import SessionService from './session/session.service'

import { CalendarService } from './calendar/calendar.service.js';
import {SocketService} from './api/socket.service'

export const services = angular.module('staminity.services', [])
	.service('ActionMessage', ActionMessageService)
    .service('ViewService', ApplicationService)
    .service('StorageService', StorageService)
    .service('AppMessage', ApplicationMessageService)
    .service('SessionService',SessionService)
    .service('UserService', ['StorageService','SessionService','SocketService','RESTService', UserService])
    .service('AuthService', AuthService)
    .service('GroupsService', GroupsService)
    .service('CalendarService', CalendarService)
    .service('API', ApiService)
    .service('SocketService', ['$q','$websocket','StorageService','SessionService',SocketService])
    .service('RESTService', ['$http','SessionService',SocketService]);

export default services
