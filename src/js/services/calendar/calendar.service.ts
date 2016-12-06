import {ISocketService, IWSRequest} from '../api/socket.service';
import {ICalendarItem} from '../calendar/calendar.interface'
/**
 * Сборщик запроса getUserProfile
 */
class GetRequest implements IWSRequest {

    requestType:string;
    requestData:{
        calendarItemId?:number;
        userId?:number;
        userGroupId?:number;
        startDate:Date;
        endDate:Date;
    }

    /**
     *
     * @param itemId - идентификатор записи. Наивысший приоритет.
     * @param userId - Идентификатор владельца событий. Если указан, производится поиск событий только в рамках этого атлета
     * @param start - если не указана, NOW() - 7 Days
     * @param end - если не указана, NOW() + 7 Days
     */
    constructor(start:Date, end:Date, userId:number = null, itemId:number = null) {
        this.requestType = 'getCalendarItem';
        this.requestData = {
            calendarItemId: itemId,
            userId: userId,
            startDate: start,
            endDate: end
        }
    }
}
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
            .then((result) => {
                console.log('getCalendarItem=', result)
                return result.map((item) => {
                    if(item.type == 'calendarItem')
                        return item.value
                });
            })
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