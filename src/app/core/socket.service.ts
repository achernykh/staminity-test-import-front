import { _connection } from './api.constants';
import { ISessionService } from './session.service';
import {StateService} from 'angular-ui-router';
import { Observable, Subject } from 'rxjs/Rx';
import LoaderService from "../share/loader/loader.service";
import {IMessageService} from "./message.service";


export enum SocketStatus {
    Connecting,
    Open,
    Closing,
    Close
}

export interface IWSResponse {
    requestId:number;
    errorMessage?: string;
    data:any;
}

export interface IWSRequest {
    requestId?:number;
    requestType?:string;
    requestData?:any;
}

export interface ISocketService {
    open(token:string): Promise<number>;
    response(event:any);
    reopen(event:any);
    close();
    send(request:IWSRequest): Promise<any>;
    messages: Observable<any>;
    connections: Observable<any>;
}

export interface ISocketAsyncMessage {
    type: string;
    action: string;
    value: Object;
}

/**
 * Класс для работы с websoсket сессией
 */
export class SocketService implements ISocketService {

    private socket: WebSocket;
    private requests: Array<any> = [];
    private requestId: number = 1;
    private reopenTimeout: number = 0.5; // в секундах
    private responseTimeout: number = 3.0; // сек
    private readonly responseLimit: {} = { // лимиты ожидания по отдельным запросам (сек)
        getActivityIntervals: 10.0,
        postUserExternalAccount: 60.0,
        putUserExternalAccountSettingSuccess: 10.0,
        getCalendarItem: 30.0,
        calculateActivityRange: 15.0,
        putCalendarItem: 10.0,
        getActivityCategory: 10.0
    };

    public connections: Subject<any>;
    public messages: Subject<any>;

    static $inject = ['$q','SessionService', 'LoaderService','message','$state'];

    constructor (
        private $q: any,
        private SessionService:ISessionService,
        private loader: LoaderService,
        private message: IMessageService,
        private $state: StateService ) {

        this.connections = new Subject();
        this.messages = new Subject();
    }

    /**
     * Открыть сессиию пользователя
     * @returns {Promise<T>}
     * @param token
     */
    open(token:string = this.SessionService.getToken(), delay:number = 100):Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.socket || (this.socket.readyState !== SocketStatus.Open &&
                this.socket.readyState !== SocketStatus.Connecting)) {

                console.log('SocketService: opening...');
                this.socket = new WebSocket('ws://' + _connection.server + '/' + token);
                this.socket.addEventListener('message', this.response.bind(this));
                this.socket.addEventListener('close', this.close.bind(this)); //reopen?
                this.socket.addEventListener('error', this.reopen.bind(this));
                
                Observable.fromEvent(this.socket, 'open')
                    .subscribe(this.connections);
                
                Observable.fromEvent(this.socket, 'message')
                    .map((message: any) => JSON.parse(message.data))
                    .subscribe(this.messages);
            }

            let onOpen = () => {
                if (this.socket.readyState === SocketStatus.Closing) {
                    reject(this.socket.readyState);
                } else if (this.socket.readyState === SocketStatus.Open) {
                    resolve(this.socket.readyState);
                }
            };

            this.socket.readyState ? onOpen() : this.socket.addEventListener('open', onOpen);
        });
    }

    /**
     * Получаем запрос по websocket
     * Полученный запрос проверяем по requestId на наличие в массиве отправленных запросов. Если запрос присутствует,
     * то выполняем сохраненный ранее Promise, сообщая ответ по цепочке вверх к компоненту инициатору запроса
     * @param event
     * @param WS
     */
    response (event:any, WS:any = this) {
        console.log('SocketService: new websocket message event', event);
        let response:IWSResponse = JSON.parse(<string>event['data']);
        
        if (this.requests[response.requestId]) {
            let callback:any = this.requests[response.requestId];
            if (response['errorMessage']) {
                callback.reject(response.errorMessage);
            } else {
            	callback.resolve(response.data);
            }
            delete this.requests[response.requestId];
            this.loader.hide();
        } else {
            if (response.hasOwnProperty('errorMessage') && response.errorMessage === 'badToken') {
                this.close('badToken');
                this.$state.go('signin');
            }
        }
    }

    /**
     * Переоткрываем сессию после события закрытия
     * @param event
     */
    reopen(event:any){
        console.log('SocketService: reopen ', event, event.type);

        if(event.type === 'error'){
            setTimeout(()=> this.open(), this.reopenTimeout++ * 1000);
        } else if (event.type === 'close') { // or !signout
            setTimeout(()=> this.open(), this.reopenTimeout++ * 1000);
        }
    }

    /**
     * Закрываем websocket сессию
     */
    close (reason = 'signout') {
        if (reason === 'badToken') {
            this.message.toastInfo(reason);
        }
        if(this.socket){
            this.socket.close(3000,reason);
        }
    }

    /**
     * Отправляем запрос по websocket
     * Тело запроса формируется во вспомогательных сервисах (UserService, GroupService и т.д.), перед отправкой
     * получаем номер запроса и откладываем его в массив запросов
     * @param request
     * @returns {Promise<T>}
     */
    send(request:IWSRequest):Promise<any> {

        return this.open()
            .then(() => {
                request.requestId = this.requestId++;
                this.socket.send(JSON.stringify(request));
                let deferred = this.$q.defer();
                this.requests[request.requestId] = deferred;
                console.log('SocketService.send=', JSON.stringify(request), this.requests, deferred);
                this.loader.show();

                setTimeout(() => {
                    if(this.requests[request.requestId]) {
                        this.requests[request.requestId].reject('internetConnectionLost');
                        delete this.requests[request.requestId];
                        this.loader.hide();
                    }
                }, (this.responseLimit[request.requestType] || this.responseTimeout) * 1000);

                return deferred.promise;
            });
    }
}