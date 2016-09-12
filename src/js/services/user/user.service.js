export default class UserService {
    constructor($q, $log, Storage){
        'ngInject'
        this._$q = $q;
        this._$log = $log;
        this._Storage = Storage;
        this.currentUser = null;
        this.currentUserRole = [];
        this.apiType = 'userProfile';
    }
    get(key){
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
    setCurrentUser(id){
        let result = this._$q.defer();

        this.get(id).then(
            (success) => {
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
    logout(){
        this.currentUser = null;
        this.currentUserRole = [];
    }
    getCurrentUser(){
        return this.currentUser;
    }
    getCurrentUserRole(){
        return this.currentUserRole;
    }
    getCurrentUserId(){
        return this.currentUser.userId;
    }

}
