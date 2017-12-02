import { StateService } from "angular-ui-router";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { Observable, Subject, Subscription } from "rxjs/Rx";
import { IWSRequest, IWSResponse } from "../../../../api";
import LoaderService from "../../share/loader/loader.service";
import * as _connection from "../env.js";
import { Deferred, IConnectionSettings, SessionService } from "../index";

export class SocketService {

    // public
    public connections: Subject<boolean> = new Subject(); // наблюдаемая переменная которая следит за открытием/закрытием соединения с сокетом
    public messages: Subject<any> = new Subject(); // наблюдаемая переменная в которую транслируются все данные из сокета

    // private
    private ws: WebSocketSubject<Object>; // наблюдаемая переменная WebSocketSubject
    private socket: Subscription; // переменная для подписки на ws
    private socketStarted: boolean = null;
    private requests: Array<Deferred<any>> = []; // буфер запросов к серверу
    private requestId: number = 1;
    private lastMessageTimestamp: number = null; // время получения последнего сообщения от сервера, в том числе hb

    public static $inject = ["ConnectionSettingsConfig", "SessionService", "LoaderService"];

    constructor(private settings: IConnectionSettings,
                private session: SessionService,
                private loader: LoaderService,
                private $state: StateService) {

        this.connections.subscribe((status: boolean) => this.socketStarted = status);
    }

    /**
     * Инициализации веб-сокет сессии
     * Выполняется при конфигурации root component app
     * @returns {Promise<boolean>}
     */
    public init(): Promise<boolean> {

        console.log("socket: init");

        if ( this.socketStarted ) {
            return Promise.resolve(true);
        }

        this.open();

        return new Promise<boolean>((resolve, reject) => {

            setTimeout(() => {

                if ( this.socketStarted ) {
                    // Свзяь с сервером есть
                    //this.connections.next(true);
                    console.log("socket: resolve true");
                    return resolve(true);
                } else {
                    // Свзязи с сервером нет
                    //this.connections.next(false);
                    console.log("socket: reject false");
                    return reject(false);
                }

            }, this.settings.delayOnOpen);

        });
    }

    /**
     * Открытие сессии
     * @param token
     */
    public open(token: string = this.session.getToken()): void {

        if ( this.socket && !this.socket.closed ) { return; }

        try {
            this.ws = Observable.webSocket(_connection.protocol.ws + _connection.server + "/" + token);
            this.socket = this.ws.subscribe({
                next: (message: IWSResponse) => {
                    if ( !this.socketStarted ) { this.connections.next(true); }
                    this.messages.next(message);
                    this.response(message);
                    this.check();
                },
                error: () => this.close(),
                complete: () => this.close(),
            });
        } catch ( e ) {
            if ( this.socketStarted ) {
                this.connections.next(false);
            }
        }
    }

    /**
     * Проверка сессии
     */
    private check() {
        this.lastMessageTimestamp = Date.now();
        // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
        setTimeout(() => {
            const now = Date.now();
            if ( this.lastMessageTimestamp && (now - this.lastMessageTimestamp) >= this.settings.delayOnHeartBeat ) {
                this.connections.next(false);
                this.socket.unsubscribe();
                this.pendingSession();
            }
        }, this.settings.delayOnHeartBeat);
    }

    /**
     * Режим восстановления сессии
     */
    private pendingSession(): void {

        const interval = setInterval(() => {

            this.init().then(() => clearTimeout(interval), () => console.info("reopen session failed"));

        }, this.settings.delayOnReopen);

    }

    /**
     * Обработка входящего сообщения из сессии
     * @param message
     */
    public response(message: IWSResponse) {

        if ( message.hasOwnProperty("requestId") && this.requests[message.requestId] ) {

            const request: Deferred<any> = this.requests[message.requestId];
            this.loader.hide();

            if ( !message.hasOwnProperty("errorMessage") ) {
                request.resolve(message.data);
            } else {
                request.reject(message.errorMessage);
            }

            delete this.requests[message.requestId];

        } else if ( message.hasOwnProperty("errorMessage") && message.errorMessage === "badToken" ) {

            this.close();
            this.$state.go("signin");

        }
    }

    /**
     * Закрытие сессии
     */
    public close() {
        this.ws.complete();
    }

    /**
     * Отправка сообщения
     * @param request
     * @returns {any}
     */
    public send(request: IWSRequest): Promise<any> {

        /**
         * Можно будет раскоментировать после перехода на Angular 4
         */
        if ( !this.socketStarted ) { // если соединение не установлено
            //return Promise.reject('internetConnectionLost');
        }

        if ( !this.session.getToken() ) { // если пользователь не авторизован
            return Promise.reject("userNotAuthorized");
        }

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
                        this.requests[request.requestId].reject("timeoutExceeded"); //TODO что делаем с этим?
                        delete this.requests[request.requestId];
                        this.loader.hide();
                    }

                }, this.settings.delayExceptions[request.requestType] || this.settings.delayOnResponse);

                return this.requests[request.requestId].promise;
            },
            () => {
                throw new Error("internetConnectionLost");
            },
        );
    }
}
