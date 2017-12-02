import {merge} from "angular";
import { copy, IHttpPromise, IHttpPromiseCallbackArg } from "angular";
import {Observable} from "rxjs";
import {
    GetSummaryStatisticsRequest, GetTrainingZonesRequest, GetUserConnectionsRequest,
    GetUserRequest,
    IGetTrainigZonesResponse, IGroupProfile, ISystemMessage, ITrainingZonesType,
    IUserConnections,
    IUserProfile, MessageGroupMembership, ProtocolGroupUpdate,
    PutUserRequest,
} from "../../../api";
import ReferenceService from "../reference/reference.service";
import {getCurrentUserId, getUser, SessionService, SocketService} from "./index";
import {IRESTService, PostData, PostFile} from "./rest.service";

export default class UserService {

    public messageHandlers = {
        "systemFunctions": ({ value }) => this.SessionService.setPermissions(value),
        "systemFunction": (message) => this.updatePermissions(message),
        "groupMembership": (message) => this.updateGroup(new ProtocolGroupUpdate(message)),
        "controlledClub": (message) => this.updateClubs(new ProtocolGroupUpdate(message)),
    };

    public static $inject = ["SessionService", "SocketService", "RESTService", "ReferenceService"];

    constructor(
        private SessionService: SessionService,
        private SocketService: SocketService,
        private RESTService: IRESTService,
        private ReferenceService: ReferenceService,
    ) {
        this.SessionService.getObservable()
        .map(getCurrentUserId)
        .distinctUntilChanged()
        .filter((userId) => userId && this.SessionService.isCurrentUserId(userId))
        .subscribe((userId) => {
            this.getProfile(userId)
            .then((userProfile) => {
                this.SessionService.updateUser(userProfile);
            });
        });

        // Подписываемся на обновление состава групп текущего пользователя и на обновления состава системных функций
        this.SocketService.messages
        .filter(({ type }) => this.messageHandlers[type])
        .subscribe((message) => {
            const messageHandler = this.messageHandlers[message.type];
            if (messageHandler) {
                messageHandler(message);
            }
        });

        this.SocketService.connections
        .filter((status) => status)
        .flatMap(() => Observable.fromPromise(this.getConnections()))
        .subscribe((connections) => this.setConnections(connections));
    }

    /**
     * @description Сохраняем обьект connections пользователя, содержит данные о группах пользователя. Если в составе
     * групп есть allAthletes (атлеты тренера), то для дальнейшего использования дозапрашиваем настройку тренировочных
     * зон атлетов
     * @param connections
     */
    public setConnections(connections: IUserConnections) {
        if (connections && connections.allAthletes) {
            this.getTrainingZones(null, connections.allAthletes.groupId)
            .then((result: IGetTrainigZonesResponse[]) => {
                connections.allAthletes.groupMembers =
                    connections.allAthletes.groupMembers.map((athlete) =>
                        Object.assign(athlete,
                            {trainingZones: result.filter((r) => r.userId === athlete.userId)[0].trainingZones}));
                return connections;
            }, (error) => {
                throw new Error(`error in getTrainingZones => ${error}`);
            })
            .then((connections) => this.SessionService.updateUser({connections}));
        } else {
            this.SessionService.updateUser({connections});
        }
    }

    /**
     * Запрос обьекта connections из userProfile пользователя
     * @returns {Promise<any>}
     */
    public getConnections(): Promise<any> {
        return this.SocketService.send(new GetUserConnectionsRequest()).then((result) => result);
    }

