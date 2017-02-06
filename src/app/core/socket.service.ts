import { _connection } from './api.constants';
import { ISessionService } from './session.service';

import { Observable, Subject } from 'rxjs/Rx';
import LoaderService from "../share/loader/loader.service";

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
    close();
    send(request:IWSRequest): Promise<any>;
    messages: Observable<any>;
    connections: Observable<any>;
}

/**
 * Класс для работы с websoсket сессией
 */
export class SocketService implements ISocketService {
    //static $inject = ["$websocket","StorageService","SessionService"];
    private socket: WebSocket;
    private requests: Array<any> = [];
    private requestId: number = 1;

    public connections: Subject<any>;
    public messages: Subject<any>;

    //_$q:any;
    //_$websocket:any;

    //_StorageService:any;
    //_SessionService:ISessionService;

    static $inject = ['$q','SessionService', 'LoaderService'];

    constructor (private $q: any, private SessionService:ISessionService, private loader:LoaderService) {
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
            if (!this.socket || (this.socket.readyState !== 1 && this.socket.readyState !== 0)) {
                console.log('SocketService: opening...');
                this.socket = new WebSocket('ws://' + _connection.server + '/' + token);
                this.socket.addEventListener('message', this.response.bind(this));
                this.connections.next(this.socket);
                Observable.fromEvent(this.socket, 'message')
                    .map((message: any) => JSON.parse(message.data))
                    .subscribe(this.messages);
            }

            let onOpen = () => {
                if (this.socket.readyState === 2) {
                    reject(this.socket.readyState);
                } else if (this.socket.readyState === 1) {
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
        } 
    }

    /**
     * Закрываем websocket сессию
     */
    close () {
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
                console.log('SocketService.send=', JSON.stringify(request), this.requests, deferred);
                this.loader.show();
                return deferred.promise;
            });
    }
}