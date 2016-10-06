import StorageSettings from './storage.constants';

/**
 * StorageService предназчен для ускорения работы пользователя с данными, за счет формирования и обработки кэша данных.
 * Все данные по обьектам сервиса, котороые будут приходит от сервера будут кэшироваться под уникальным номером и с
 * указанием версией обьекта. При загрузке данных в Представление, браузер сначала получит данные из кэша, а затем
 * отправит запрос на сервер о проверке актуальности данных и в случае расхождений обработает новые данные
 * В качестве библиотеки для работы с хранилищем в браузере используется localForage, а если пользователь не пожелал
 * сохранять свои данные то через $window.sessionStorage
 *
 * Обьекты в кэше храняться в формате key/value. Через настройки StorageSettings определяется механизм формирования
 * ключа для каждого обьекта, а также формат хранения значения.
 *
 * Варианты хранения ключа:
 * 1) равен значению type обьекта. Например,
 *      key     = authKey
 *      value   = {
 *          userId: 1,
 *          token: 182839999102
 *      }
 * 2) составной ключ, который содержит type обьекта, а также перечень его идентификаторов, например
 *      key     = userProfile#1
 *      value   = {
 *          userId: 1,
 *          revision: 1,
 *          public: {
 *                  ...
 *      }
 *
 * Вариант хранения значения:
 * 1) одиночный, где значение равно value обьекта (пример описан выше)
 * 2) составной обьекта, где на первом уровне
 * значение равно id, а значение этого параметра равно value обьекта. Например,
 *      key   = userProfile,
 *      value = {
 *          1: {
 *              userId: 1,
 *              revision: 1,
 *              public: {
 *                  ...
 *              }
 *          },
 *          2: {
 *              userId: 2,
 *              revision: 1,
 *              public: {
 *                  ...
 *              }
 *          }
 *      }
 */
