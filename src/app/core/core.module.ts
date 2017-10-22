import { module } from 'angular';
import {
	SessionService,
	SocketService,
	RestService,
	GroupService,
	CommentService,
	UserBillingService,
	StorageService,
	StatisticsService,
	UserProfileService,
	UserDisplayService,
	UserConnectionsService

} from '../../app4/core';
import {
	MessageService
} from '../../app4/share';
import SystemMessageService from "./sysmessage.service.js";
import SystemMessageComponent from './sysmessage.component.js';
import { ActionMessageService } from "./actionmessage.service.js";
import { RequestsService } from "../../app4/requests/requests.service";
import { configure as messagesConf } from './message.service';
import { downgradeInjectable } from "@angular/upgrade/static";


const Core = module('staminity.core', [])
	//.service('SocketService', SocketService)
	.service('SocketService',  downgradeInjectable(SocketService))
	//.service('RESTService',RESTService)
    .service('RESTService', downgradeInjectable(RestService))
	//.service('SessionService', SessionService)
	.service('SessionService', downgradeInjectable(SessionService))
	//.service('SystemMessageService',SystemMessageService)
	//.service('ActionMessageService', ActionMessageService)
	//.service('UserService',UserService)
	.service('UserService', downgradeInjectable(UserProfileService))
	//.service('GroupService',GroupService)
	.service('GroupService', downgradeInjectable(GroupService))
	//.service('RequestsService', RequestsService)
	.service('RequestsService', downgradeInjectable(RequestsService))
	//.service('message', MessageService)
	.service('message', downgradeInjectable(MessageService))
	//.service('CommentService', CommentService)
	.service('CommentService', downgradeInjectable(CommentService))
	//.service('DisplayService', DisplayService)
    .service('DisplayService', downgradeInjectable(UserDisplayService))
	//.service('BillingService', BillingService)
	.service('BillingService', downgradeInjectable(UserBillingService))
	//.service('storage', StorageService)
	.service('storage', downgradeInjectable(StorageService))
	//.service('statistics', StatisticsService)
	.service('statistics', downgradeInjectable(StatisticsService))
	.component('systemMessage', SystemMessageComponent)
	//.config(messagesConf)
	//.config(displayConf)
	.name;

export default Core;