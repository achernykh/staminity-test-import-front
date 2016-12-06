import {_connection} from './api.constants';
import {ISessionService} from '../session/session.service';

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
    open(token:string):number;
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
    requests:Array<any>;
    requestId:number;

    _$q:any;
    _$websocket:any;

    _StorageService:any;
    _SessionService:ISessionService;

    constructor($q:any, $websocket:any, StorageService:any, SessionService:ISessionService) {
        this._$q = $q;
        this._$websocket = $websocket;
        this._StorageService = StorageService;
        this._SessionService = SessionService;
        this.requestId = 1;
        this.requests = [];
    }

    /**
     * Открыть сессиию пользователя
     * @returns {Promise<T>}
     * @param token
     */
    open(token:string = this._SessionService.getToken(), delay:number = 100):number {
        if (this.ws != null && this.ws.readyState == 1)  //CONNECTING =0, OPEN=1, CLOSING=2, CLOSED=3
            return this.ws.readyState;
        // Если соединение не открыто
        try {
            // Попытка установить соедение в течение 100 мс
            this.ws = this._$websocket('ws://' + _connection.server + '/' + token);
            setTimeout(()=> {
                console.log('wsOpen', this.ws.readyState);
                if (this.ws.readyState == 2)
                    return this.ws.readyState;
                // Соединие установлено успешно
                else if (this.ws.readyState == 1) {
                    // Слушаем входящие сообщения
                    this.ws.onMessage((event) => {
                        console.log('ApiService: new websocket message event', event);
                        let response:IWSResponse = JSON.parse(event.data);
                        // Если во входящем сообшение есть признак requestId,
                        // то закрываем запущенное ранее задание
                        if (!!this.requests[response.requestId]) {
                            console.info('ApiService: callback', this.requests[response.requestId]);
                            let callback:any = this.requests[response.requestId];
                            delete this.requests[response.requestId];
                            if(response.hasOwnProperty('errorMessage'))
                                // возвращаем код ошибки в компонент для дальнейшей обработки
	                            callback.reject(response.errorMessage)
	                        else
                            // возвращаем результат ответа
	                        	callback.resolve(response.data)

                            console.log('onMessage resolve=', response);

                        } else {
                            // Обработкчик сообщений без requestId//
                            // TODO Согласовать с Денисом наличие таких сообщений
                        }
                    });
                    return this.ws.readyState;
                }
            }, delay)
        } catch (err) {
            console.error(err);
            return 2;
        }
    }

    /**
     * Получаем запрос по websocket
     * Полученный запрос проверяем по requestId на наличие в массиве отправленных запросов. Если запрос присутствует,
     * то выполняем сохраненный ранее Promise, сообщая ответ по цепочке вверх к компоненту инициатору запроса
     * @param event
     * @param WS
     */
    response(event:any, WS:any = this) {
        console.log('ApiService: new websocket message event', event, WS);
        if (typeof event !== 'undefined') {
            let response:IWSResponse = JSON.parse(event.data);
            // Если во входящем сообшение есть признак requestId,
            // то закрываем запущенное ранее задание
            if (this.requests.indexOf(response.requestId) !== -1) {
                console.info('ApiService: callback', this.requests[response.requestId]);
                let callback:any = this.requests[response.requestId];
                delete this.requests[response.requestId];
                callback.resolve(response.data);
            } else {
                // Обработкчик сообщений без requestId
                // TODO Согласовать с Денисом наличие таких сообщений
            }
        }
    }

    /**
     * Закрываем websocket сессию
     */
    close() {
        this.ws.close(true);
    }

    /**
     * Отправляем запрос по websocket
     * Тело запроса формируется во вспомогательных сервисах (UserService, GroupService и т.д.), перед отправкой
     * получаем номер запроса и откладываем его в массив запросов
     * @param request
     * @returns {Promise<T>}
     */
    send(request:IWSRequest):Promise<any> {
        request.requestId = this.requestId + 1;
        this.ws.send(JSON.stringify(request));
        let deferred = this._$q.defer();
        this.requests[request.requestId] = deferred;
        console.log('WS Service: wsRequest', request, this.requests, deferred);
        return deferred.promise; // ожидаем ответа по заданию в wsResponse

        // Посик в storage
        // Сначала запрашиваем обьект в локальном хранилище, если не найдено значение, то отправляем запрос на сервер
        /*return this._StorageService.get(request)
            .then((result) => {
                console.log('storage data found=', result)
                return Promise.resolve(result);
            }, () => {
                console.log('storage data not found')
                request.requestId = this.requestId + 1;
                this.ws.send(JSON.stringify(request));
                let deferred = this._$q.defer();
                this.requests[request.requestId] = deferred;
                console.log('WS Service: wsRequest', request, this.requests, deferred);
                return deferred.promise; // ожидаем ответа по заданию в wsResponse
            })*/
    }
}