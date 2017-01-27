import { IGroupMembershipRequest } from '../../../api/group/group.interface';
import { GetMembershipRequest, ProcessMembershipRequest } from '../../../api/group/group.request';
import { ISocketService } from './socket.service';
import { Observable } from 'rxjs/Rx';


export default class RequestsService {
    requests: Observable<any>;

    static $inject = ['SocketService'];

    constructor(
        private SocketService:ISocketService
    ) { 
        this.requests = this.SocketService.messages
            .filter((m) => m.type === 'groupMembershipRequest')
            .map((m) => m.value)
            .scan((requests, request) => {
                let sameRequest = (r) => r.userGroupRequestId === request.userGroupRequestId;
                return requests.find(sameRequest)? 
                    requests.map(r => sameRequest(r)? request : r) : requests.concat(request);
            }, []); 

        this.requests.subscribe((rs) => console.log('requests', rs));
    }

    /**
     * Реестр запросов
     * @param offset
     * @param limit
     * @returns {Promise<any>}
     */
    getMembershipRequest(offset:number, limit: number):Promise<any> {
        return this.SocketService.send(new GetMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<any>}
     */
    processMembershipRequest(action:string, groupId?: number, requestId?:number, ):Promise<any> {
        return this.SocketService.send(new ProcessMembershipRequest(action, groupId, requestId));
    }
}


