import {ISocketService} from '../core/socket.service';
import {ICalendarItem} from '../../../api/calendar/calendar.interface';
import {GetCalendarItemRequest, PostCalendarItemRequest, PutCalendarItemRequest, DeleteCalendarItemRequest} from '../../../api/calendar/calendar.request';
import {Observable} from "rxjs/Rx";
import {IRESTService, PostFile} from "../core/rest.service";
import {IHttpPromise, copy} from 'angular';

export class CalendarService {
    item$: Observable<any>;

    constructor(private SocketService:ISocketService, private RESTService: IRESTService) {
        this.item$ = this.SocketService.messages.filter(message => message.type === 'calendarItem').share();
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
        return this.SocketService.send(new GetCalendarItemRequest(start, end, userId, groupId, itemId));
            /*.then((result) => {
                console.log('getCalendarItem=', result)
                return result.map((item) => {
                    if(item.type == 'calendarItem')
                        return item.value
                });
            })*/
    }

    /**
     * Создать запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    postItem(item:ICalendarItem):Promise<any> {
        let data: ICalendarItem = copy(item);
        return this.SocketService.send(new PostCalendarItemRequest(data));
    }

    /**
     * Изменить запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    putItem(item:ICalendarItem):Promise<any> {
        return this.SocketService.send(new PutCalendarItemRequest(item));
    }

    /**
     * Удаление записи календаря
     * @param mode
     * @param items
     * @returns {Promise<any>}
     */
    deleteItem(mode: string, items: Array<number>):Promise<any> {
        return this.SocketService.send(new DeleteCalendarItemRequest(mode,items));
    }

    postFile(file: any, activityId?:number):IHttpPromise<any> {
        debugger;
        return this.RESTService.postFile(new PostFile(`/api/private/upload`,file, { activityId: activityId}))
            .then((response) => response.data);
    }
}
