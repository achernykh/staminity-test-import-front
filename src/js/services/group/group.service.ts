import {IGroupProfile, IGroupProfileShort} from '../../../../api/group/group.interface';
import {
    GetRequest,
    PutRequest,
    JoinRequest,
    LeaveRequest,
    GetMembershipRequest,
    ProcessMembershipRequest,
    GetMembersRequest
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
        return this.SocketService.send(new GetRequest(uri))
            .then((data) => {
                return data[0].value;
            });
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
        return this.SocketService.send(new JoinRequest(groupId, userId));
    }


}


