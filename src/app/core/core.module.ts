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
import MessageService from './message.service';
import {_translateMessage} from './message.translate';
import CommentService from "./comment.service";
import DisplayService from "./display.service";
import StorageService from "./storage.service";
import BillingService from "./billing.service";
import PreferencesService from "./preferences.service";

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
	.service('display', DisplayService)
	.service('BillingService', BillingService)
	.service('PreferencesService', PreferencesService)
	.service('storage', StorageService)
	.component('systemMessage', SystemMessageComponent)
	.config(['$translateProvider', ($translateProvider) => {
		$translateProvider.translations('ru', _translateMessage['ru']);
		$translateProvider.translations('en', _translateMessage['en']);
	}])
	.name;

export default Core;