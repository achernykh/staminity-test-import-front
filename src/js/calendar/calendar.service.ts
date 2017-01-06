import {ISocketService} from '../services/api/socket.service';
import {ICalendarItem} from '../../../api/calendar/calendar.interface'
import {GetRequest} from '../../../api/calendar/calendar.request'

export class CalendarService {
    SocketService:ISocketService;

    constructor(SocketService:ISocketService) {
        this.SocketService = SocketService;
    }

    /**
     * Получение информации по записям календаря
     * @param itemId
     * @param userId
     * @param start
     * @param end
     * @returns {Promise<TResult>}
     */
    getCalendarItem(start:Date, end:Date, userId:number, itemId:number):Promise<Array<ICalendarItem>> {
        return this.SocketService.send(new GetRequest(start, end, userId, itemId))
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
    /*putItem(request){
     return this._api.wsRequest('putCalendarItem', request).then((response) => {
     return new Promise( (resolve) => {
     resolve(response.map( (item) => {
     if (item.type == 'calendarItem')
     return item.value;
     }))
     });
     });
     }
     /**
     * Изменить запись календаря
     * @param request
     * @returns {*}
     */
    /*postItem(request){
     return this._api.wsRequest('postCalendarItem', request);
     }
     /**
     * Удалить запись календаря
     * @param request
     * @returns {*}
     */
    /*deleteItem(request){
     return this._api.wsRequest('deleteCalendarItem', request);
     }

     getCompetitionDetails(){

     }*/

}