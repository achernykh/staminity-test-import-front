import {merge} from "angular";
import {IUserProfile, IUserConnections, ITrainingZonesType} from '../../../api/user/user.interface';
import { GetUserProfileSummaryStatistics } from '../../../api/statistics/statistics.request';
import {
    GetRequest, PutRequest, GetConnections, GetTrainingZones,
    IGetTrainigZonesResponse
} from '../../../api/user/user.request';
import {ISocketService} from './socket.service';
import {ISessionService, getUser, getCurrentUserId} from './session.service';
import {PostData, PostFile, IRESTService} from './rest.service';
import { IHttpPromise, IHttpPromiseCallbackArg, copy } from 'angular';
import {ISystemMessage} from "../../../api/core";
import {MessageGroupMembership, ProtocolGroupUpdate, IGroupProfile} from "../../../api/group/group.interface";
import {Observable} from "rxjs";
import ReferenceService from "../reference/reference.service";


export default class UserService {

    private connections$: Observable<any>;
    private message$: Observable<any>;

    static $inject = ['SessionService', 'SocketService', 'RESTService', 'ReferenceService'];

    constructor(
        private SessionService:ISessionService,
        private SocketService:ISocketService,
        private RESTService:IRESTService,
        private ReferenceService: ReferenceService
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
        this.message$ = this.SocketService.messages
            .filter(m => (m.type === 'systemFunctions' || m.type === 'systemFunction' || m.type === 'groupMembership' ||
                m.type === 'controlledClub') && m.value).share();

        this.message$.subscribe(m => {
            switch (m.type) {
                case 'systemFunctions': {
                    this.SessionService.setPermissions(m.value);
                    break;
                }
                case 'systemFunction':{
                    this.updatePermissions(m);
                    break;
                }
                case 'groupMembership': {
                    this.updateGroup(new ProtocolGroupUpdate(m));
                    break;
                }
                case 'controlledClub': {
                    this.updateClubs(new ProtocolGroupUpdate(m));
                    break;
                }
            }
        });

        this.connections$ = this.SocketService.connections
            .filter(status => status)
            .flatMap(() => Observable.fromPromise(this.getConnections()))
            .share();

        this.connections$.subscribe(connections => this.setConnections(connections));
    }

    /**
     * @description Сохраняем обьект connections пользователя, содержит данные о группах пользователя. Если в составе
     * групп есть allAthletes (атлеты тренера), то для дальнейшего использования дозапрашиваем настройку тренировочных
     * зон атлетов
     * @param connections
     */
    setConnections(connections: IUserConnections) {
        if (connections && connections.allAthletes) {
            this.getTrainingZones(null, connections.allAthletes.groupId)
                .then((result:Array<IGetTrainigZonesResponse>) => {
                    connections.allAthletes.groupMembers =
                        connections.allAthletes.groupMembers.map(athlete =>
                            Object.assign(athlete,
                                {trainingZones: result.filter(r => r.userId === athlete.userId)[0].trainingZones}));
                    return connections;
                }, error => {throw `error in getTrainingZones => ${error}`;})
                .then(connections => this.SessionService.setConnections(connections));
        } else {
            this.SessionService.updateUser({connections});
        }
    }

    /**
     * Запрос обьекта connections из userProfile пользователя
     * @returns {Promise<any>}
     */
    getConnections() : Promise<any> {
        return this.SocketService.send(new GetConnections()).then(result => result);
    }

    /**
     * @description Запрос обьекта trainingZones из userProfile по группе пользователей/или по пользователю
     * @param userId
     * @param groupId
     * @returns {Promise<any>}
     */
    getTrainingZones(userId: number, groupId: number = null) : Promise<any> {
        return this.SocketService.send(new GetTrainingZones(userId, groupId)).then(result => result.arrayResult);
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param key - id | uri
     * @param ws - true = request for ws, false = request for rest
     * @returns {Promise<T>}
     */
    getProfile(key: string|number, ws: boolean = true) : Promise<IUserProfile | ISystemMessage> {
        return ws ?
            this.SocketService.send(new GetRequest(key)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetRequest(key)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(userChanges: IUserProfile) : Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(userChanges))
            .then((result) => result.value)
            .then(({ revision }) => {
                let updatedUser = merge({}, userChanges, { revision });
                this.SessionService.updateUser(updatedUser);
                return updatedUser;
            });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any) : IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
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
    postProfileBackground(file:any) : IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
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
    getSummaryStatistics(id: number, start?: string, end?: string, group?: string, data?: Array<string>, ws:boolean = true) : Promise<any> {
        return ws ?
            this.SocketService.send(new GetUserProfileSummaryStatistics(id, start, end, group, data)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetUserProfileSummaryStatistics(id, start, end, group, data)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Обновление состава групп текущего пользователя
     * @param message
     */
    private updateGroup(message: ProtocolGroupUpdate) : void {
        let connections = copy(this.SessionService.getUser().connections) || null;
        let group:IGroupProfile = connections && connections[message.groupCode] || null;

        if(!group) {
            return;
        }
        if(message.action === 'I' && group.hasOwnProperty('groupMembers')){
            if(message.groupCode === 'allAthletes'){
                this.getTrainingZones(message.userProfile.userId)
                    .then(result => Object.assign(message.userProfile, {trainingZones: result[0]}))
                    .then(profile => {
                        group.groupMembers.push(profile);
                        connections[message.groupCode] = group;
                        return this.SessionService.updateUser({connections});
                    });
            } else {
                group.groupMembers.push(message.userProfile);
            }
        } else if(message.action === 'D'){
            let index: number = group.groupMembers.findIndex(m => m.userId === message.userProfile.userId);
            if(index !== -1){
                group.groupMembers.splice(index,1);
            }
        }
        connections[message.groupCode] = group;
        this.SessionService.updateUser({connections});
    }

    private updateClubs(message: ProtocolGroupUpdate): void {
        let connections = copy(this.SessionService.getUser().connections) || null;
        let clubs:Array<IGroupProfile> = connections && connections.ControlledClubs || null;

        if(!clubs) {
            return;
        }

        if(message.action === 'I'){
            clubs.push(<IGroupProfile>message.groupProfile);
            //controlledClub.groupMembers.push(message.userProfile);
        } else if(message.action === 'D'){
            let index:number = clubs.findIndex(g => g.groupId === message.groupProfile.groupId);
            if(index !== -1){
                clubs.splice(index,1);
            }
        } else if(message.action === 'U'){
            let index:number = clubs.findIndex(g => g.groupId === message.groupProfile.groupId);
            if(index !== -1){
                clubs[index] = <IGroupProfile>message.groupProfile;
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
    private updatePermissions(message: {action: string, value: any}):void {
        this.SessionService.setPermissions(message.value);
    }

}