    /**
     * @description Запрос обьекта trainingZones из userProfile по группе пользователей/или по пользователю
     * @param userId
     * @param groupId
     * @returns {Promise<any>}
     */
    public getTrainingZones(userId: number, groupId: number = null): Promise<any> {
        return this.SocketService.send(new GetTrainingZonesRequest(userId, groupId)).then((result) => result.arrayResult);
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param key - id | uri
     * @param ws - true = request for ws, false = request for rest
     * @returns {Promise<T>}
     */
    public getProfile(key: string|number, ws: boolean = true): Promise<IUserProfile | ISystemMessage> {
        return ws ? (
            this.SocketService.send(new GetUserRequest(key))
        ) : (
            this.RESTService.postData(new PostData("/api/wsgate", new GetUserRequest(key)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data)
        )
        .then((user) => {
            if (this.SessionService.isCurrentUserId(user.userId)) {
                this.SessionService.updateUser(user);
            }
        });
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    public putProfile(userChanges: IUserProfile): Promise<IUserProfile> {
        return this.SocketService.send(new PutUserRequest(userChanges))
        .then((result) => result.value)
        .then(({ revision }) => {
            const updatedUser = merge({}, userChanges, { revision });
            if (this.SessionService.isCurrentUserId(userChanges.userId)) {
                this.SessionService.updateUser(updatedUser);
            }
            return updatedUser;
        }, (error) => {
            if (error === "expiredObject") {
                this.getProfile(userChanges.userId)
                .then((user) => this.putProfile({ ...user, ...userChanges }));
            }
        });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    public postProfileAvatar(file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile("/user/avatar", file))
            .then((response) => {
                this.SessionService.updateUser(response.data);
                return response.data;
            });
            //.then((response) => response.data);
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    public postProfileBackground(file: any): IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile("/user/background", file))
            .then((response) => {
                this.SessionService.updateUser(response.data);
                return response.data;
            });
    }

    /**
     * Запрос итоговой ститистики по тренировкам
     * @param id
     * @param start
     * @param end
     * @param group
     * @param data
     * @returns {Promise<TResult>}
     */
    public getSummaryStatistics(id: number, start?: string, end?: string, group?: string, data?: string[], ws: boolean = true): Promise<any> {
        return ws ?
            this.SocketService.send(new GetSummaryStatisticsRequest(id, start, end, group, data)) :
            this.RESTService.postData(new PostData("/api/wsgate", new GetSummaryStatisticsRequest(id, start, end, group, data)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Обновление состава групп текущего пользователя
     * @param message
     */
    private updateGroup(message: ProtocolGroupUpdate): void {
        const connections = copy(this.SessionService.getUser().connections) || null;
        const group: IGroupProfile = connections && connections[message.groupCode] || null;

        if (!group) {
            return;
        }
        if (message.action === "I" && group.hasOwnProperty("groupMembers")) {
            if (message.groupCode === "allAthletes") {
                this.getTrainingZones(message.userProfile.userId)
                    .then((result) => Object.assign(message.userProfile, {trainingZones: result[0]}))
                    .then((profile) => {
                        group.groupMembers.push(profile);
                        connections[message.groupCode] = group;
                        return this.SessionService.updateUser({connections});
                    });
            } else {
                group.groupMembers.push(message.userProfile);
            }
        } else if (message.action === "D") {
            const index: number = group.groupMembers.findIndex((m) => m.userId === message.userProfile.userId);
            if (index !== -1) {
                group.groupMembers.splice(index, 1);
            }
        }
        connections[message.groupCode] = group;
        this.SessionService.updateUser({connections});
    }

    private updateClubs(message: ProtocolGroupUpdate): void {
        const connections = copy(this.SessionService.getUser().connections) || null;
        const clubs: IGroupProfile[] = connections && connections.ControlledClubs || null;

        if (!clubs) {
            return;
        }

        if (message.action === "I") {
            clubs.push(message.groupProfile as IGroupProfile);
            //controlledClub.groupMembers.push(message.userProfile);
        } else if (message.action === "D") {
            const index: number = clubs.findIndex((g) => g.groupId === message.groupProfile.groupId);
            if (index !== -1) {
                clubs.splice(index, 1);
            }
        } else if (message.action === "U") {
            const index: number = clubs.findIndex((g) => g.groupId === message.groupProfile.groupId);
            if (index !== -1) {
                clubs[index] = message.groupProfile as IGroupProfile;
            }
        }
        connections.ControlledClubs = clubs;
        this.SessionService.updateUser({connections});
    }

    /**
     * Обновляем перечень доступных для пользователя функций сервиса.
     * Ассинхронное сообщение с функциями приходит при каждом открытие сессии
     * @param permissions
     */
    private updatePermissions(message: {action: string, value: any}): void {
        this.SessionService.setPermissions(message.value);
    }

}
