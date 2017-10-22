import { Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { MessageGroupMembership, ProtocolGroupUpdate, IGroupProfile } from "../../../../api/group/group.interface";
import { Observable } from "rxjs";
import { SocketService } from "../socket/socket.service";
import { IUserConnections } from "../../../../api/user/user.interface";
import { IGetTrainigZonesResponse, GetConnections, GetTrainingZones } from "../../../../api/user/user.request";


@Injectable()
export class UserConnectionsService {

    messageHandlers = {
        'groupMembership': (message) => this.updateGroup(new ProtocolGroupUpdate(message)),
        'controlledClub': (message) => this.updateClubs(new ProtocolGroupUpdate(message))
    };

    constructor(private session: SessionService, private socket: SocketService) {

        // Подписываемся на обновление состава групп текущего пользователя
        // и на обновления состава системных функций
        this.socket.messages
            .filter(({ type }) => this.messageHandlers[type])
            .subscribe((message) => {
                let messageHandler = this.messageHandlers[message.type];
                if (messageHandler) {
                    messageHandler(message);
                }
            });

        // При каждом открытии сессии пользователя проверяем состав connections
        this.socket.connections
            .filter((status) => status)
            .flatMap(() => Observable.fromPromise(this.getConnections()))
            .subscribe((connections) => this.parseConnections(connections));

    }

    /**
     * Запрос обьекта connections из userProfile пользователя
     * @returns {Promise<any>}
     */
    getConnections() : Promise<any> {
        return this.socket.send(new GetConnections()).then(result => result);
    }

    /**
     * @description Запрос обьекта trainingZones из userProfile по группе пользователей/или по пользователю
     * @param userId
     * @param groupId
     * @returns {Promise<any>}
     */
    getTrainingZones(userId: number, groupId: number = null) : Promise<any> {
        return this.socket.send(new GetTrainingZones(userId, groupId)).then(result => result.arrayResult);
    }

    /**
     * @description Сохраняем обьект connections пользователя, содержит данные о группах пользователя. Если в составе
     * групп есть allAthletes (атлеты тренера), то для дальнейшего использования дозапрашиваем настройку тренировочных
     * зон атлетов
     * @param connections
     */
    private parseConnections(connections: IUserConnections) {
        if (connections && connections.allAthletes) {
            this.getTrainingZones(null, connections.allAthletes.groupId)
                .then((result:Array<IGetTrainigZonesResponse>) => {
                    connections.allAthletes.groupMembers =
                        connections.allAthletes.groupMembers.map(athlete =>
                            Object.assign(athlete,
                                {trainingZones: result.filter(r => r.userId === athlete.userId)[0].trainingZones}));
                    return connections;
                }, (error) => {
                    throw `error in getTrainingZones => ${error}`;
                })
                .then(connections => this.updateConnections(connections));
        } else {
            this.updateConnections(connections);
        }
    }

    /**
     * Обновление состава групп текущего пользователя
     * @param message
     */
    private updateGroup(message: ProtocolGroupUpdate) : void {
        let connections = Object.assign({}, this.session.getUser().connections) || null;
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
                        return this.updateConnections(connections);
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
        this.updateConnections(connections);
    }

    /**
     * Обновление состава контроллируемых клубов
     * @param message
     */
    private updateClubs(message: ProtocolGroupUpdate): void {
        let connections = Object.assign({}, this.session.getUser().connections) || null;
        let clubs:Array<IGroupProfile> = connections && connections.ControlledClubs || null;

        if(!clubs) {
            return;
        }

        if(message.action === 'I'){
            clubs.push(<IGroupProfile>message.groupProfile);
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
        this.updateConnections(connections);
    }

    private updateConnections(connections: IUserConnections) {
        this.session.updateUser(Object.assign(this.session.getUser(), {connections: connections}));
    }

}