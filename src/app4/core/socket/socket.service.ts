import * as _connection from '../../../app/core/env.js';
import { StateService } from '@uirouter/angular';
import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs/Rx';
import { IMessageService } from "../../../app/core/message.service";
import { IHttpService } from 'angular';
import { Injectable, Inject } from '@angular/core';
import { SessionService } from "../session/session.service";
import { LoaderService } from "../../share/loader/loader.service";
import { SocketStatus, Deferred, IWSRequest, IWSResponse } from "./socket.interface";
import {IConnectionSettings, ConnectionSettings, ConnectionSettingsConfig} from "./socket.config";
import { WebSocketSubject } from "rxjs/observable/dom/WebSocketSubject";


@Injectable()
export class SocketService {

    // public
    connections: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); // наблюдаемая переменная которая следит за открытием/закрытием соединения с сокетом
    messages: Subject<any> = new Subject(); // наблюдаемая переменная в которую транслируются все данные из сокета
   
    // private
    private ws: WebSocketSubject<Object>; // наблюдаемая переменная WebSocketSubject
    private socket: Subscription; // переменная для подписки на ws
    private socketStarted: boolean = null;
    private requests: Array<Deferred<any>> = []; // буфер запросов к серверу
    private requestId: number = 1;
    private lastMessageTimestamp: number = null; // время получения последнего сообщения от сервера, в том числе hb

    constructor (
        @Inject(ConnectionSettingsConfig) private settings: IConnectionSettings,
        private session: SessionService,
        private loader: LoaderService) {

        this.connections.subscribe((status: boolean) => this.socketStarted = status);
    }

    /**
     * Инициализации веб-сокет сессии
     * Выполняется при конфигурации root component app
     * @returns {Promise<boolean>}
     */
    init(): Promise<boolean> {

        this.open();

        return new Promise<boolean>((resolve, reject) => {

            setTimeout(() => {
                if(this.socketStarted) {
                    // Свзяь с сервером есть
                    this.connections.next(true);
                    return resolve(true);
                } else {
                    // Свзязи с сервером нет
                    this.connections.next(false);
                    return reject(false);
                }
            }, this.settings.delayOnOpen);

        });
    }

    private open(token:string = this.session.getToken()): void {

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

    private check() {
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

    private pendingSession(): void {

        console.info('session stop');
        let interval = setInterval(() => {
            this.init().then(() => clearTimeout(interval), () => console.info('reopen session failed'));
        }, this.settings.delayOnReopen);

    }

    public response (message: IWSResponse) {

        if(message.hasOwnProperty('requestId') && this.requests[message.requestId]) {

            let request: Deferred<any> = this.requests[message.requestId];

            if(!message.hasOwnProperty('errorMessage')) {
                request.resolve(message.data);
            } else {
                request.reject(message.errorMessage);
            }

            delete this.requests[message.requestId];

        } else if (message.hasOwnProperty('errorMessage') && message.errorMessage === 'badToken') {

            this.close({reason: message.errorMessage});

        }
    }

    close(ev: any) {

    }

    // send
    public send(r: IWSRequest): Promise<any> {

        if (!this.socketStarted) { // если соединение не установлено
            //throw new Error('internetConnectionLost');
            return Promise.reject('internetConnectionLost');
        }

        if(!this.session.getToken()) { // если пользователь не авторизован
            return Promise.reject('userNotAuthorized');
        }

        r.requestId = this.requestId ++;
        this.requests[r.requestId] = new Deferred<boolean>();

        this.ws.next(JSON.stringify(r));
        this.loader.show();

        setTimeout(() => {

            if(this.requests[r.requestId]) {
                this.requests[r.requestId].reject('timeoutExceeded'); //TODO что делаем с этим?
                delete this.requests[r.requestId];
                this.loader.hide();
            }

        }, this.settings.delayExceptions[r.requestType] || this.settings.delayOnResponse);

        return this.requests[r.requestId].promise;
    }
}