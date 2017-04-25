import {ISocketService} from '../core/socket.service';
import {ICalendarItem} from '../../../api/calendar/calendar.interface';
import {GetRequest, PostRequest, PutRequest, DeleteRequest} from '../../../api/calendar/calendar.request';
import {Observable} from "rxjs/Rx";

export class CalendarService {
    SocketService:ISocketService;
    item$: Observable<any>;

    constructor(SocketService:ISocketService) {
        this.SocketService = SocketService;
        this.item$ = this.SocketService.messages.filter(message => message.type === 'calendarItem').share();
        /*.map(message => {
            let notification = new Notification(message.value);
            return notification;
        })*/
    }

    /**
     * Получение информации по записям календаря
     * @param itemId
     * @param userId
     * @param start
     * @param end
     * @returns {Promise<TResult>}
     */
    getCalendarItem(start:Date, end:Date, userId?:number, groupId?:number, itemId?:number):Promise<Array<ICalendarItem>> {
        return this.SocketService.send(new GetRequest(start, end, userId, groupId, itemId));
            /*.then((result) => {
                console.log('getCalendarItem=', result)
                return result.map((item) => {
                    if(item.type == 'calendarItem')
                        return item.value
                });
            })*/
    }

    /**
     *
     * @param {Object} request
     * @returns {Promise|Promise<T>}
     */
    /*getItem(request) {
        return this._api.wsRequest('getCalendarItem', request).then((response) => {
            return new Promise((resolve) => {
                resolve(response.map((item) => {
                    if (item.type == 'calendarItem')
                        return item.value;
                }))
            });
        });
    }*/

    /**
     * Создать запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    postItem(item:ICalendarItem):Promise<any> {
        return this.SocketService.send(new PostRequest(item));
    }

    /**
     * Изменить запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    putItem(item:ICalendarItem):Promise<any> {
        return this.SocketService.send(new PutRequest(item));
    }

    /**
     * Удаление записи календаря
     * @param mode
     * @param items
     * @returns {Promise<any>}
     */
    deleteItem(mode: string, items: Array<number>):Promise<any> {
        return this.SocketService.send(new DeleteRequest(mode,items));
    }

    /*deleteItem(request){
     return this._api.wsRequest('deleteCalendarItem', request);
     }

     getCompetitionDetails(){

     }*/

}