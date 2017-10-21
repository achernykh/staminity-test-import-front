import { module } from 'angular';
import { SocketService } from '../../app4/core/socket/socket.service';
import { RestService } from '../../app4/core/rest/rest.service';
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
import { StorageService } from "../../app4/core/storage/storage.service";
import { SessionService } from "../../app4/core/session/session.service";

const Core = module('staminity.core', [])
	//.service('SocketService', SocketService)
	.service('SocketService',  downgradeInjectable(SocketService))
	//.service('RESTService',RESTService)
    .service('RESTService', downgradeInjectable(RestService))
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