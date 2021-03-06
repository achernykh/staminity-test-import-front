import {
    GetGroupManagementProfileRequest,
    GetGroupMembershipRequest,
    GetGroupProfileRequest,
    IBulkGroupMembership,
    IGroupManagementProfile,
    IGroupProfile,
    JoinGroupRequest,
    LeaveGroupRequest,
    ProcessGroupMembershipRequest,
    PutGroupMembershipBulkRequest,
    PutGroupProfileRequest } from "../../../api";

import { IHttpPromise, IHttpPromiseCallbackArg } from "angular";
import { GetGroupMembersListRequest } from "../../../api/group/group.request";
import {SocketService} from "./index";
import {IRESTService, PostData, PostFile} from "./rest.service";

export default class GroupService {

    static $inject = ["SocketService", "RESTService"];

    constructor(
        private SocketService: SocketService,
        private RESTService: IRESTService) {
    }

    /**
     * Запрос профиля группы
     * @param id
     * @param uri
     * @returns {Promise<IGroupProfile>}
     */
    getProfile(id: string|number, type?: string, ws: boolean = true): Promise<IGroupProfile> {
        return ws ?
            this.SocketService.send(new GetGroupProfileRequest(id, type)) :
            this.RESTService.postData(new PostData("/api/wsgate", new GetGroupProfileRequest(id, type)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Сохранение изменний в профайл группы
     * @param profile
     * @returns {Promise<IGroupProfile>}
     */
    putProfile(profile: IGroupProfile): Promise<any> {
        return this.SocketService.send(new PutGroupProfileRequest(profile));
    }

    /**
     * Запрос вступления в группу
     * @param id
     * @returns {Promise<any>}
     */
    join(groupId: number, userId: number = null): Promise<any> {
        return this.SocketService.send(new JoinGroupRequest(groupId, userId));
    }

    /**
     * Запрос выхода из группы
     * @param id
     * @returns {Promise<any>}
     */
    leave(groupId: number, userId: number = null): Promise<any> {
        return this.SocketService.send(new LeaveGroupRequest(groupId, userId));
    }

    /**
     * Получение реестра запросов
     * @param offset
     * @param limit
     * @returns {Promise<IGroupProfile>}
     */
    getMembershipRequests(offset: number, limit: number): Promise<IGroupProfile> {
        return this.SocketService.send(new GetGroupMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param groupId - номер группы
     * @param requestId - номер запроса
     * @returns {Promise<IGroupProfile>}
     */
    processMembership(action: string, groupId?: number, requestId?: number ): Promise<IGroupProfile> {
        return this.SocketService.send(new ProcessGroupMembershipRequest(action, groupId, requestId));
    }

    /**
     * Получение списка пользователей, входящих в группу
     * @param groupId
     * @returns {Promise<IGroupProfile>}
     */
    getMembershipList(groupId: number): Promise<IGroupProfile> {
        return this.SocketService.send(new GetGroupMembersListRequest(groupId));
    }

    /**
     * Запрос информации о членах клуба для управления тарифами и ролями
     * @param groupId
     * @param type - group | club | coach
     * @returns {Promise<any>}
     */
    getManagementProfile(groupId: number, type: string): Promise<IGroupManagementProfile> {
        return this.SocketService.send(new GetGroupManagementProfileRequest(groupId, type));
    }

    /**
     * Массовая смена члентсва в группах для списка пользователей
     * @param membership
     * @param users
     * @returns {Promise<any>}
     */
    putGroupMembershipBulk(groupId: number, membership: IBulkGroupMembership[], users: number[]): Promise<any> {
        return this.SocketService.send(new PutGroupMembershipBulkRequest(groupId, membership, users));
    }

    /**
     * Аплоад аватара клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileAvatar(groupId: number, file: any): Promise<any> {
        return this.RESTService.postFile(new PostFile(`/group/avatar/${groupId}`, file));
    }

    /**
     * Аплоад фонового изоражения клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    postProfileBackground(groupId: number, file: any): Promise<any> {
        return this.RESTService.postFile(new PostFile(`/group/background/${groupId}`, file));
    }

}
