import {_connection} from './api.constants';
import {ISessionService} from './session.service';
//import {IWebSocket} from "angular-websocket";

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
    open(token:string):Promise<number>;
    response(event:any);
    close();
    send(request:IWSRequest):Promise<any>;
}

/**
 * Класс для работы с websoсket сессией
 */
export class SocketService implements ISocketService {
    //static $inject = ["$websocket","StorageService","SessionService"];
    ws:any;
    socket: WebSocket;
    requests:Array<any> = [];
    requestId:number = 1;

    //_$q:any;
    //_$websocket:any;

    //_StorageService:any;
    //_SessionService:ISessionService;

    static $inject = ['$q','SessionService'];

    constructor(
        private $q: any,
        //private $websocket: any,
        private SessionService:ISessionService) {
        //this._$q = $q;
        //this._$websocket = $websocket;
        //this._StorageService = StorageService;
        //this._SessionService = SessionService;
    }

    /**
     * Открыть сессиию пользователя
     * @returns {Promise<T>}
     * @param token
     */
    open(token:string = this.SessionService.getToken(), delay:number = 100):Promise<number> {
        return new Promise((resolve, reject) => {
            if (!this.socket) {
                this.socket = new WebSocket('ws://' + _connection.server + '/' + token);

                this.socket.onopen = () => {
                    this.socket.onmessage = this.response.bind(this);
                };
            }

            let onOpen = () => {
                console.log('wsOpen', this.socket.readyState);
                if (this.socket.readyState === 2) {
                    reject(this.socket.readyState);
                } else if (this.socket.readyState === 1) {
                    resolve(this.socket.readyState);
                }
            };

            this.socket.readyState? onOpen() : this.socket.onopen = onOpen;
        });
        /*return new Promise((resolve, reject) => {
            if (!this.ws) {
                this.ws = this.$websocket('ws://' + _connection.server + '/' + token)
                this.ws.onOpen(() => {
                    this.ws.onMessage(this.response.bind(this))
                })
            } 
            
            let onOpen = () => { 
                console.log('wsOpen', this.ws.readyState)
                if (this.ws.readyState == 2) {
                    reject(this.ws.readyState)
                } else if (this.ws.readyState == 1) {
                    resolve(this.ws.readyState) 
                }
            }
            
            this.ws.readyState? onOpen() : this.ws.onOpen(onOpen)
        })*/
    }

    /**
     * Получаем запрос по websocket
     * Полученный запрос проверяем по requestId на наличие в массиве отправленных запросов. Если запрос присутствует,
     * то выполняем сохраненный ранее Promise, сообщая ответ по цепочке вверх к компоненту инициатору запроса
     * @param event
     * @param WS
     */
    response(event:any, WS:any = this) {
        console.log('ApiService: new websocket message event', event);
        let response:IWSResponse = JSON.parse(<string>event['data']);
        
        if (this.requests[response.requestId]) {
            let callback:any = this.requests[response.requestId];
            
            if (response['errorMessage']) {
                callback.reject(response.errorMessage);
            } else {
            	callback.resolve(response.data);
            }
            
            delete this.requests[response.requestId];
        }
    }

    /**
     * Закрываем websocket сессию
     */
    close() {
        this.socket.close();
        //this.ws.close(true);
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
                console.log('WS Service: wsRequest', request, this.requests, deferred);
                return deferred.promise;
            });
        /*return this.open()
            .then(() => {
                request.requestId = this.requestId++;
                this.ws.send(JSON.stringify(request));
                let deferred = this.$q.defer();
                this.requests[request.requestId] = deferred;
                console.log('WS Service: wsRequest', request, this.requests, deferred);
                return deferred.promise;
            })*/
    }
}