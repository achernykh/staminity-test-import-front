import {INotification, Notification} from "../../../../api/notification/notification.interface";
import {ISocketService} from "../../core/socket.service";
import {GetNotification, PutNotification} from "../../../../api/notification/notification.request";
import {Observable} from "rxjs/Rx";

const processNotifications = (list, request) => {
    return list;
};

export interface INotificationSettings {

}

export default class NotificationService {
    notifications: Observable<any>;
    notificationList: Observable<any>;
    defaultSettings: INotificationSettings = {};

    static $inject = ['SocketService','toaster'];

    constructor(
        private socket:ISocketService, private toaster: any){

        this.notifications = this.socket.messages
            .filter(message => message.type === 'notification')
            .map(message => message.value)
            .share();

        this.notificationList = this.socket.connections
            .flatMap(() => Observable.fromPromise(this.get(10,0)))
            .switchMap(list => this.notifications.scan( processNotifications, list).startWith(list))
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
            .then((result:{resultArray: Array<any>}) => result.resultArray.map(n => new Notification(n)));
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

    pop(notification: INotification, settings: INotificationSettings = this.defaultSettings) {
        this.toaster.pop({
            timeout: 3000,
            body: JSON.stringify({template: 'notification/notification.html', data: {
                fullName: 'Евгений Хабаров',
                time: new Date(),
                message: 'notificationTestMessage',
                context: {
                    data: ['run', 12000, 2.6,'Евгений','Хабаров','Сейчас смотрю твой бег! Лучше восприятие будет если график будет занимать меньше места а карта больше']
                }
            }}),
            bodyOutputType: 'templateWithData'
        });
    }

    showToast(){
        this.toaster.pop({
            timeout: 300000,
            body: JSON.stringify({template: 'notification/notification.html', data: {
                fullName: 'Евгений Хабаров',
                time: new Date(),
                message: 'notificationTestMessage',
                context: {
                    data: ['run', 12000, 2.6,'Евгений','Хабаров','Сейчас смотрю твой бег! Лучше восприятие будет если график будет занимать меньше места а карта больше']
                }
            }}),
            bodyOutputType: 'templateWithData'
        });
    }

}