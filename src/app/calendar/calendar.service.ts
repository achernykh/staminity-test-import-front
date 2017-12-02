import {copy, IHttpPromise} from "angular";
import {Observable} from "rxjs/Rx";
import {
    DeleteCalendarItemRequest,
    GetCalendarItemRequest, ICalendarItem,
    PostCalendarItemRequest, PutCalendarItemRequest} from "../../../api";
import {SocketService} from "../core";
import {IRESTService, PostFile} from "../core/rest.service";

export class CalendarService {
    public item$: Observable<any>;

    constructor(private SocketService: SocketService, private RESTService: IRESTService) {
        this.item$ = this.SocketService.messages.filter((message) => message.type === "calendarItem").share();
    }

    /**
     * Получение информации по записям календаря
     * @param itemId
     * @param userId
     * @param start
     * @param end
     * @returns {Promise<TResult>}
     */
    public getCalendarItem(start: Date, end: Date, userId?: number, groupId?: number, itemId?: number): Promise<ICalendarItem[]> {
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
    public postItem(item: ICalendarItem): Promise<any> {
        const data: ICalendarItem = copy(item);
        return this.SocketService.send(new PostCalendarItemRequest(data));
    }

    /**
     * Изменить запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    public putItem(item: ICalendarItem): Promise<any> {
        return this.SocketService.send(new PutCalendarItemRequest(item));
    }

    /**
     * Удаление записи календаря
     * @param mode
     * @param items
     * @params rmParams
     * @returns {Promise<any>}
     */
    public deleteItem(mode: string, items: number[], rmParams?: Object): Promise<any> {
        return this.SocketService.send(new DeleteCalendarItemRequest(mode, items, rmParams));
    }

    public postFile(file: any, activityId?: number): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/api/private/upload`, file, { activityId}))
            .then((response) => response.data);
    }
}
