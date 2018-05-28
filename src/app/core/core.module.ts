import { module } from "angular";
import { ActionMessageService } from "./actionmessage.service.js";
import BillingService from "./billing.service";
import CommentService from "./comment.service";
import DisplayService, { configure as displayConf } from "./display.service";
import GroupService from "./group.service";
import { SessionService, SocketService, StorageService } from "./index";
import MessageService, { configure as messagesConf } from "./message.service";
import RequestsService from "./requests.service";
import { RESTService } from "./rest.service";
import { ConnectionSettings } from "./socket/socket.config";
import StatisticsService from "./statistics.service";
import SystemMessageComponent from "./sysmessage.component.js";
import SystemMessageService from "./sysmessage.service.js";
import UserService from "./user.service";
import { ImagesService } from "./images.service";

const Core = module("staminity.core", [])
    .constant("ConnectionSettingsConfig", ConnectionSettings)
    .service("SocketService", SocketService)
    .service("RESTService", RESTService)
    .service("SessionService", SessionService)
    .service("SystemMessageService", SystemMessageService)
    .service("ActionMessageService", ActionMessageService)
    .service("UserService", UserService)
    .service("GroupService", GroupService)
    .service("RequestsService", RequestsService)
    .service("message", MessageService)
    .service("CommentService", CommentService)
    .service("DisplayService", DisplayService)
    .service("BillingService", BillingService)
    .service("storage", StorageService)
    .service("statistics", StatisticsService)
    .service("ImagesService", ImagesService)
    .component("systemMessage", SystemMessageComponent)
    .config(messagesConf)
    .config(displayConf)
    .name;

export default Core;
