import moment from 'moment/src/moment.js';
import {INotification, Notification} from "../../../../api/notification/notification.interface";
import {ISocketService} from "../../core/socket.service";
import {GetNotification, PutNotification} from "../../../../api/notification/notification.request";
import {Observable} from "rxjs/Rx";

export interface INotificationSettings {
    newestOnTop: boolean;
    timeOut: number;
    tapToDismiss: boolean;
    showDuration: number;
    hideDuration: number;

}

export default class NotificationService {
    timeouts: Array<number> = [];
    notification$: Observable<any>;
    list$: Observable<Array<Notification>>;
    defaultSettings: INotificationSettings = {
        newestOnTop: false,
        timeOut: 7000,
        tapToDismiss: true,
        showDuration: 300,
        hideDuration: 300
    };

    static $inject = ['SocketService','toaster'];

    constructor(
        private socket:ISocketService, private toaster: any){

        this.notification$ = this.socket.messages
            .filter(message => message.type === 'notification')
            .map(message => {
                let notification = new Notification(message.value);
                return notification;
            })
            .share();

        this.list$ = this.socket.connections
            .flatMap(() => Observable.fromPromise(this.get(100,0)))
            .switchMap(list => {debugger; return this.notification$.scan( this.process.bind(this), list).startWith(list);})
            .share();
    }

    /**
     * Получение списка уведомлений текущего пользователя
     * @param limit - колчиесво элементов в ответе (макс-100)
     * @param offset - отступ от начального элемента, попадающего под условия фильтрации
     * @returns {Promise<Array<INotification>>}
     */
    get(limit:number = null, offset:number = null):Promise<Array<Notification>>{
        return this.socket.send(new GetNotification(limit,offset))
            .then((result:{resultArray: Array<any>}) => {debugger; return result.resultArray.map(n => new Notification(n));});
    }

    /**
     * Изменение флага о прочтении уведомления пользователя
     * @param id
     * @param isRead
     * @returns {Promise<any>}
     */
    put(id: number, isRead: boolean):Promise<any>{
        return this.socket.send(new PutNotification(id,isRead));
    }

    /**
     * Обработка входящих ассинхронных уведомлений
     * @param list
     * @param notification
     * @returns {Array<Notification>}
     */
    process(list: Array<Notification>, notification: Notification):Array<Notification> {
        let update: number = list.findIndex(n => n.id === notification.id);
        let isUpdate: boolean = update >= 0;

        if (!notification.isRead) {
            this.show(notification);
        }
        if (isUpdate && notification.revision >= list[update].revision) {
            list.splice(update,1,notification);
        } else {
            list.push(notification);
        }

        return list
            .sort((a, b) => moment(a.ts) >= moment(b.ts) ? 1 : -1)
            .reverse();
    };

    show(notification: Notification, settings: INotificationSettings = this.defaultSettings) {
        this.timeouts[notification.index] = Date.now();

        this.toaster.pop({
            onHideCallback: () => {
                console.log(Date.now() - this.timeouts[notification.index]);
                let userClick = (Date.now() - this.timeouts[notification.index]) < settings.timeOut;
                if(userClick) {
                    console.log('user click', notification);
                    this.put(notification.id, true)
                        .then((success)=>console.log(success), error => console.error(error));
                }
            },
            tapToDismiss: true,
            timeout: settings.timeOut,
            newestOnTop: settings.newestOnTop,
            body: JSON.stringify({template: 'notification/notification.html', data: {
                notification: notification
            }}),
            bodyOutputType: 'templateWithData'
        });
    }

}