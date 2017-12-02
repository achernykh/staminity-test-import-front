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

import { IHttpPromise } from "angular";
import IHttpPromiseCallbackArg = angular.IHttpPromiseCallbackArg;
import { GetGroupMembersListRequest } from "../../../api/group/group.request";
import {SocketService} from "./index";
import {IRESTService, PostData, PostFile} from "./rest.service";

export default class GroupService {

    public static $inject = ["SocketService", "RESTService"];

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
    public getProfile(id: string|number, type?: string, ws: boolean = true): Promise<IGroupProfile> {
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
    public putProfile(profile: IGroupProfile): Promise<any> {
        return this.SocketService.send(new PutGroupProfileRequest(profile));
    }

    /**
     * Запрос вступления в группу
     * @param id
     * @returns {Promise<any>}
     */
    public join(groupId: number, userId: number = null): Promise<any> {
        return this.SocketService.send(new JoinGroupRequest(groupId, userId));
    }

    /**
     * Запрос выхода из группы
     * @param id
     * @returns {Promise<any>}
     */
    public leave(groupId: number, userId: number = null): Promise<any> {
        return this.SocketService.send(new LeaveGroupRequest(groupId, userId));
    }

    /**
     * Получение реестра запросов
     * @param offset
     * @param limit
     * @returns {Promise<IGroupProfile>}
     */
    public getMembershipRequests(offset: number, limit: number): Promise<IGroupProfile> {
        return this.SocketService.send(new GetGroupMembershipRequest(offset, limit));
    }

    /**
     * Принять/отклонить/отменить запрос
     * @param groupId - номер группы
     * @param requestId - номер запроса
     * @returns {Promise<IGroupProfile>}
     */
    public processMembership(action: string, groupId?: number, requestId?: number ): Promise<IGroupProfile> {
        return this.SocketService.send(new ProcessGroupMembershipRequest(action, groupId, requestId));
    }

    /**
     * Получение списка пользователей, входящих в группу
     * @param groupId
     * @returns {Promise<IGroupProfile>}
     */
    public getMembershipList(groupId: number): Promise<IGroupProfile> {
        return this.SocketService.send(new GetGroupMembersListRequest(groupId));
    }

    /**
     * Запрос информации о членах клуба для управления тарифами и ролями
     * @param groupId
     * @param type - group | club | coach
     * @returns {Promise<any>}
     */
    public getManagementProfile(groupId: number, type: string): Promise<IGroupManagementProfile> {
        return this.SocketService.send(new GetGroupManagementProfileRequest(groupId, type));
    }

    /**
     * Массовая смена члентсва в группах для списка пользователей
     * @param membership
     * @param users
     * @returns {Promise<any>}
     */
    public putGroupMembershipBulk(groupId: number, membership: IBulkGroupMembership[], users: number[]): Promise<any> {
        return this.SocketService.send(new PutGroupMembershipBulkRequest(groupId, membership, users));
    }

    /**
     * Аплоад аватара клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    public postProfileAvatar(groupId: number, file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/group/avatar/${groupId}`, file));
    }

    /**
     * Аплоад фонового изоражения клуба
     * @param groupId
     * @param file
     * @returns {Promise<IGroupProfile>|Promise<T>|PromiseLike<IGroupProfile>|Promise<TResult2|IGroupProfile>}
     */
    public postProfileBackground(groupId: number, file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile(`/group/background/${groupId}`, file));
    }

}