export default class StorageService {
    constructor($q, $log, $window, $timeout, $rootScope){
        'ngInject';
        this._$q = $q;
        this._$log = $log;
        this._$timeout = $timeout;
        this._$rootScope = $rootScope;
        this._$window = $window;
        this.incognitoSession = false;
        this.settings = StorageSettings;

        // Конфигурация доступа к локальному хранилищу данных
        this.storage = localforage.createInstance({
            driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
            size : 4980736, // Size of database, in bytes. WebSQL-only for now.
            storeName : 'general', // Should be alphanumeric, with underscores.
            name: 'StaminityAppCache'
        });
        //this._$log.debug('StorageService: run in incognito session', !!this._$window.sessionStorage.getItem('authToken'));
        this.incognitoSession = !!this._$window.sessionStorage.getItem('authToken');
        if(this.incognitoSession)
            this._$log.debug('StorageService: run in incognito session',!!this._$window.sessionStorage.getItem('authToken'));

    }
    /**
     *
     * @param type
     * @param dataKey
     * @returns {Promise}
     */
    get(type, dataKey){
        let objKey = type;

        return new Promise((resolve, reject) => {

            this._$log.debug('StorageService: new get task =', objKey, dataKey);
            if (this.incognitoSession)
            {
                if (objKey == 'authToken' || objKey == 'userProfile')
                {
                    // Если формат single (хранение в формате ключ=type#id...
                    if(this.settings[type].format == 'single'){
                        if(!angular.isArray(dataKey))
                            dataKey = [dataKey];
                        if (this.settings[objKey].key)
                            this.settings[objKey].key.forEach( (index, i) => objKey = objKey + '#' + dataKey[i]);
                    }
                    resolve(JSON.parse(this._$window.sessionStorage.getItem(objKey)) || null);
                } else
                    resolve(null);
            }
            else {
                // Если формат single (хранение в формате ключ=type#id...
                if(this.settings[type].format === 'single' && !!this.settings[type].key){
                    if(!angular.isArray(dataKey))
                        dataKey = [dataKey];
                    this.settings[objKey].key.forEach( (index, i) => objKey = objKey + '#' + dataKey[i]);
                }
                this._$log.debug('StorageService: get=', objKey, dataKey);

                this.storage.getItem(objKey).then((data) => {
                    this._$log.debug('StorageService: get, data=', type, data);
                    if (this.settings[type].format == 'multi' && !!data && !!dataKey)
                        resolve(data[dataKey]);
                    else
                        resolve(data);
                }).catch((error) => {
                    this._$log.error('StorageService: get, error=', error);
                    reject(error);
                });
            }

        });


        // Опредляем местоположение: true - IndexDB, false - sessionStorage
        /*this.getLocation()
            .then((response) => {
                this._$log.debug('StorageService: get, response=', response);
                return response
            })
            .then((local)=>{
                this._$log.debug('StorageService: get, location=', type, local);
                // Если формат single (хранение в формате ключ=type#id...
                if(this.settings[type].format === 'single'){
                    if(!angular.isArray(dataKey))
                        dataKey = [dataKey];
                    if (this.settings[objKey].key)
                        this.settings[objKey].key.forEach( (index, i) => objKey = objKey + '#' + dataKey[i]);
                }
                // Поиск в IndexDB
                if(local){
                    this.storage.getItem(objKey).then((data) => {
                        this._$log.debug('StorageService: get, data=', type, data);
                        result.resolve(data);
                    }).catch((error) =>
                        result.reject(error));
                // Поиск sessionStorage
                } else {
                    if (type == 'authKey'){
                        this._$log.debug('StorageService: get authKey', type, local);
                        result.resolve(this._$window.sessionStorage.getItem(objKey) || null)
                    } else
                        result.resolve(null)
                }
            });*/

        //this._$log.debug('StorageService: new task ', type, dataKey, ' settings=', this.settings[type], ' key=', objKey);
        //this._$log.debug('StorageService: search result=', !this.storage.getItem(objKey));
        /*if(!this.storage.getItem(objKey) && !this._$window.sessionStorage.getItem(objKey))
            result.reject('EMPTY');
        else {
            objData = this._$window.sessionStorage.getItem(objKey) || this.storage.getItem(objKey);
            try{
                if(!angular.isUndefined(objData)){
                    objData = JSON.parse(objData);
                    if(angular.isObject(objData) || angular.isArray(objData)){
                        //this._$log.debug('StorageService: data get=', objData, type, dataKey, objData[dataKey]);
                        if (this.settings[type].format === 'multi'){
                            // Если не передан ключ для обьекта, то возвращаем весь обьект. Если передан, то только его
                            // значение
                            if(!angular.isUndefined(dataKey))
                                objData = objData[dataKey];
                            if (!objData)
                                result.reject('EMPTY DATA BY ID');
                        }
                        result.resolve(objData);
                    }
                    else
                        result.reject('StorageService: unknown data ='+objData+', type,id request =', objKey, dataKey);
                }
            } catch(err){
                result.reject(err);
            }
        }*/
        //return result.promise;
    }

