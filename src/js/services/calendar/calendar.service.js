/**
 * @author Alexander Chernykh <chernykh@me.com>
 * @copyright ...
 */

export class CalendarService {
    constructor($log, StorageService, API) {
        'ngInject'
        this._$log = $log;
        this._StorageService = StorageService;
        this._api = API;
        this.currentUser = null;
        this.currentUserRole = [];
    }
    /**
     *
     * @param {Object} request
     * @returns {Promise|Promise<T>}
     */
    getItem(request){
        return this._api.wsRequest('getCalendarItem', request).then((response) => {
            return new Promise( (resolve) => {
                resolve(response.map( (item) => {
                    if (item.type == 'calendarItem')
                        return item.value;
                }))
            });
        });
    }
    /**
     * Создать запись календаря
     * @param request {Object}
     * @returns {Promise}
     */
    putItem(request){
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
    postItem(request){
        return this._api.wsRequest('postCalendarItem', request);
    }
    /**
     * Удалить запись календаря
     * @param request
     * @returns {*}
     */
    deleteItem(request){
        return this._api.wsRequest('deleteCalendarItem', request);
    }

    getCompetitionDetails(){

    }

}