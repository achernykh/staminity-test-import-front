import moment from 'moment/src/moment.js';
import { orderBy } from '../share/util.js';
import { IGroupMembershipRequest } from '../../../api/group/group.interface';
import { GetMembershipRequest, ProcessMembershipRequest } from '../../../api/group/group.request';
import { ISessionService } from './session.service';
import { ISocketService } from './socket.service';
import { Observable, Subject } from 'rxjs/Rx';
import { memorize } from '../share/util.js';


const parseDate = memorize(moment);
const requestId = request => request.userGroupRequestId;
const requestDate = request => request.updated || request.created;
const isSameRequest = (r0) => (r1) => r0.userGroupRequestId === r1.userGroupRequestId;


export default class RequestsService {
    notifications: Observable<any>;

    static $inject = ['SocketService', 'SessionService'];

    constructor(
        private SocketService:ISocketService,
        private SessionService:ISessionService
    ) {
        this.notifications = this.SocketService.messages
            .filter(message => message.type === 'groupMembershipRequest')
            .map(message => message.value)
            .share();
    }
    
    requestsReducer (requests: IGroupMembershipRequest[], request: IGroupMembershipRequest) : IGroupMembershipRequest[] {
        let prev = requests.find(isSameRequest(request));
        
        if (prev) {
            requests[requests.indexOf(prev)] = request;
        } else {
            requests.push(request);
        }
        
        return requests
            .sort((a, b) => parseDate(requestDate(a)) >= parseDate(requestDate(b))? 1 : -1)
            .reverse();
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
        return this.notifications.filter(r => r.initiator.userId === userId || r.receiver.userId === userId);
    }

    /**
     * Реквесты, имеющие отношение к клубу
     * @param clubId
     * @returns Observable<any>
     */
    requestWithClub (clubId:number) : Observable<any> {
        return this.notifications.filter(r => r.groupProfile.groupId === clubId);
    }
}