    /**
     * В настройках для StorageService можно указать каким образом сохранять полученные обьекты в локальном хранилище.
     * В начале определяется формат хранения: single - обьект храниться по ключем type и каждый раз обновляется новым
     * значение, multi - обьект храниться с ключем  type, данные хранться массивом с слюем обьекта равным значению
     * ключевого атриббута заданого в настройках в поле key. При этом key для format == single - это формат состовного
     * ключа, который будет составлен как type#+key[0]+key[n], а для format == multi - это значение атрибута, из
     * котрого необходимо взять значение для сохранения обьекта в массиве (например, для userProfile поле userId)
     * @param data - Массив полученный сообщений, которые получены от серера. Каждое сообщение это обьект с параметром
     * type и value, где храняться значения
     * @returns {*}
     */
    upload(data){
        var objKey, dataKey, value, storageValue;
        let task = [];
        return new Promise((resolve, reject) => {
        //return Promise.all()
            data.forEach( message => {
                objKey = message.type;
                this._$log.debug('StorageService: new upload task =', objKey, message.value, this.incognitoSession);
                if (this.incognitoSession)
                {
                    this._$log.debug('StorageService: incognito session, use sessionStorage for authKey & userProfile');
                    if (objKey == 'authToken' || objKey == 'userProfile')
                    {
                        // Формат хранения single
                        if(this.settings[message.type].format == 'single')
                            if (this.settings[objKey].key)
                                this.settings[objKey].key.forEach((index) => {objKey = objKey + '#' + message.value[index]});
                        this._$window.sessionStorage.setItem(objKey, JSON.stringify(message.value));
                    }
                } else {
                    // Формат хранения single
                    if(this.settings[message.type].format == 'single')
                        if (this.settings[objKey].key)
                            this.settings[objKey].key.forEach((index) => {message.type = message.type + '#' + message.value[index]});

                    task.push(
                        this.storage.getItem(message.type).then((data) => {
                            // Если уже есть данные в обьекте
                            if (!!data && this.settings[message.type].format == 'multi') {
                                dataKey = message.value[this.settings[message.type].key];
                                message.value = angular.merge({}, data, {[dataKey]: message.value});
                            }
                            this._$log.debug('StorageService: upload task=', objKey, message.type, message.value);
                            return this.storage.setItem(message.type, message.value);
                            //this.storage.setItem(objKey, message.value).then(() => {
                            //this._$log.debug('StorageService: upload result =', objKey, message.value);
                            //resolve(true);
                        }))//.catch((err) => reject(err));
                }
            });

            this._$log.debug('StorageService: form task done=', task);
            Promise.all(task).then(
                (success) => {
                    this._$log.debug('StorageService: all task done success');
                    resolve(success)
                },
                (error) => {reject(error)}
            );
        })



        //    });
        //resolve(true);

        //});


        /*try {
            // TODO возможно тут необходимо реализовать механизм кэширования
            data.forEach( message => {
                this._$log.debug('StorageService: new task for upload=', message.type, message.value);
                objKey = this.formDataKey(type, dataKey);
                objKey = message.type;
                // Формат хранения single
                if(this.settings[message.type].format == 'single'){
                    if (this.settings[objKey].key)
                        this.settings[objKey].key.forEach( index => {
                            objKey = objKey + '#' + message.value[index];
                        });
                    //result.notify('upload'+message.type+' '+message.value);
                }
                // Формат хранения multi
                else {
                    dataKey = message.value[this.settings[message.type].key];
                    // Если в хранилище есть данные по данному типу
                    if (this._$window.sessionStorage.getItem(message.type) && this.storage.getItem(message.type)){
                        storageValue = JSON.parse(this._$window.sessionStorage[message.type] ||
                            this.storage[message.type]);

                        message.value = angular.merge({}, storageValue, {[dataKey]: message.value});

                    } else
                        message.value = {[dataKey]: message.value}
                }
                if(this.local)
                    this.storage.setItem(objKey, JSON.stringify(message.value));
                else
                    this._$window.sessionStorage.setItem(objKey, JSON.stringify(message.value));

            });
            result.resolve(true);
        } catch (error) {
            result.reject(error);
        }
        return result.promise;*/
    }

    /**
     * Устанавливаем место хранение для браузера
     * @param local, true = localService, false = sessionService. использовать $window[location] не получилось
     */
    setIncognitoSession(setup){
        this._$log.debug('StorageService: setIncognitoSession', setup);
        this.incognitoSession = !setup;
    }

    /**
     *
     * @param type
     * @param dataKey
     */
    clear(type, dataKey){
        let objKey = type;
        // Если формат single (хранение в формате ключ=type#id...
        //this._$log.debug('StorageService: new task for clear=', objKey);

        if(this.settings[objKey].format === 'single'){
            if(!angular.isArray(dataKey))
                dataKey = [dataKey];
            if (this.settings[objKey].key)
                this.settings[objKey].key.forEach( (index, i) => objKey = objKey + '#' + dataKey[i]);
        }

        if (this.local)
            this.storage.removeItem(objKey);
        else
            this._$window.sessionStorage.removeItem(objKey);
    }
}