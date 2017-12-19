import {SocketService} from '../core';
import {
    ICalendarItem, ISearchCalendarItemsParams, ISearchCalendarItemsResult,
    GetCalendarItemRequest, PostCalendarItemRequest,
    PutCalendarItemRequest, DeleteCalendarItemRequest, SearchCalendarItem} from '../../../api';
import {Observable} from "rxjs/Rx";
import {IRESTService, PostFile} from "../core/rest.service";
import {IHttpPromise, copy} from 'angular';
import { IRevisionResponse } from "@api/core";

export class CalendarService {
    item$: Observable<any>;

    constructor(private SocketService: SocketService, private RESTService: IRESTService) {
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
     * @param item {Object}
     * @returns {Promise}
     */
    postItem(item: ICalendarItem):Promise<IRevisionResponse> {
        //let data: ICalendarItem = copy(item);
        return this.SocketService.send(new PostCalendarItemRequest(item));
    }

    /**
     * Изменить запись календаря
     * @param item {Object}
     * @returns {Promise}
     */
    putItem(item: ICalendarItem):Promise<IRevisionResponse> {
        return this.SocketService.send(new PutCalendarItemRequest(item));
    }

    /**
     * Удаление записи календаря
     * @param mode
     * @param items
     * @params rmParams
     * @returns {Promise<any>}
     */
    deleteItem(mode: string, items: Array<number>, rmParams?: Object):Promise<any> {
        return this.SocketService.send(new DeleteCalendarItemRequest(mode,items, rmParams));
    }

    postFile(file: any, activityId?:number):IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/api/private/upload`,file, { activityId: activityId}))
            .then((response) => response.data);
    }

    /**
     * Поиск записей календаря
     * @param request
     * @returns {Promise<any>}
     */
    search (request: ISearchCalendarItemsParams): Promise<ISearchCalendarItemsResult> {
        return this.SocketService.send(new SearchCalendarItem(request));
    }

    /**
     * Загрузка картинки
     * @param image
     * @returns {Promise<string>}
     */
    postImage(image: any):Promise<string> {
        return this.RESTService.postFile(new PostFile(`/calendarItem/recordImage/1`, image))
            .then((response: any) => response.fileName);
    }
}