import { module } from 'angular';
import { SocketService } from './socket.service';
import { RESTService } from './rest.service';
import SystemMessageService from "./sysmessage.service.js";
import SystemMessageComponent from './sysmessage.component.js';
import { ActionMessageService } from "./actionmessage.service.js";
import UserService from "./user.service";
import GroupService from "./group.service";
import RequestsService from "./requests.service";
import MessageService, { configure as messagesConf } from './message.service';
import CommentService from "./comment.service";
import DisplayService, { configure as displayConf } from "./display.service";
import StatisticsService from "./statistics.service";
import BillingService from "./billing.service";
import { downgradeInjectable } from "@angular/upgrade/static";
import { StorageService } from "./storage.service";
import { SessionService } from "./session.service";

const Core = module('staminity.core', [])
	.service('SocketService', SocketService)
	.service('RESTService',RESTService)
	//.service('SessionService', SessionService)
	.service('SessionService', downgradeInjectable(SessionService))
	.service('SystemMessageService',SystemMessageService)
	.service('ActionMessageService', ActionMessageService)
	.service('UserService',UserService)
	.service('GroupService',GroupService)
	.service('RequestsService', RequestsService)
	.service('message', MessageService)
	.service('CommentService', CommentService)
	.service('DisplayService', DisplayService)
	.service('BillingService', BillingService)
	//.service('storage', StorageService)
	.service('storage', downgradeInjectable(StorageService))
	.service('statistics', StatisticsService)
	.component('systemMessage', SystemMessageComponent)
	.config(messagesConf)
	.config(displayConf)
	.name;

export default Core;