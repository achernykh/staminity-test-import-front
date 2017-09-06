import { module } from 'angular';
import { SocketService } from './socket.service';
import { RESTService } from './rest.service';
import SessionService from "./session.service";
import SystemMessageService from "./sysmessage.service.js";
import SystemMessageComponent from './sysmessage.component.js';
import { ActionMessageService } from "./actionmessage.service.js";
import UserService from "./user.service";
import GroupService from "./group.service";
import RequestsService from "./requests.service";
import MessageService, { configure as messagesConf } from './message.service';
import CommentService from "./comment.service";
import DisplayService, { configure as displayConf } from "./display.service";
import StorageService from "./storage.service";
import BillingService from "./billing.service";

const Core = module('staminity.core', [])
	.service('SocketService', SocketService)
	.service('RESTService',RESTService)
	.service('SessionService', SessionService)
	.service('SystemMessageService',SystemMessageService)
	.service('ActionMessageService', ActionMessageService)
	.service('UserService',UserService)
	.service('GroupService',GroupService)
	.service('RequestsService', RequestsService)
	.service('message', MessageService)
	.service('CommentService', CommentService)
	.service('DisplayService', DisplayService)
	.service('BillingService', BillingService)
	.service('storage', StorageService)
	.component('systemMessage', SystemMessageComponent)
	.config(messagesConf)
	.config(displayConf)
	.name;

export default Core;