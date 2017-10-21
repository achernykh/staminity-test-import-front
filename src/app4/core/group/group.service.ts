import { Injectable } from "@angular/core";
import { SocketService } from "../socket/socket.service";
import { RestService } from "../rest/rest.service";
import { IGroupProfile, IBulkGroupMembership, IGroupManagementProfile } from "../../../../api/group/group.interface";
import {
    GetProfileRequest, PutProfileRequest, JoinRequest, LeaveRequest,
    GetMembershipRequest, ProcessMembershipRequest, GetMembersListRequest, PutGroupMembershipBulkRequest,
    GetGroupManagementProfileRequest
} from "../../../../api/group/group.request";
import { PostData, PostFile } from "../rest/rest.interface";


@Injectable()
export class GroupService {

    constructor(
        private socket: SocketService,
        private rest: RestService) {
    }

    /**
     * Запрос профиля группы
     * @param id
     * @param uri
     * @returns {Promise<IGroupProfile>}
     */
    getProfile(id:string|number, type?:string, ws: boolean = true): Promise<IGroupProfile> {
        return ws ?
            this.socket.send(new GetProfileRequest(id,type)) :
            this.rest.postData(new PostData('/api/wsgate', new GetProfileRequest(id,type)))
                .then((response: any) => response.data);
    }

    /**
     * Сохранение изменний в профайл группы
     * @param profile
     * @returns {Promise<IGroupProfile>}
     */
    putProfile(profile:IGroupProfile):Promise<any>{
        return this.socket.send(new PutProfileRequest(profile));
    }

    /**
     * Запрос вступления в группу
     * @param id
     * @returns {Promise<any>}
     */
    join(groupId: number, userId: number = null):Promise<any>{
        return this.socket.send(new JoinRequest(groupId, userId));
    }

    /**
     * Запрос выхода из группы
     * @param id
     * @returns {Promise<any>}
     */
    leave(groupId: number, userId: number = null):Promise<any>{
        return this.socket.send(new LeaveRequest(groupId, userId));
    }

    /**
     * Получение реестра запросов
     * @param offset
     * @param limit
     * @returns {Promise<IGroupProfile>}
     */
    getMembershipRequests(offset:number, limit: number):Promise<IGroupProfile> {
        return this.socket.send(new GetMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param groupId - номер группы
     * @param requestId - номер запроса
     * @returns {Promise<IGroupProfile>}
     */
    processMembership(action:string, groupId?:number, requestId?:number, ):Promise<IGroupProfile> {
        return this.socket.send(new ProcessMembershipRequest(action, groupId,requestId));
    }

    /**
     * Получение списка пользователей, входящих в группу
     * @param groupId
     * @returns {Promise<IGroupProfile>}
     */
    getMembershipList(groupId:number): Promise<IGroupProfile> {
        return this.socket.send(new GetMembersListRequest(groupId));
    }

    /**
     * Запрос информации о членах клуба для управления тарифами и ролями
     * @param groupId
     * @param type - group | club | coach
     * @returns {Promise<any>}
     */
    getManagementProfile(groupId: number, type: string): Promise<IGroupManagementProfile>{
        return this.socket.send(new GetGroupManagementProfileRequest(groupId, type));
    }

    /**
     * Массовая смена члентсва в группах для списка пользователей
     * @param membership
     * @param users
     * @returns {Promise<any>}
     */
    putGroupMembershipBulk(groupId: number, membership: Array<IBulkGroupMembership>, users: Array<number>):Promise<any> {
        return this.socket.send(new PutGroupMembershipBulkRequest(groupId, membership, users));
    }

    /**
     * Аплоад аватара клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileAvatar(groupId:number, file:any):Promise<any> {
        return this.rest.postFile(new PostFile(`/group/avatar/${groupId}`, file));
    }

    /**
     * Аплоад фонового изоражения клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileBackground(groupId:number, file:any):Promise<any> {
        return this.rest.postFile(new PostFile(`/group/background/${groupId}`,file));
    }

}


