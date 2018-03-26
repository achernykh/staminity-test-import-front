import {
    SearchMethod, SearchParams, SearchUserAndGroupsRequest} from "../../../api";
import {SearchResultByGroup, SearchResultByUser} from './search';
import { SocketService} from "../core";

export class SearchService {

    static $inject = ["SocketService"];
    constructor(private socket: SocketService) {

    }

    /**
     * Поиск пользователей, групп, клубов
     * Описание сборщика в соответствующем разделе АПИ
     * @param method
     * @param params
     * @params limit
     * @params offset
     * @returns {Promise<TResult>}
     */
    request(method: SearchMethod, params: SearchParams, limit?, offset?): Promise<Array<SearchResultByUser | SearchResultByGroup>> {
        return this.socket.send(new SearchUserAndGroupsRequest(method, params, limit, offset))
            .then((result) => result.hasOwnProperty("arrayResult") &&
                params.objectType === "user" || params.objectType === "coach" ?
                    result.arrayResult.map((r) => new SearchResultByUser(r)) :
                    result.arrayResult.map((r) => new SearchResultByGroup(r)));
    }
}
