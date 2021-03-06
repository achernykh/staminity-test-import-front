import {merge} from "angular";
import {
    IUserProfile, IUserConnections, ITrainingZonesType,
    GetSummaryStatisticsRequest,
    GetUserRequest, PutUserRequest, GetUserConnectionsRequest, GetTrainingZonesRequest,
    IGetTrainigZonesResponse,
    MessageGroupMembership, ProtocolGroupUpdate, IGroupProfile,
    ISystemMessage
} from '../../../api';
import {SocketService, SessionService, getUser, getCurrentUserId} from './index';
import {PostData, PostFile, RESTService} from './rest.service';
import { IHttpPromise, IHttpPromiseCallbackArg, copy } from 'angular';
import {Observable} from "rxjs";
import ReferenceService from "../reference/reference.service";


export default class UserService {

    messageHandlers = {
        'systemFunctions': ({ value }) => this.SessionService.setPermissions(value),
        'systemFunction': (message) => this.updatePermissions(message),
        'groupMembership': (message) => this.updateGroup(new ProtocolGroupUpdate(message)),
        'controlledClub': (message) => this.updateClubs(new ProtocolGroupUpdate(message))
    };

    resetConnections = () => this.getConnections().then(connections => connections && this.setConnections(connections));

    static $inject = ['SessionService', 'SocketService', 'RESTService', 'ReferenceService'];

    constructor(
        private SessionService: SessionService,
        private SocketService: SocketService,
        private RESTService: RESTService,
        private ReferenceService: ReferenceService // only for init?
    ) {
        this.SessionService.getObservable()
            .map(getCurrentUserId)
            .distinctUntilChanged()
            .filter((userId) => userId && this.SessionService.isCurrentUserId(userId))
            .subscribe((userId) => {
                this.getProfile(userId)
                .then((userProfile) => {
                    this.SessionService.getUser().userId ?
                    this.SessionService.setUser(Object.assign({...userProfile}, {connections: this.SessionService.getUser().connections})) :
                    this.SessionService.updateUser(userProfile);
                });
            });

        // Подписываемся на обновление состава групп текущего пользователя и на обновления состава системных функций
        this.SocketService.messages
            .filter(({ type }) => this.messageHandlers[type])
            .subscribe((message) => {
                let messageHandler = this.messageHandlers[message.type];
                if (messageHandler) {
                    messageHandler(message);
                }
            });


        this.SocketService.connections.subscribe(status => status && this.resetConnections());

        /**this.SocketService.connections
            .filter((status) => status)
            .flatMap(() => Observable.fromPromise(this.getConnections()))
            .subscribe((connections) => this.setConnections(connections));**/
    }

    /**
     * @description Сохраняем обьект connections пользователя, содержит данные о группах пользователя. Если в составе
     * групп есть allAthletes (атлеты тренера), то для дальнейшего использования дозапрашиваем настройку тренировочных
     * зон атлетов
     * @param connections
     */
    setConnections(connections: IUserConnections) {
        console.info('user service: set connections');
        if (connections && connections.allAthletes) {
            this.getTrainingZones(null, connections.allAthletes.groupId)
            .then((result:Array<IGetTrainigZonesResponse>) => {
                console.info('user service: get training zones complete', result);
                connections.allAthletes.groupMembers =
                    connections.allAthletes.groupMembers.map(athlete =>
                        Object.assign(athlete,
                            {trainingZones: result.filter(r => r.userId === athlete.userId)[0].trainingZones}));
                return connections;
            }, (error) => { throw `error in getTrainingZones => ${error}`;})
            .then(connections => this.SessionService.updateUser({connections}));
        } else {
            this.SessionService.updateUser({connections});
        }
    }

    /**
     * Запрос обьекта connections из userProfile пользователя
     * @returns {Promise<any>}
     */
    getConnections() : Promise<any> {
        return this.SocketService.send(new GetUserConnectionsRequest());
    }

    /**
     * @description Запрос обьекта trainingZones из userProfile по группе пользователей/или по пользователю
     * @param userId
     * @param groupId
     * @returns {Promise<any>}
     */
    getTrainingZones(userId: number, groupId: number = null) : Promise<any> {
        return this.SocketService.send(new GetTrainingZonesRequest(userId, groupId)).then(result => result.arrayResult);
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param key - id | uri
     * @param ws - true = request for ws, false = request for rest
     * @returns {Promise<T>}
     */
    getProfile(key: string|number, ws: boolean = true) : Promise<IUserProfile | ISystemMessage> {
        return ws ? (
            this.SocketService.send(new GetUserRequest(key))
        ) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetUserRequest(key)))
            .then((response: IHttpPromiseCallbackArg<any>) => response.data);
        /*
        .then((user) => {
            if (this.SessionService.isCurrentUserId(user.userId)) {
                this.SessionService.updateUser(user);
            }
        });*/
    }

    /**
     * Обновляем данные пользователя
     * @param userChanges - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(userChanges: IUserProfile) : Promise<IUserProfile> {
        debugger;
        let needRefresh: boolean = Object.keys(userChanges).length > 4;//userChanges.hasOwnProperty('trainingZones') || userChanges.hasOwnProperty('public');
        return this.SocketService.send(new PutUserRequest(userChanges))
        .then((result) => result.value)
        .then(({ revision }) => {
            let updatedUser = merge({}, userChanges, { revision });
            if (this.SessionService.isCurrentUserId(userChanges.userId)) {
                needRefresh ?
                    this.SessionService.setUser(Object.assign({...updatedUser}, {connections: this.SessionService.getUser().connections})) :
                    this.SessionService.updateUser(updatedUser);
            }
            return updatedUser;
        }, (error) => {
            if (error === 'expiredObject') {
                this.getProfile(userChanges.userId)
                .then((user) => {
                    const {revision} = <any> user;
                    this.putProfile(Object.assign({ ...user, ...userChanges, revision }, {connections: this.SessionService.getUser().connections}));
                });
            }
        });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any) : Promise<any> {
        const userId = this.SessionService.getCurrentUserId();
        const url = `/user/avatar/${userId}`;
        return this.RESTService.postFile(new PostFile(url, file))
            .then((response) => {
                this.SessionService.updateUser(response);
                return response;
            });
            //.then((response) => response.data);
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any) : Promise<any> {
        const userId = this.SessionService.getCurrentUserId();
        const url = `/user/background/${userId}`;
        return this.RESTService.postFile(new PostFile(url, file))
            .then((response) => {
                this.SessionService.updateUser(response);
                return response;
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
            this.SocketService.send(new GetSummaryStatisticsRequest(id, start, end, group, data)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetSummaryStatisticsRequest(id, start, end, group, data)))
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
                    .then(result => Object.assign(message.userProfile, result[0]))
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
        console.debug('user updatePermissions', message);
        this.SessionService.setPermissions(message.value);
    }

}
