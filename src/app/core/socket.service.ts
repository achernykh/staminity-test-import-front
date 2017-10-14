import * as _connection from './env.js';
import { StateService } from '@uirouter/angular';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { IMessageService } from "./message.service";
import { IHttpService } from 'angular';
import { Injectable, Inject } from '@angular/core';
import { SessionService } from "./session.service";
import { LoaderService } from "../share/loader/loader.service";
import { SocketStatus, Deferred, IWSRequest, IWSResponse } from "./socket.interface";
import {IConnectionSettings, ConnectionSettings, ConnectionSettingsConfig} from "./socket.config";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";


@Injectable()
export class SocketService {

    // public

    connections: Subject<any> = new Subject();
    messages: Subject<any> = new Subject();
    o: Subject<boolean> = new Subject(); // наблюдаемая переменная которая следит за открытием/закрытием соединения с сокетом
    m: Subject<Object> = new Subject(); // наблюдаемая переменная в которую транслируются все данные из сокета

    // private

    private ws: WebSocketSubject<Object>; // наблюдаемая переменная WebSocketSubject
    private s: Subscription; // переменная для подписки на ws
    private socketStarted: boolean = null;

    private socket: WebSocket;
    private requests: Array<any> = [];
    private r: Array<Deferred<any>> = [];
    private requestId: number = 1;
    private internetStatus: boolean = true;
    private connectionStatus: boolean = true;
    private lastMessageTimestamp: number = null; // время получения последнего сообщения от сервера, в том числе hb

    //static $inject = ['$q','SessionService', 'LoaderService','message','$state','$http'];

    constructor (
        @Inject(ConnectionSettingsConfig) private settings: IConnectionSettings,
        private session: SessionService,
        private loader: LoaderService
        //private message: IMessageService,
        //private $state: StateService
        //private $http: IHttpService
    ) {

        this.connections = new Subject();
        this.connections.subscribe(status => this.connectionStatus = !!status);
        this.messages = new Subject();

        this.o.subscribe((status: boolean) => this.socketStarted = status);

    }

    open(token:string = this.session.getToken()): void {

        this.ws = Observable.webSocket(_connection.protocol.ws + _connection.server + '/' + token);
        this.s = this.ws.subscribe({
            next: (message: IWSResponse) => {
                // Свзяь с сервером есть
                this.o.next(true);
                //
                this.lastMessageTimestamp = Date.now();

                // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
                setTimeout(() => {
                    let now = Date.now();
                    if (this.lastMessageTimestamp && (now - this.lastMessageTimestamp) >= this.settings.delayOnHeartBeat) {
                        this.o.next(false);
                        this.close({reason: 'lostHeartBit'}); // TODO reopen?
                    }
                }, this.settings.delayOnHeartBeat);

                this.response(message);
            },
            error: () => {
                this.s.unsubscribe();
                this.o.next(false);
            },
            complete: () => {

            }
        });
        // Свзяь с сервером есть
        this.o.next(true);
    }

    /**
     * Открыть сессиию пользователя
     * @returns {Promise<T>}
     * @param token
     */
    /**open(token:string = this.session.getToken()): Promise<any> {
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
                    }
                    case SocketStatus.Connecting: {
                        setTimeout(() => {
                            if (this.socket.readyState === SocketStatus.Open) {
                                return resolve(this.socket.readyState);
                            } else {
                                return reject(`connection ws error: status ${SocketStatus[this.socket.readyState]}`);
                            }
                        }, this.settings.delayOnOpen);
                    }
                    default: {
                        return reject(`connection ws error: status ${SocketStatus[this.socket.readyState]}`);
                    }
                }
            };

            //onOpen();
            this.socket.readyState ? onOpen() : this.socket.addEventListener('open', onOpen);
        });
    }**/


    response (message: IWSResponse) {

        if(message.hasOwnProperty('requestId') && this.r[message.requestId]) {

            let r: Deferred<any> = this.r[message.requestId];

            if(!message.hasOwnProperty('errorMessage')) {
                r.resolve(message.data);
            } else {
                r.reject(message.errorMessage);
            }

        } else if (message.hasOwnProperty('errorMessage') && message.errorMessage === 'badToken') {

            this.close({reason: message.errorMessage});

        }
    }

