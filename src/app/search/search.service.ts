import {ISocketService} from "../core/socket.service";
import {SearchMethod, SearchParams, SearchResultByUser} from "../../../api/search/search.interface";
import {SearchUserAndGroupsRequest} from "../../../api/search/search.request";

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
    request(method: SearchMethod, params: SearchParams): Promise<Array<SearchResultByUser>>{
        return this.socket.send(new SearchUserAndGroupsRequest(method,params))
            .then(result => result.hasOwnProperty('arrayResult') && result.arrayResult.map(r => new SearchResultByUser(r)));
    }
}
