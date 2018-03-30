import {
    SearchMethod, SearchParams, SearchUserAndGroupsRequest} from "../../../api";
import {SearchResultByGroup, SearchResultByUser} from './search';
import {SocketService, RESTService, PostData} from "../core";
import AuthService from "@app/auth/auth.service";
import {IHttpPromiseCallbackArg} from 'angular';

export class SearchService {

    static $inject = ["SocketService", 'RESTService', 'AuthService'];
    constructor(private socket: SocketService,
                private restService: RESTService,
                private authService: AuthService) {

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
        return this.authService.isAuthenticated() ?
            this.socket.send(new SearchUserAndGroupsRequest(method, params, limit, offset))
                .then((result) => result.hasOwnProperty("arrayResult") &&
                    params.objectType === "user" || params.objectType === "coach" ?
                    result.arrayResult.map((r) => new SearchResultByUser(r)) :
                    result.arrayResult.map((r) => new SearchResultByGroup(r))):
            this.restService.postData(new PostData('/api/wsgate', new SearchUserAndGroupsRequest(method, params, limit, offset)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data)
                .then(result => result.hasOwnProperty("arrayResult") &&
                    params.objectType === "user" || params.objectType === "coach" ?
                    result.arrayResult.map((r) => new SearchResultByUser(r)) :
                    result.arrayResult.map((r) => new SearchResultByGroup(r)));
    }
}
