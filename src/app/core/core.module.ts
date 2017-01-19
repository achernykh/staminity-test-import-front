import { module } from 'angular';
import { SocketService } from './socket.service';
import { RESTService } from './rest.service';
import AuthService from './auth.service.js';
import SessionService from "./session.service";
import SystemMessageService from "./sysmessage.service.js";
import SystemMessageComponent from './sysmessage.component.js';
import { ActionMessageService } from "./actionmessage.service.js";
import UserService from "./user.service";
import GroupService from "./group.service";

const Core = module('staminity.core', [])
	.service('SocketService', SocketService)
	.service('RESTService',RESTService)
	.service('AuthService',AuthService)
	.service('SessionService', SessionService)
	.service('SystemMessageService',SystemMessageService)
	.service('ActionMessageService', ActionMessageService)
	.service('UserService',UserService)
	.service('GroupService',GroupService)
	.component('systemMessage', SystemMessageComponent)
	.name;

export default Core;