import { _AppConstants } from '../../config/app.constants.js';

export default class ApiService {
    constructor($q, $log, $http, $websocket, AppMessage, Storage) {
        'ngInject';
        this.token = null,
        this._$q = $q;
        this._$log = $log;
        this._$http = $http;
        this._$websocket = $websocket;
        this._AppMessage = AppMessage;
        this._Storage = Storage;
        this.ws = null;
    }
    /**
     *
     * @param token
     */
    wsOpen(token){
        this.ws = this._$websocket(_AppConstants.api + token);
        this._$log.debug("ApiService: websocket open with token: ", token);

        this.ws.onMessage((event) => {
            this._$log.info('ApiService: new websocket message: ', JSON.parse(event.data));
            //responseComplete(JSON.parse(event.data));
        });
    }

    /**
     *
     */
    wsClose(){
        //this._$log.debug('ApiService: websocket session closed');
        this.ws.close(true);
    }
    /**
     * HTTP запрос POST по api
     * @param url - адрес api
     * @param data - параметры запроса
     * @returns {*} - возвращаем promise
     */
    post(url, data = {}){
        // TODO Добавить трекер работы с сервером (startProgress, stopProgress)
        return this._$http(this.createRequest(url,data)).then(
            (response) => {
                return this.handleResponse(response.data).then(
                    (response) => {
                        this._$log.debug("ApiService: Then storage task for result=", response);
                        return this._Storage.upload(response).then(
                            (success) => {
                                this._$log.debug("ApiService: Storage success", success, response);
                                return response;
                            },
                            (error) => {
                                this._$log.debug("ApiService: Storage error", error);
                                return error
                            },
                            (status) => this._$log.debug("ApiService: Storage update", status)
                        );
                    },
                    (error) => {return error}
                )
            }, (error) => {
                return this.generateErrorMessage(error);
            }
        )
    }
    /**
     *
     * @param url
     * @param data
     * @param token
     * @returns {{url: *, data: {requestType: *, requestData: *, token: *}}}
     */
    createRequest(url, data, token = this._token){
        this._$log.debug('ApiService: createRequest ', url, data)
        return {
            method: 'POST',
            url: url,
            data: {
                requestType: url,
                requestData: data,
                token: token
            }
        }
    }

    /**
     * Разбираем полученный ответ от сервера. Обрабатывае все общие сообщения systemMessage внутри, оставшиесяя
     * сообщения передаем обратно в promise для обработку сервисов, которые запросили данные
     * @param response формат ответа от сервера. Должен содержать внути элемент data типа array, в котором переданы
     * сообщения в едином формате type - тип, value - значение. Полученные данные, кроме общих сообщений передаются
     * в сервис локального хранилища браузера
     * В случае не корретного формата возвращается ошибка
     * @returns {*} возвращаем promise
     */
    handleResponse(response){
        let result = this._$q.defer();
        this._$log.debug("ApiService: received response:", response);
        // Если формат даты не массив, отвечаем ошибкой
        if (angular.isArray(response.data)) {
            response.data.forEach((message) => {
                // Обрабатываем только обшие типы сообщений, остальное без изменений передаем дальше
                switch (message.type) {
                    case "systemMessage":
                    {
                        this._AppMessage.show(message.value);
                        break;
                    }
                }
            });
            response = response.data.filter((item) => {return item.type !== 'systemMessage'});
            // Сохраняем данные в хранилище браузера
            /*this._Storage.upload(response).then(
                (success) => this._$log.debug("ApiService: Storage success"),
                (error) => this._$log.debug("ApiService: Storage error", error),
                (status) => this._$log.debug("ApiService: Storage update", status)
            );*/
            // Возращаем полученные от сервера данные (data) в success
            result.resolve(response);

            /*for (let message in response.data) {
                this._$log.debug("api service => message:", message);
                switch (message.type){
                    case "systemMessage":{
                        this._$log.debug("api service => received systemMessage:", message.data);
                        //systemMessageService.show(message.data[i].value);
                        //$rootScope.$broadcast('showSystemMessage',message.data[i].value);
                        break;
                    }
                    // Профайл пользовталя
                    case "userProfile":{
                        if ('token' in message) {
                            let session = {};
                            let subscriptions = message.data[i].value.subscriptions;

                            session.role = [];
                            session.userId = message.data[i].value.userId;
                            session.token = message.token;
                            session.reason = 'new';

                            // Заполняем массив ролей на основании имеющихся у пользователя подписок
                            for (let j=0; j < subscriptions.length; j++){
                                session.role.push(subscriptions[j].code);
                            }

                            this._$log.debug("api service => received token:", session);
                            //$rootScope.$broadcast('openSession', session);
                        }
                        this._$log.debug("api service => received userProfile:", message.data[i]);
                        //$rootScope.$broadcast('setUserProfile', message.data[i].value);

                        break;
                    }
                }
            }*/

        } else {
            result.reject(this.generateErrorMessage());
        }
        return result.promise;
    }
    generateErrorMessage(error){
        return {
                    status: 'error',
                    title: 'Unknow error',
                    text: 'Text, text....'
                };
    }

}