import {ISocketService} from "../core/socket.service";
import {SearchMethod, SearchParams, SearchResultByUser, SearchResultByGroup} from "../../../api/search/search.interface";
import {SearchGetResult} from "../../../api/search/search.request";

export class SearchService {

    static $inject = ['SocketService'];
    constructor(private socket: ISocketService) {

    }

    /**
     * Поиск пользователей, групп, клубов
     * Описание сборщика в соответствующем разделе АПИ
     * @param method
     * @param params
     * @returns {Promise<TResult>}
     */
    request(method: SearchMethod, params: SearchParams): Promise<Array<SearchResultByUser | SearchResultByGroup>>{
        return this.socket.send(new SearchGetResult(method,params))
            .then(result => result.hasOwnProperty('arrayResult') &&
                params.objectType === 'user' || params.objectType === 'coach' ?
                    result.arrayResult.map(r => new SearchResultByUser(r)) :
                    result.arrayResult.map(r => new SearchResultByGroup(r)));
    }
}