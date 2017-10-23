import moment from 'moment/src/moment.js';
import { IGroupMembershipRequest } from '../../../api/group/group.interface';
import { GetMembershipRequest, ProcessMembershipRequest } from '../../../api/group/group.request';
import { SessionService } from '../core/session/session.service';
import { SocketService } from '../core/socket/socket.service';
import { Observable, Subject } from 'rxjs/Rx';
import { memorize, orderBy } from '../share/utilities';
import { Injectable } from "@angular/core";


const parseDate = memorize(moment);
const requestId = request => request.userGroupRequestId;
const requestDate = request => request.updated || request.created;
const isSameRequest = (r0) => (r1) => r0.userGroupRequestId === r1.userGroupRequestId;
const requestsOrder = (a, b) => parseDate(requestDate(a)) >= parseDate(requestDate(b))? -1 : 1;

@Injectable()
export class RequestsService {

    public messages: Observable<IGroupMembershipRequest>;
    public requests: IGroupMembershipRequest[] = [];
    public requestsChanges = new Subject<IGroupMembershipRequest[]>();

    private requestsReducers = {
        "I": (request: IGroupMembershipRequest) => [...this.requests, request].sort(requestsOrder),
        "U": (request: IGroupMembershipRequest) => this.requests.map((r) => isSameRequest(request)(r)? request : r).sort(requestsOrder)
    };

    private resetRequests = () => {
        this.getMembershipRequest(0, 100)
            .then((requests) => {
                this.requests = requests.sort(requestsOrder);
                this.requestsChanges.next(this.requests);
            });
    }

    constructor(
        private socket: SocketService,
        private session: SessionService
    ) {
        //this.resetRequests();
        this.socket.connections.subscribe(status => status && this.resetRequests());

        this.socket.messages
            .filter((message) => message.type === 'groupMembershipRequest')
            .subscribe((message) => {
                let request = message.value;
                let reducer = this.requestsReducers[message.action || 'I'];

                if (reducer) {
                    this.requests = reducer(request);
                    this.requestsChanges.next(this.requests);
                }
            });

        this.messages = this.socket.messages
            .filter((message) => message.type === 'groupMembershipRequest')
            .map((message) => message.value)
            .share();
    }

    /**
     * Реестр запросов
     * @param offset
     * @param limit
     * @returns {Promise<any>}
     */
    getMembershipRequest (offset:number, limit: number) : Promise<any> {
        return this.socket.send(new GetMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<any>}
     */
    processMembershipRequest (action:string, groupId?: number, requestId?:number) : Promise<any> {
        return this.socket.send(new ProcessMembershipRequest(action, groupId, requestId));
    }

    /**
     * Реквесты, имеющие отношение к пользователю
     * @param userId
     * @returns Observable<any>
     */
    requestWithUser (userId:number) : Observable<any> {
        return this.messages.filter(r => r.initiator.userId === userId || r.receiver.userId === userId);
    }

    /**
     * Реквесты, имеющие отношение к клубу
     * @param clubId
     * @returns Observable<any>
     */
    requestWithClub (clubId:number) : Observable<any> {
        return this.messages.filter(r => r.groupProfile.groupId === clubId);
    }
}

