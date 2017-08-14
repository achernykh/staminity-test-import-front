import {IUserProfile} from '../../../api/user/user.interface';
import { GetUserProfileSummaryStatistics } from '../../../api/statistics/statistics.request';
import {GetRequest, PutRequest, GetConnections, GetTrainingZones} from '../../../api/user/user.request';
import {ISocketService} from './socket.service';
import {ISessionService} from './session.service';
import {PostData, PostFile, IRESTService} from './rest.service';
import { IHttpPromise,IHttpPromiseCallbackArg, copy } from 'angular';
import {ISystemMessage} from "../../../api/core";
import {MessageGroupMembership, ProtocolGroupUpdate, IGroupProfile} from "../../../api/group/group.interface";
import {Observable} from "rxjs";
import ReferenceService from "../reference/reference.service";


export default class UserService {

    private connections$: Observable<any>;
    private message$: Observable<any>;
    private profile$: Observable<IUserProfile>;
    private profile: IUserProfile = null;

    static $inject = ['SessionService', 'SocketService','RESTService','ReferenceService'];

    constructor(
        private SessionService:ISessionService,
        private SocketService:ISocketService,
        private RESTService:IRESTService,
        private ReferenceService: ReferenceService) {

        // Подписываемся на текущий профиль пользователя
        this.profile$ = this.SessionService.profile.subscribe(profile => this.profile = copy(profile));

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
                    debugger;
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

        this.connections$.subscribe(connections => this.SessionService.setConnections(connections));
    }

    /**
     * Запрос обьекта connections из userProfile пользователя
     * @returns {Promise<TResult>}
     */
    getConnections():Promise<any> {
        return this.SocketService.send(new GetConnections()).then(result => result);
    }

    /**
     * Запрос обьекта trainingZones из userProfile по группе пользователей/или по пользователю
     * @param groupId
     * @returns {Promise<any>}
     */
    getTrainingZones(groupId):Promise<any> {
        return this.SocketService.send(new GetTrainingZones(groupId));
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param key - id | uri
     * @param ws - true = request for ws, false = request for rest
     * @returns {Promise<T>}
     */
    getProfile(key:string|number, ws: boolean = true):Promise<IUserProfile> | Promise<ISystemMessage>{
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
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(profile))
                .then((result)=>{
                    let currentUser = this.SessionService.getUser();
                    if (result.value.id === currentUser.userId){
                        this.SessionService.setUser(Object.assign(currentUser, profile, result.value.revision));
                    }
                    return result;
                });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any):IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
            .then((response)=>{
                let currentUser = this.SessionService.getUser();
                if (response.data['userId'] === currentUser.userId){
                    this.SessionService.setUser(<IUserProfile>response.data);
                }
                return response.data;
            });
            //.then((response) => response.data);
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any):IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
            .then((response)=>{
                let currentUser = this.SessionService.getUser();
                if (response.data['userId'] === currentUser.userId){
                    this.SessionService.setUser(<IUserProfile>response.data);
                }
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
    getSummaryStatistics(id: number, start?: string, end?: string, group?: string, data?: Array<string>, ws:boolean = true):Promise<any> {
        return ws ?
            this.SocketService.send(new GetUserProfileSummaryStatistics(id, start, end, group, data)) :
            this.RESTService.postData(new PostData('/api/wsgate', new GetUserProfileSummaryStatistics(id, start, end, group, data)))
                .then((response: IHttpPromiseCallbackArg<any>) => response.data);
    }

    /**
     * Обновление состава групп текущего пользователя
     * @param message
     */
    private updateGroup(message: ProtocolGroupUpdate): void {
        let connections = this.profile.connections || null;
        let group:IGroupProfile = connections && connections[message.groupCode] || null;

        if(!group) {
            return;
        }
        if(message.action === 'I' && group.hasOwnProperty('groupMembers')){
            group.groupMembers.push(message.userProfile);
        } else if(message.action === 'D'){
            let index: number = group.groupMembers.findIndex(m => m.userId === message.userProfile.userId);
            if(index !== -1){
                group.groupMembers.splice(index,1);
            }
        }
        connections[message.groupCode] = group;
        this.SessionService.setConnections(connections);
    }

    private updateClubs(message: ProtocolGroupUpdate): void {
        let connections = this.profile.connections || null;
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
        this.SessionService.setConnections(connections);
    }

    /**
     * Обновляем перечень доступных для пользователя функций сервиса.
     * Ассинхронное сообщение с функциями приходит при каждом открытие сессии
     * @param permissions
     */
    private updatePermissions(message: {action: string, value: any}):void {
        let permissions = this.SessionService.getPermissions();
        switch (message.action){
            case 'U': {
                Object.keys(message.value).forEach(p => permissions[p] = message.value[p]);
                break;
            }
            case 'I': {
                Object.assign(permissions, message.value);
                break;
            }
            case 'D': {
                Object.keys(message.value).forEach(p => permissions.hasOwnProperty(p) && delete permissions[p]);
                break;
            }
        }
        this.SessionService.setPermissions(permissions);
    }

}
