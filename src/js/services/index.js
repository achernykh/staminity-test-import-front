import ApplicationService from './application/app.service';
import StorageService from './storage/storage.service';
import AuthService from './auth/auth.service';
import UserService from './user/user.service';
import ApiService from './api/api.service';
import SystemMessageService from './sysmessage/sysmessage.service';
import { ActionMessageService } from './actionmessage/actionmessage.service.js';
import SessionService from './session/session.service'
import {SocketService} from './api/socket.service'
import {RESTService} from './api/rest.service'
import GroupService from './group/group.service'

export const services = angular.module('staminity.services', [])
	.service('ActionMessageService', ActionMessageService)
    .service('ViewService', ApplicationService)
    .service('StorageService', StorageService)
    .service('SystemMessageService', SystemMessageService)
    .service('SessionService',['$window',SessionService])
    .service('UserService', ['StorageService','SessionService','SocketService','RESTService', UserService])
	.service('GroupService', ['SocketService', 'RESTService', GroupService])
    .service('AuthService', AuthService)
    .service('API', ApiService)
    .service('SocketService', ['$q','$websocket','StorageService','SessionService',SocketService])
    .service('RESTService', ['$http','SessionService',RESTService]);

export default services
