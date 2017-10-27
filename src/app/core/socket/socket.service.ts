import * as _connection from '../env.js';
import { SessionService, IConnectionSettings, Deferred } from '../index';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import LoaderService from "../../share/loader/loader.service";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";
import { IWSResponse, IWSRequest } from '../../../../api';

export class SocketService {

    // public
    connections: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null); // наблюдаемая переменная которая следит за открытием/закрытием соединения с сокетом
    messages: Subject<any> = new Subject(); // наблюдаемая переменная в которую транслируются все данные из сокета

    // private
    private ws: WebSocketSubject<Object>; // наблюдаемая переменная WebSocketSubject
    private socket: Subscription; // переменная для подписки на ws
    private socketStarted: boolean = null;
    private requests: Array<Deferred<any>> = []; // буфер запросов к серверу
    private requestId: number = 1;
    private lastMessageTimestamp: number = null; // время получения последнего сообщения от сервера, в том числе hb

    static $inject = [ 'ConnectionSettingsConfig', 'SessionService', 'LoaderService' ];

    constructor (private settings: IConnectionSettings,
                 private session: SessionService,
                 private loader: LoaderService) {

        this.connections.subscribe((status: boolean) => this.socketStarted = status);
    }

    /**
     * Инициализации веб-сокет сессии
     * Выполняется при конфигурации root component app
     * @returns {Promise<boolean>}
     */
    init (): Promise<any> {

        console.log('socket: init');

        this.open();

        return new Promise<any>((resolve, reject) => {

            setTimeout(() => {

                if (this.socketStarted) {
                    // Свзяь с сервером есть
                    this.connections.next(true);
                    console.log('socket: resolve true');
                    return resolve(this.ws);
                } else {
                    // Свзязи с сервером нет
                    this.connections.next(false);
                    console.log('socket: reject false');
                    return reject(this.ws);
                }

            }, this.settings.delayOnOpen);

        });
    }

    /**
     * Открытие сессии
     * @param token
     */
    open (token: string = this.session.getToken()): void {

        console.log('socket: open');
        this.ws = Observable.webSocket(_connection.protocol.ws + _connection.server + '/' + token);
        this.socket = this.ws.subscribe({
            next: (message: IWSResponse) => {
                this.messages.next(message);
                this.response(message);
                this.check();
            },
            error: () => {
                this.socket.unsubscribe();
                this.connections.next(false);
            },
            complete: () => {

            }
        });

    }

    /**
     * Проверка сессии
     */
    private check () {
        this.lastMessageTimestamp = Date.now();
        // Через таймаут проверяем пришел ли hb/сообщение, если нет, то считаем сессию потерянной и пробуем переоткрыть
        setTimeout(() => {
            let now = Date.now();
            if (this.lastMessageTimestamp && (now - this.lastMessageTimestamp) >= this.settings.delayOnHeartBeat) {
                this.connections.next(false);
                this.socket.unsubscribe();
                this.pendingSession();
                //this.close({reason: 'lostHeartBit'}); // TODO reopen?
            }
        }, this.settings.delayOnHeartBeat);
    }

    /**
     * Режим восстановления сессии
     */
    private pendingSession (): void {

        let interval = setInterval(() => {

            this.init().then(() => clearTimeout(interval), () => console.info('reopen session failed'));

        }, this.settings.delayOnReopen);

    }

    /**
     * Обработка входящего сообщения из сессии
     * @param message
     */
    public response (message: IWSResponse) {

        if (message.hasOwnProperty('requestId') && this.requests[ message.requestId ]) {

            let request: Deferred<any> = this.requests[ message.requestId ];

            if (!message.hasOwnProperty('errorMessage')) {
                request.resolve(message.data);
            } else {
                request.reject(message.errorMessage);
            }

            delete this.requests[ message.requestId ];

        } else if (message.hasOwnProperty('errorMessage') && message.errorMessage === 'badToken') {

            this.close({ reason: message.errorMessage });

        }
    }

    /**
     * Закрытие сессии
     * @param ev
     */
    close (ev: any) {

    }

    /**
     * Отправка сообщения
     * @param request
     * @returns {any}
     */
    public send (request: IWSRequest): Promise<any> {

        if (!this.socketStarted) { // если соединение не установлено
            return Promise.reject('internetConnectionLost');
        }

        if (!this.session.getToken()) { // если пользователь не авторизован
            return Promise.reject('userNotAuthorized');
        }

        request.requestId = this.requestId++;
        this.requests[ request.requestId ] = new Deferred<boolean>();

        this.ws.next(JSON.stringify(request));
        this.loader.show();

        setTimeout(() => {

            if (this.requests[ request.requestId ]) {
                this.requests[ request.requestId ].reject('timeoutExceeded'); //TODO что делаем с этим?
                delete this.requests[ request.requestId ];
                this.loader.hide();
            }

        }, this.settings.delayExceptions[ request.requestType ] || this.settings.delayOnResponse);

        return this.requests[ request.requestId ].promise;
    }
}