import { orderBy } from '../share/util';
import { IGroupMembershipRequest } from '../../../api/group/group.interface';
import { GetMembershipRequest, ProcessMembershipRequest } from '../../../api/group/group.request';
import { ISocketService } from './socket.service';
import { Observable, Subject } from 'rxjs/Rx';
import moment from 'moment/src/moment.js';


const requestId = request => request.userGroupRequestId;
const requestDate = request => request.updated || request.created;
const isSameRequest = (r0) => (r1) => r0.userGroupRequestId === r1.userGroupRequestId;


const processRequests = (requests, newRequests) => newRequests
    .reduce((requests, request) => {
        let prev = requests.find(isSameRequest(request));
        if (prev) {
            requests[requests.indexOf(prev)] = request;
        } else {
            requests.push(request);
        }
        return requests;
    }, requests)
    .sort((a, b) => moment(requestDate(a)) >= moment(requestDate(b))? 1 : -1)
    .reverse();


export default class RequestsService {
    processRequests: Subject<any>;
    requests: Observable<any>;

    static $inject = ['SocketService'];

    constructor(
        private SocketService:ISocketService
    ) { 
        this.processRequests = new Subject();

        this.requests = this.processRequests.scan(processRequests, []);

        this.SocketService.messages
        .filter((m) => m.type === 'groupMembershipRequest')
        .map((m) => [m.value])
        .subscribe(this.processRequests);

        this.getMembershipRequest(0, 20)
        .then((requests) => { this.processRequests.next(requests); });

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


