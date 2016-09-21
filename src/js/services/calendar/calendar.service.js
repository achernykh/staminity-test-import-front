/**
 * @author Alexander Chernykh <chernykh@me.com>
 * @copyright ...
 */

export class CalendarService {
    constructor($log, Storage, API) {
        'ngInject'
        this._$log = $log;
        this._Storage = Storage;
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
        //this._$log.debug(`CalendarService: getItem() ${request}`);
        return this._api.wsRequest('getCalendarItem', request).then((response) => {
            //this._$log.debug('CalendarService: getItem() return', response);

            return new Promise( (resolve) => {
                resolve(response.map( (item) => {
                    if (item.type == 'calendarItem')
                        return item.value;
                }))
            });
        });
    }

    putItem(item){

    }

    postItem(){

    }

    deleteItem(item){

    }

    getCompetitionDetails(){

    }

}