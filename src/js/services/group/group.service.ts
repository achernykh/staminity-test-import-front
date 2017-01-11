import {
    IGroupProfile,
    IGroupProfileShort,
    IGroupManagementProfile,
    IBulkGroupMembership} from '../../../../api/group/group.interface';
import {
    GetRequest,
    PutRequest,
    JoinRequest,
    LeaveRequest,
    GetMembershipRequest,
    ProcessMembershipRequest,
    ProcessGroupMembershipRequest,
    GetMembersRequest,
    GetGroupManagementProfile,
    PutGroupMembershipBulk
} from '../../../../api/group/group.request';
import {ISocketService, IWSRequest} from '../api/socket.service';
import {PostData, PostFile, IRESTService} from '../api/rest.service';

export default class GroupService {
    SocketService:ISocketService;
    RESTService:IRESTService;

    constructor(SocketService:ISocketService, RESTService:IRESTService) {
        this.SocketService = SocketService;
        this.RESTService = RESTService;
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
    getManagementProfile(groupId: number):Promise<IGroupManagementProfile>{
        return this.SocketService.send(new GetGroupManagementProfile(groupId));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param id
     * @returns {Promise<IGroupProfile>}
     */
    processMembershipRequest(requestId:number, action:string):Promise<IGroupProfile> {
        return this.SocketService.send(new ProcessMembershipRequest(requestId, action));
    }
    
    /**
     * Принять/отклонить/отменить запрос
     * @param groupId
     * @returns {Promise<IGroupProfile>}
     */
    processGroupMembership(groupId:number, action:string):Promise<IGroupProfile> {
        return this.SocketService.send(new ProcessGroupMembershipRequest(groupId, action));
    }

    /**
     * Массовая смена члентсва в группах для списка пользователей
     * @param membership
     * @param users
     * @returns {Promise<any>}
     */
    putGroupMembershipBulk(membership: Array<IBulkGroupMembership>, users: Array<number>):Promise<any> {
        return this.SocketService.send(new PutGroupMembershipBulk(membership, users));
    }

    /**
     * Аплоад аватара клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileAvatar(groupId:number, file:any):Promise<IGroupProfile> {
        return this.RESTService.postFile(new PostFile(`/group/avatar/${groupId}`, file))
            .then((response) => response.data)
    }
    
    /**
     * Аплоад фонового изоражения клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileBackground(groupId:number, file:any):Promise<IGroupProfile> {
        return this.RESTService.postFile(new PostFile(`/group/background/${groupId}`,file))
            .then((response) => response.data)
    }

}


