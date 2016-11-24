import { _AppConstants } from '../../config/app.constants';


function readFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        
        reader.onload = (event) => { resolve(event.target.result); };
        
        reader.readAsBinaryString(file);
    });    
}


export default class UserService {

    constructor ($q, $log, Storage, API) {
        'ngInject'
        this._$q = $q;
        this._$log = $log;
        this._Storage = Storage;
        this._api = API;
        this.currentUser = null;
        this.currentUserRole = [];
        this.apiType = 'userProfile';
    }

    get (key) {
        return this._Storage.get('userProfile', key).then(
            (success) => {
                this._$log.info('UserService: get userProfile', success);
                return success},
            (error) => {
                this._$log.error('UserService: get userProfile', error);
                this._api.send('getUserProfile', key).then(
                    (success) => {return success},
                    (error) => {
                        this._$log.error('UserService: error in get() with key=', key);
                    })
                }
            )
    }

    /**
     * Устанавливаем текущего пользователя
     * @param id - индентивифкатор пользователя (userId)
     * @returns {*} - Возращаем текущего пользователя в формате обьекта userProfile
     */

    setCurrentUser (id) {
        let result = this._$q.defer();

        this.get(id).then(
            (success) => {
                this._$log.debug('UserService: setCurrentUser ', success);
                this.currentUser = success;
                let subscriptions = success.subscriptions;
                // Заполняем массив ролей на основании имеющихся у пользователя подписок
                subscriptions.forEach(subsc => this.currentUserRole.push(subsc.code));
                this._$log.debug('UserService: userSubscriptions=', this.currentUserRole);
                result.resolve(success)
            }, (error) => result.resolve(error));

        return result.promise;
    }

    /**
     *
     */
    logout () {
        this.currentUser = null;
        this.currentUserRole = [];
    }

    getCurrentUser () {
        return this.currentUser;
    }

    getCurrentUserRole () {
        return this.currentUserRole;
    }

    getCurrentUserId () {
        return this.currentUser.userId;
    }

    setUserpic (file) {
      return Promise.all([this._Storage.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/avatar', data, authToken.token))
        .then((response) => {
            if (response.status == 200) {
                return 'http://' + _AppConstants.api + '/content/avatar/' + response.data[0].value.public.avatar;
            } else {
                throw new Error(response);
            }
        });
        /*return this._Storage.get('authToken')
            .then((authToken) => fetch('http://' + _AppConstants.api + "/user/avatar", {
                method: "POST",
                mode: 'no-cors',
                headers: {
                    "Authorization": "Bearer " + authToken.token
                },
                credentials: 'include',
                body: file
            }));*/
    }

    setHeader (file) {
      return Promise.all([this._Storage.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/background', data, authToken.token))
        .then((response) => {
            if (response.status == 200) {
                return 'http://' + _AppConstants.api + '/content/background/' + response.data[0].value.public.background;
            } else {
                throw new Error(response);
            }
        });
        /*return this._Storage.get('authToken')
            .then((authToken) => fetch('http://' + _AppConstants.api + "/user/background", {
                method: "POST",
                mode: 'no-cors',
                headers: {
                    "Authorization": "Bearer " + authToken.token
                },
                credentials: 'include',
                body: file
            }));*/
    }

}
