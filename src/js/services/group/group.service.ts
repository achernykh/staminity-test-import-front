import {IGroupProfile, IGroupProfileShort, IGroupManagementProfile} from '../../../../api/group/group.interface';
import {
    GetRequest,
    PutRequest,
    JoinRequest,
    LeaveRequest,
    GetMembershipRequest,
    ProcessMembershipRequest,
    GetMembersRequest,
    GetGroupMembershipProfile
} from '../../../../api/group/group.request';
import {ISocketService, IWSRequest} from '../api/socket.service';

export default class GroupService {
    SocketService:ISocketService

    constructor(SocketService:ISocketService) {
        this.SocketService = SocketService;
    }

    /**
     * Запрос профиля группы
     * @param id
     * @param uri
     * @returns {Promise<IGroupProfile>}
     */
    getProfile(uri:string):Promise<IGroupProfile> {
        return this.SocketService.send(new GetRequest(uri));
    }

    /**
     * Сохранение изменний в профайл группы
     * @param profile
     * @returns {Promise<IGroupProfile>}
     */
    putProfile(profile:IGroupProfile):Promise<any>{
        return this.SocketService.send(new PutRequest(profile));
    }

    /**
     * Реестр запросов
     * @param offset
     * @param limit
     * @returns {Promise<IGroupProfile>}
     */
    getMembershipRequest(offset:number, limit: number):Promise<IGroupProfile> {
        return this.SocketService.send(new GetMembershipRequest(offset, limit));
    }

    /**
     * Запрос вступления в группу
     * @param id
     * @returns {Promise<any>}
     */
    join(groupId: number, userId: number = null):Promise<any>{
        return this.SocketService.send(new JoinRequest(groupId, userId));
    }

    /**
     * Запрос выхода из группы
     * @param id
     * @returns {Promise<any>}
     */
    leave(groupId: number, userId: number = null):Promise<any>{
        return this.SocketService.send(new LeaveRequest(groupId, userId));
    }

    /**
     * Запрос информации о членах клуба для управления тарифами и ролями
     * @param groupId
     * @returns {Promise<any>}
     */
    getMembershipProfile(groupId: number):Promise<IGroupManagementProfile>{
        return this.SocketService.send(new GetGroupMembershipProfile(groupId));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<IGroupProfile>}
     */
    processMembershipRequest(requestId:number, action:string):Promise<IGroupProfile> {
        return this.SocketService.send(new ProcessMembershipRequest(requestId, action));
    }

}


