import { orderBy } from '../share/util';
import { IGroupMembershipRequest } from '../../../api/group/group.interface';
import { GetMembershipRequest, ProcessMembershipRequest } from '../../../api/group/group.request';
import { ISessionService } from './session.service';
import { ISocketService } from './socket.service';
import { Observable, Subject } from 'rxjs/Rx';
import moment from 'moment/src/moment.js';


const requestId = request => request.userGroupRequestId;
const requestDate = request => request.updated || request.created;
const isSameRequest = (r0) => (r1) => r0.userGroupRequestId === r1.userGroupRequestId;


const processRequest = (requests, request) => {
    let prev = requests.find(isSameRequest(request));
    
    if (prev) {
        requests[requests.indexOf(prev)] = request;
    } else {
        requests.push(request);
    }
    
    return requests
        .sort((a, b) => moment(requestDate(a)) >= moment(requestDate(b))? 1 : -1)
        .reverse();
};


export default class RequestsService {
    asyncRequest: Observable<any>;
    requestsList: Observable<any>;

    static $inject = ['SocketService', 'SessionService'];

    constructor(
        private SocketService:ISocketService,
        private SessionService:ISessionService
    ) { 
        this.asyncRequest = this.SocketService.messages
        .filter(message => message.type === 'groupMembershipRequest')
        .map(message => message.value);

        this.requestsList = this.SessionService.profile
        .flatMap(profile => Observable.fromPromise(this.getMembershipRequest(0, 1000)))
        .switchMap(requests => this.asyncRequest.scan(processRequest, requests).startWith(requests));
    }

    /**
     * Реестр запросов
     * @param offset
     * @param limit
     * @returns {Promise<any>}
     */
    getMembershipRequest (offset:number, limit: number) : Promise<any> {
        return this.SocketService.send(new GetMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<any>}
     */
    processMembershipRequest (action:string, groupId?: number, requestId?:number) : Promise<any> {
        return this.SocketService.send(new ProcessMembershipRequest(action, groupId, requestId));
    }

    /**
     * Реквесты, имеющие отношение к пользователю
     * @param userId
     * @returns Observable<any>
     */
    requestWithUser (userId:number) : Observable<any> {
        return this.asyncRequest.filter(r => r.initiator.userId === userId || r.receiver.userId === userId);
    }
}


