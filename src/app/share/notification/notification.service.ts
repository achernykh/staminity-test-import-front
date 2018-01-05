import moment from "moment/src/moment.js";
import {BehaviorSubject, Observable, Subject} from "rxjs/Rx";
import {GetNotificationRequest, INotification, Notification, PutNotificationRequest} from "../../../../api";
import {SocketService} from "../../core";
import CommentService from "../../core/comment.service";
import {ChatSession} from "../../core/comment.service";
import {memorize} from "../util.js";

const parseDate = memorize(moment);
const notificationsOrder = (a, b) => parseDate(a.ts) >= parseDate(b.ts) ? -1 : 1;

export interface INotificationSettings {
    newestOnTop: boolean;
    timeOut: number;
    tapToDismiss: boolean;
    showDuration: number;
    hideDuration: number;

}

export default class NotificationService {
    timeouts: { [index: string]: number } = {};

    notifications: Notification[] = [];
    notificationsChanges = new Subject<Notification[]>();
    notificationsReducers = {
        "I": (notification: Notification) => [...this.notifications, notification].sort(notificationsOrder),
        "U": (notification: Notification) => this.notifications.map((n) => n.id === notification.id && notification.revision > n.revision ? notification : n).sort(notificationsOrder),
    };

    resetNotifications = () => {
        this.get(100, 0)
        .then((notifications) => {
            this.notifications = notifications.sort(notificationsOrder);
            this.notificationsChanges.next(this.notifications);
        });
    }

    openChat: ChatSession;
    private readonly commentTemplates: string[] = ["newCoachComment", "newAthleteComment"];

    defaultSettings: INotificationSettings = {
        newestOnTop: false,
        timeOut: 7000,
        tapToDismiss: true,
        showDuration: 300,
        hideDuration: 300,
    };

    static $inject = ["SocketService", "toaster", "CommentService"];

    constructor (
        private socket: SocketService, private toaster: any, private comment: CommentService) {

        this.comment.openChat$.subscribe((chat) => this.openChat = chat); // следим за открытми чатами

        //this.resetNotifications();
        this.socket.connections.subscribe((status) => status && this.resetNotifications());

        this.socket.messages
        .filter((message) => message.type === "notification")
        .subscribe((message) => {
            const notification = new Notification(message.value);
            const reducer = this.notificationsReducers[message.action || "I"];

            if (reducer) {
                this.notifications = reducer(notification);
                this.notificationsChanges.next(this.notifications);
            }

            if (!notification.isRead && !this.timeouts[notification.index]) {
                this.show(notification);
            }

            // Не показываем попап уведомление + делаем прочитанным уведомления по комментариям, если у пользователя
            // открыт данны чат
            if (this.commentTemplates.some((t) => t === notification.template) && !notification.isRead &&
                (this.openChat && notification.context[3] === this.openChat.id)) {
                this.put(notification.id, null, true);
                notification.isRead = true;
            }
        });
    }

    clear (): void {
        this.notifications = [];
    }

    /**
     * Получение списка уведомлений текущего пользователя
     * @param limit - колчиесво элементов в ответе (макс-100)
     * @param offset - отступ от начального элемента, попадающего под условия фильтрации
     * @returns {Promise<Array<INotification>>}
     */
    get (limit: number = null, offset: number = null): Promise<Notification[]> {
        return this.socket.send(new GetNotificationRequest(limit, offset))
            .then((result: {resultArray: any[]}) => result.resultArray.map((n) => new Notification(n)));
    }

    /**
     * Изменение флага о прочтении уведомления пользователя
     * @param id
     * @param isRead
     * @returns {Promise<any>}
     */
    put (id: number, readUntil: string, isRead: boolean): Promise<any> {
        return this.socket.send(new PutNotificationRequest(id, readUntil, isRead));
    }

    show (notification: Notification, settings: INotificationSettings = this.defaultSettings) {
        this.timeouts[notification.index] = Date.now();

        this.toaster.pop({
            onHideCallback: () => {
                console.log(Date.now() - this.timeouts[notification.index]);
                const userClick = (Date.now() - this.timeouts[notification.index]) < settings.timeOut;
                if (userClick) {
                    console.log("user click", notification);
                    this.put(notification.id, null, true)
                        .then((success) => console.log(success), (error) => console.error(error));
                }
            },
            tapToDismiss: true,
            timeout: settings.timeOut,
            newestOnTop: settings.newestOnTop,
            body: JSON.stringify({template: "notification/notification.html", data: {
                notification,
            }}),
            bodyOutputType: "templateWithData",
        });
    }

}