    /**
     * Получаем запрос по websocket
     * Полученный запрос проверяем по requestId на наличие в массиве отправленных запросов. Если запрос присутствует,
     * то выполняем сохраненный ранее Promise, сообщая ответ по цепочке вверх к компоненту инициатору запроса
     * @param event
     * @param WS
     */
    /**response (event: MessageEvent) {
        let response: IWSResponse = JSON.parse(<string>event['data']);

        // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
        setTimeout(() => {
            let now = Date.now();
            if (this.lastHeartBitTimestamp && (now - this.lastHeartBitTimestamp) >= this.settings.delayOnHeartBeat) {
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
    }**/

    /**
     * Переоткрываем сессию после события закрытия
     * @param event
     */
    /**reopen(event:any){
        console.log('SocketService: reopen ', event, this.internetStatus);
        if(event.type === 'error'){
            setTimeout(()=> this.SessionService.getToken() && this.internetStatus && this.open().then(() => this.connections.next(true),
                () => this.connections.next(false)),
                this.reopenTimeout++ * 1000);
        } else if (event.type === 'lostHeartBit') { // or !signout
            setTimeout(()=> this.SessionService.getToken() && this.internetStatus &&
                this.open().then(() => this.connections.next(true),() => this.connections.next(false)),
                this.reopenTimeout++ * 1000);
        }
    }**/

    close(ev: any) {

    }
    /**
     * Закрываем websocket сессию
     */
    /**close (ev: CloseEvent | any) {
        console.log('SocketService: close ', new Date().toTimeString(), this.socket);
        if (typeof ev === 'CloseEvent') {
            return;
        }

        try {
            //debugger;
            this.socket.removeEventListener('message', this.response.bind(this));
            this.socket.removeEventListener('close', this.close.bind(this));
            this.socket.removeEventListener('error', this.reopen.bind(this));
            this.socket.close(3000, ev.reason);
        } catch (e) {
            console.log('socket already closed');
        }
        //this.lastHeartBit = null;

        switch (ev.reason) {
            case 'badToken': {
                this.requests = [];
                this.message.toastInfo(ev.reason);
                this.loader.hide();
                this.$state.go('signin');
                break;
            }
            case 'lostHeartBit': {
                this.reopen({type: 'lostHeartBit'});
                break;
            }
        }
    }**/

    // send
    send(r: IWSRequest): Promise<IWSResponse> {

        debugger;

        if (!this.socketStarted) { // если соединение не установлено
            //throw new Error('internetConnectionLost');
            return Promise.reject('internetConnectionLost');
        }

        if(!this.session.getToken()) { // если пользователь не авторизован
            return Promise.reject('userNotAuthorized');
        }

        r.requestId = this.requestId ++;
        this.r[r.requestId] = new Deferred<boolean>();

        this.ws.next(JSON.stringify(r));
        this.loader.show();

        setTimeout(() => {

            this.requests[r.requestId].reject('timeoutExceeded'); //TODO что делаем с этим?
            delete this.requests[r.requestId];
            this.loader.hide();

        }, this.settings.delayExceptions[r.requestType] || this.settings.delayOnResponse);

        return this.r[r.requestId].promise;

    }

    /**
     * Отправляем запрос по websocket
     * Тело запроса формируется во вспомогательных сервисах (UserService, GroupService и т.д.), перед отправкой
     * получаем номер запроса и откладываем его в массив запросов
     * @param request
     * @returns {Promise<T>}
     */
    /**send(request:IWSRequest): Promise<any> {

        if (!this.connectionStatus){ // если соединение не установлено
            throw new Error('internetConnectionLost');
        }

        if(!this.session.getToken()) { // если пользователь не авторизован
            throw new Error('userNotAuthorized');
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

        }, () => {
            throw new Error('internetConnectionLost');
        });
    }**/

    /**private checkInternetConnection () {
        setInterval(()=>{
            if(this.socket && this.socket.readyState === SocketStatus.Open){
                //this.send(new Ping())
                this.$http.get(`${this.settings.internetResource}?_=${new Date().getTime()}`)
                    .then(() => { // если интернет появился, а соединения не было, то пробуем подключить
                        this.internetStatus = true;
                        if(!this.connectionStatus) {
                            this.open().then(() => this.connections.next(true),
                                () => this.connections.next(false));
                        }
                    }, () => {
                        this.internetStatus = false;
                        this.connections.next(false);
                    }); // подключение отсутствует
            }
        }, this.settings.delayOnInternetConnectionCheck);
    }**/
}