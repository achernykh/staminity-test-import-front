import * as _connection from "../env.js";
import { StateService } from "@uirouter/angularjs";
import { SessionService, IConnectionSettings, Deferred } from "../index";
import { Observable, Subject, Subscription } from "rxjs/Rx";
import LoaderService from "../../share/loader/loader.service";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { IWSResponse, IWSRequest } from "../../../../api";
import MessageService from "../message.service";

export class SocketService {

    // public
    connections: Subject<boolean> = new Subject(); // наблюдаемая переменная которая следит за открытием/закрытием соединения с сокетом
    messages: Subject<any> = new Subject(); // наблюдаемая переменная в которую транслируются все данные из сокета
    backgroundState: boolean = false; // отслеживание состояния приложения
    internetState: boolean = navigator.onLine; // отслеживание состояния сети интернет
    socketStarted: boolean = null; // состояние соединения с сервером

    // private
    private ws: WebSocketSubject<Object>; // наблюдаемая переменная WebSocketSubject
    private socket: Subscription; // переменная для подписки на ws
    private initRequest: Deferred<boolean>;// new Deferred<boolean>()
    private requests: Array<Deferred<any>> = []; // буфер запросов к серверу
    private requestId: number = 1;
    private lastMessageTimestamp: number = null; // время получения последнего сообщения от сервера, в том числе hb
    private pendingIntervalLink: any; //

    static $inject = ['ConnectionSettingsConfig', 'SessionService', 'LoaderService', '$state', 'message'];

    constructor (private settings: IConnectionSettings,
                 public session: SessionService,
                 private loader: LoaderService,
                 private $state: StateService,
                 public messageService: MessageService) {

        this.connections.subscribe(status => this.socketStarted = status);
    }

    /**
     * Инициализации веб-сокет сессии
     * Выполняется при конфигурации root component app
     * @returns {Promise<boolean>}
     */
    init (): Promise<boolean> {
        if ( this.socketStarted ) { return Promise.resolve(true);}
        if (!this.initRequest) {
            this.initRequest = new Deferred<boolean>();
            setTimeout(() => {
                //console.info(`socket service: init end by timeout, status=${this.socketStarted}`);
                // Если сессия открыта и это был первый запрос по сессии, то
                // возращаем resolve по первому запросу
                if ( this.socketStarted && this.initRequest ) {
                    this.initRequest.resolve(true);
                } else if ( this.initRequest ) { // если сессия не открыта за время таймаута, то возращаем reject
                    this.initRequest.reject(false);
                }
            }, this.settings.delayOnOpen);
        }
        this.open(); // попытка открытия сессии
        return this.initRequest.promise;
    }
    /**
     * Открытие сессии
     * @param token
     */
    open (token: string = this.session.getToken()): void {
        if ( this.socket && !this.socket.closed ) { return; } // already open
        try {
            this.ws = Observable.webSocket(_connection.protocol.ws + _connection.server + '/' + token);
            this.socket = this.ws.subscribe({
                next: (message: IWSResponse) => {
                    // Если сессия находится в статусе закрыта, то при первом удачном получение сообщения
                    // переводим статус сессии в открыта
                    if ( !this.socketStarted ) {
                        console.debug('socket service: connection open');
                        this.connections.next(true);
                    }
                    if (this.initRequest) {
                        this.initRequest.resolve(true);
                    }
                    this.messages.next(message); // передаем сообщение в публичный поток
                    this.response(message); // обрабатываем полученное сообщение
                    this.check(); // check connection with server by heartBeat & any messages
                },
                error: () => this.close(),
                complete: () => this.close()
            });
        } catch ( e ) {
            if ( this.socketStarted ) {
                this.connections.next(false);
            }
            if (this.initRequest) {
                this.initRequest.reject(false);
            }
        }
    }

    /**
     * Проверка сессии
     */
    private check () {
        this.lastMessageTimestamp = Date.now();
        // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
        setTimeout(() => {
            let now = Date.now();
            if ( this.lastMessageTimestamp && (now - this.lastMessageTimestamp) >= this.settings.delayOnHeartBeat ) {
                this.reopen();
            }
        }, this.settings.delayOnHeartBeat);
    }

    /**
     * Переотркытие сессии
     */
    public reopen (): void {
        this.connections.next(false);
        if (this.socket) { this.socket.unsubscribe(); }
        this.init().then(() => {}, () => this.pendingSession());
    }

    /**
     * Режим восстановления сессии
     */
    private pendingSession (): void {
        this.pendingIntervalLink = setInterval(() => {
            this.init().then(() => clearTimeout(this.pendingIntervalLink), () => console.info('reopen session failed'));
        }, this.settings.delayOnReopen);
    }

    /**
     * Обработка входящего сообщения из сессии
     * @param message
     */
    public response (message: IWSResponse) {
        if ( message.hasOwnProperty('requestId') && this.requests[message.requestId] ) {
            let request: Deferred<any> = this.requests[message.requestId];
            this.loader.hide();
            if ( !message.hasOwnProperty('errorMessage') ) {
                request.resolve(message.data);
            } else {
                request.reject(message.errorMessage);
            }
            delete this.requests[message.requestId];
        } else if ( message.hasOwnProperty('errorMessage') && message.errorMessage === 'badToken' ) {
            this.close();
            this.messageService.toastInfo(message.errorMessage);
            this.$state.go('signin'); // need check for mobile app
        }
    }

    /**
     * Закрытие сессии
     */
    close () {
        console.debug('socket service: close');
        this.connections.next(false);
        if (this.ws) { this.ws.complete(); }
        this.initRequest = null;
        this.lastMessageTimestamp = null;
        if (this.pendingIntervalLink) {
            console.debug('socket service: stop pending');
            clearTimeout(this.pendingIntervalLink);
        }
    }

    /**
     * Отправка сообщения
     * @param request
     * @returns {any}
     */
    public send (request: IWSRequest): Promise<any> {
        console.info(`socket service: send request ${request.requestType}`);
        /**
         * Можно будет раскоментировать после перехода на Angular 4
         */
        if ( !this.socketStarted ) { // если соединение не установлено
            //return Promise.reject('internetConnectionLost');
        }
        // если пользователь не авторизован
        if ( !this.session.getToken() ) { return Promise.reject('userNotAuthorized');}
        if ( this.backgroundState ) { return Promise.reject('applicationInBackgroundMode');}

        request.requestId = this.requestId++;
        this.requests[request.requestId] = new Deferred<boolean>();
        /**
         * После перехода на Angular 4 можно будет перенести инициализацию веб-сокета в конфигурацию модуля, а сейчас
         * функция init() вернет сразу success, если сессия доступна, или асинхронно запустит ее создание и полученный
         * результат вернет resolve | reject
         */
        return this.init().then(
            () => {
                this.ws.next(JSON.stringify(request));
                this.loader.show();
                // если в отведенный лимит не будет получен ответ, то инициатор получит reject
                setTimeout(() => {
                    if ( this.requests[request.requestId] ) {
                        this.requests[request.requestId].reject('timeoutExceeded'); //TODO что делаем с этим?
                        delete this.requests[request.requestId];
                        this.loader.hide();
                    }
                }, this.settings.delayExceptions[request.requestType] || this.settings.delayOnResponse);
                return this.requests[request.requestId].promise;
            },
            () => {
                throw new Error('internetConnectionLost');
            }
        );
    }
}