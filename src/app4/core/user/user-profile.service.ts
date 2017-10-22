import { IUserProfile } from '../../../../api/user/user.interface';
import { GetUserProfileSummaryStatistics } from '../../../../api/statistics/statistics.request';
import { GetRequest, PutRequest } from '../../../../api/user/user.request';
import { SocketService } from '../socket/socket.service';
import { SessionService, getCurrentUserId} from '../session/session.service';
import { RestService } from '../rest/rest.service';
import { PostData, PostFile } from '../rest/rest.interface';
import { ISystemMessage } from "../../../../api/core";
import { Injectable } from "@angular/core";

@Injectable()
export class UserProfileService {

    messageHandlers = {
        'systemFunctions': ({ value }) => this.session.setPermissions(value),
        'systemFunction': (message) => this.updatePermissions(message)
    };

    constructor(
        private session: SessionService,
        private socket: SocketService,
        private rest: RestService
    ) {
        /**this.session.getObservable()
            .map(getCurrentUserId)
            .distinctUntilChanged()
            .filter((userId) => userId && this.session.isCurrentUserId(userId))
            .subscribe((userId) => {
                this.getProfile(userId)
                    .then((userProfile) => {
                        this.session.updateUser(userProfile);
                    });
            });**/

        // Подписываемся на обновление  состава системных функций
        this.socket.messages
            .filter(({ type }) => this.messageHandlers[type])
            .subscribe((message) => {
                let messageHandler = this.messageHandlers[message.type];
                if (messageHandler) {
                    messageHandler(message);
                }
            });

    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param key - id | uri
     * @param ws - true = request for ws, false = request for rest
     * @returns {Promise<IUserProfile | ISystemMessage>}
     */
    getProfile(key: string|number, ws: boolean = true) : Promise<IUserProfile | ISystemMessage> {
        return ws ? (
                this.socket.send(new GetRequest(key))
            ) : (
                this.rest.postData(new PostData('/api/wsgate', new GetRequest(key)))
                    .then((response: any) => response.data)
            )
                .then((user) => {
                    if (this.session.isCurrentUserId(user.userId)) {
                        this.session.updateUser(user);
                    }
                });
    }

    /**
     * Обновляем данные пользователя
     */
    putProfile(userChanges: IUserProfile) : Promise<IUserProfile> {
        return this.socket.send(new PutRequest(userChanges))
            .then((result) => result.value)
            .then(({ revision }) => {
                let updatedUser = Object.assign({}, userChanges, { revision });
                if (this.session.isCurrentUserId(userChanges.userId)) {
                    this.session.updateUser(updatedUser);
                }
                return updatedUser;
            }, (error) => {
                if (error === 'expiredObject') {
                    this.getProfile(userChanges.userId)
                        .then((user) => this.putProfile({ ...user, ...userChanges }));
                }
            });
    }

    /**
     * Аплоад аватара пользователя
     */
    postProfileAvatar(file:any) : Promise<any> {
        return this.rest.postFile(new PostFile('/user/avatar',file))
            .then((response) => {
                this.session.updateUser(response.data);
                return response.data;
            });
        //.then((response) => response.data);
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any) : Promise<any> {
        return this.rest.postFile(new PostFile('/user/background',file))
            .then((response) => {
                this.session.updateUser(response.data);
                return response.data;
            });
    }

    /**
     * Запрос итоговой ститистики по тренировкам
     */
    getSummaryStatistics(id: number, start?: string, end?: string, group?: string, data?: Array<string>, ws:boolean = true) : Promise<any> {
        return ws ?
            this.socket.send(new GetUserProfileSummaryStatistics(id, start, end, group, data)) :
            this.rest.postData(new PostData('/api/wsgate', new GetUserProfileSummaryStatistics(id, start, end, group, data)))
                .then((response: any) => response.data);
    }

    /**
     * Обновляем перечень доступных для пользователя функций сервиса.
     * Ассинхронное сообщение с функциями приходит при каждом открытие сессии
     */
    private updatePermissions(message: {action: string, value: any}):void {
        this.session.setPermissions(message.value);
    }

}
