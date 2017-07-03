import * as _connection from './env.js';
import { ISessionService } from './session.service';
import {StateService} from 'angular-ui-router';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import LoaderService from "../share/loader/loader.service";
import {IMessageService} from "./message.service";
import {IHttpService, noop} from 'angular';


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
    close(ev: CloseEvent | {reason: string});
    send(request:IWSRequest): Promise<any>;
    messages: Subject<any>;
    connections: Subject<any>;
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
    private lastHeartBit: number = null; // timestamp последнего heart bit от сервера
    private readonly heartBitTimeout: number = 30 * 1000; // 30 секунд
    private reopenTimeout: number = 0.5; // в секундах
    private responseTimeout: number = 5.0; // сек
    private readonly responseLimit: {} = { // лимиты ожидания по отдельным запросам (сек)
        getActivityIntervals: 10.0,
        postUserExternalAccount: 60.0,
        putUserExternalAccountSettingSuccess: 10.0,
        getCalendarItem: 30.0,
        calculateActivityRange: 15.0,
        putCalendarItem: 15.0,
        getActivityCategory: 10.0,
        postCalendarItem: 10.0
    };

    private internetStatus: boolean = true;
    private connectionStatus: boolean = true;

    public connections: Subject<any>;
    public messages: Subject<any>;
    public internet: Subject<any>;
    public backend: Subject<any>;

    static $inject = ['$q','SessionService', 'LoaderService','message','$state','$http'];

    constructor (
        private $q: any,
        private SessionService:ISessionService,
        private loader: LoaderService,
        private message: IMessageService,
        private $state: StateService, private $http: IHttpService) {

        this.connections = new Subject();
        this.connections.subscribe(status => this.connectionStatus = !!status);
        this.messages = new Subject();
        this.internet = new Subject();

        setInterval(()=>{
            $http.get(`/favicon.ico?${this.requestId++}`)
                .then(() => { // если интернет появился, а соединения не было, то пробуем подключить
                    this.internetStatus = true;
                    if(!this.connectionStatus) {
                        this.open().then(() => this.connections.next(true), () => this.connections.next(false));
                    }
                }, () => {
                    this.internetStatus = false;
                    this.connections.next(false);
                }); // подключение отсутствует
        }, 5000);
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

                this.socket = new WebSocket(_connection.protocol.ws + _connection.server + '/' + token);

                if (this.socket.readyState !== SocketStatus.Close && this.socket.readyState !== SocketStatus.Closing) {
                    this.socket.addEventListener('message', this.response.bind(this));
                    this.socket.addEventListener('close', this.close.bind(this)); //reopen?
                    this.socket.addEventListener('error', this.reopen.bind(this));

                    Observable.fromEvent(this.socket, 'open')
                        .subscribe(this.connections);

                    Observable.fromEvent(this.socket, 'message')
                        .map((message: any) => JSON.parse(message.data))
                        .subscribe(this.messages);
                } else {
                    console.log('SocketService: error open connection');
                    this.connections.next(false);
                }

            }

            let onOpen = () => {
                switch (this.socket.readyState) {
                    case SocketStatus.Open: {
                        resolve(this.socket.readyState);
                        break;
                    }
                    default: {
                        reject(this.socket.readyState);
                    }
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

        // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
        setTimeout(()=>{
            let timeStamp = Date.now();
            if (this.lastHeartBit && (timeStamp - this.lastHeartBit) >= this.heartBitTimeout) {
                this.connections.next(false);
                this.close({reason: 'lostHeartBit'}); // TODO reopen?
            }
        }, this.heartBitTimeout);
        
        if (this.requests[response.requestId]) {
            let callback:any = this.requests[response.requestId];
            this.lastHeartBit = Date.now();

            if (response['errorMessage']) {
                callback.reject(response.errorMessage);
            } else {
            	callback.resolve(response.data);
            }
            delete this.requests[response.requestId];
            this.loader.hide();
        } else {
            if (response.hasOwnProperty('errorMessage') && response.errorMessage === 'badToken') {
                this.close({reason: response.errorMessage});
            }
            if (response.hasOwnProperty('type') && response['type'] === 'hb') {
                let timeStamp = Date.now();
                if (this.lastHeartBit && (timeStamp - this.lastHeartBit) >= this.heartBitTimeout) {
                    this.connections.next(false);
                    this.close({reason: 'lostHeartBit'}); // TODO reopen?
                } else {
                    this.lastHeartBit = Date.now();
                }
            }
        }
    }

    /**
     * Переоткрываем сессию после события закрытия
     * @param event
     */
    reopen(event:any){
        console.log('SocketService: reopen ', event, this.internetStatus);
        if(event.type === 'error'){
            setTimeout(()=> this.internetStatus && this.open().then(() => this.connections.next(true),
                () => this.connections.next(false)),
                this.reopenTimeout++ * 1000);
        } else if (event.type === 'lostHeartBit') { // or !signout
            setTimeout(()=> this.internetStatus && this.open().then(() => this.connections.next(true),
                () => this.connections.next(false)),
                this.reopenTimeout++ * 1000);
        }
    }

    /**
     * Закрываем websocket сессию
     */
    close (ev: CloseEvent | any) {
        console.log('SocketService: close ', ev, typeof ev);
        if (typeof ev === 'CloseEvent') {
            return;
        }

        this.socket.removeEventListener('message', this.response.bind(this));
        this.socket.removeEventListener('close', this.close.bind(this));
        this.socket.removeEventListener('error', this.reopen.bind(this));
        this.socket.close(3000, ev.reason);
        //this.lastHeartBit = null;

        switch (ev.reason) {
            case 'badToken': {
                this.message.toastInfo(ev.reason);
                this.$state.go('signin');
                break;
            }
            case 'lostHeartBit': {
                this.reopen({type: 'lostHeartBit'});
                break;
            }
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

        /**if (this.lastHeartBit && (Date.now() - this.lastHeartBit) >= this.heartBitTimeout) {
            this.connections.next(false);
            this.close({reason: 'lostHeartBit'});
        }**/

        if (!this.connectionStatus){ // если соединение не установлено
            return Promise.reject('internetConnectionLost');
        }

        return this.open().then(() => {
            request.requestId = this.requestId++;
            //console.log('socket send', request);
            this.socket.send(JSON.stringify(request));
            let deferred = this.$q.defer();
            this.requests[request.requestId] = deferred;
            this.loader.show();

            setTimeout(() => {
                if(this.requests[request.requestId]) {
                    this.requests[request.requestId].reject('timeoutExceeded'); //TODO что делаем с этим?
                    delete this.requests[request.requestId];
                    this.loader.hide();
                }
            }, (this.responseLimit[request.requestType] || this.responseTimeout) * 1000);

            return deferred.promise;

        }, () => Promise.reject('internetConnectionLost'));
    }
}