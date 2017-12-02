import moment from "moment/src/moment.js";
import { Observable, Subject } from "rxjs/Rx";
import { GetGroupMembershipRequest, IGroupMembershipRequest, ProcessGroupMembershipRequest } from "../../../api";
import { orderBy } from "../share/util.js";
import { memorize } from "../share/util.js";
import { SessionService, SocketService } from "./index";

const parseDate = memorize(moment);
const requestId = (request) => request.userGroupRequestId;
const requestDate = (request) => request.updated || request.created;
const isSameRequest = (r0) => (r1) => r0.userGroupRequestId === r1.userGroupRequestId;
const requestsOrder = (a, b) => parseDate(requestDate(a)) >= parseDate(requestDate(b)) ? -1 : 1;

export default class RequestsService {
    public messages: Observable<IGroupMembershipRequest>;
    public requests: IGroupMembershipRequest[] = [];
    public requestsChanges = new Subject<IGroupMembershipRequest[]>();
    private requestsReducers = {
        "I": (request: IGroupMembershipRequest) => [...this.requests, request].sort(requestsOrder),
        "U": (request: IGroupMembershipRequest) => this.requests.map((r) => isSameRequest(request)(r) ? request : r).sort(requestsOrder),
    };
    private resetRequests = () => {
        this.getMembershipRequest(0, 100)
        .then((requests) => {
            this.requests = requests.sort(requestsOrder);
            this.requestsChanges.next(this.requests);
        });
    }

    public static $inject = ["SocketService", "SessionService"];

    constructor(
        private SocketService: SocketService,
        private SessionService: SessionService,
    ) {
        //this.resetRequests();
        this.SocketService.connections.subscribe((status) => status && this.resetRequests());

        this.SocketService.messages
        .filter((message) => message.type === "groupMembershipRequest")
        .subscribe((message) => {
            const request = message.value;
            const reducer = this.requestsReducers[message.action || "I"];

            if (reducer) {
                this.requests = reducer(request);
                this.requestsChanges.next(this.requests);
            }
        });

        this.messages = this.SocketService.messages
            .filter((message) => message.type === "groupMembershipRequest")
            .map((message) => message.value)
            .share();
    }

    /**
     * Реестр запросов
     * @param offset
     * @param limit
     * @returns {Promise<any>}
     */
    public getMembershipRequest(offset: number, limit: number): Promise<any> {
        return this.SocketService.send(new GetGroupMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<any>}
     */
    public processMembershipRequest(action: string, groupId?: number, requestId?: number): Promise<any> {
        return this.SocketService.send(new ProcessGroupMembershipRequest(action, groupId, requestId));
    }

    /**
     * Реквесты, имеющие отношение к пользователю
     * @param userId
     * @returns Observable<any>
     */
    public requestWithUser(userId: number): Observable<any> {
        return this.messages.filter((r) => r.initiator.userId === userId || r.receiver.userId === userId);
    }

    /**
     * Реквесты, имеющие отношение к клубу
     * @param clubId
     * @returns Observable<any>
     */
    public requestWithClub(clubId: number): Observable<any> {
        return this.messages.filter((r) => r.groupProfile.groupId === clubId);
    }
}
