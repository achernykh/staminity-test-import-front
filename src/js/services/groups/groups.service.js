export default class GroupsService {
    constructor($q, $log, StorageService){
        'ngInject'
        this._$q = $q;
        this._$log = $log;
        this._StorageService = StorageService;
        this.currentUser = null;
        this.currentUserRole = [];
        this.apiType = 'userProfile';
    }
    get(key){
        return this._StorageService.get('userGroup', key).then(
            (success) => {
                this._$log.info('GroupsService: get userGroup', success);
                return success},
            (error) => {
                this._$log.error('GroupsService: get userGroup', error);
                this._api.send('getUserGroup', key).then(
                    (success) => {return success},
                    (error) => {
                        this._$log.error('GroupsService: error in get() with key=', key);
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
                this._$log.debug('GroupsService: userSubscriptions=', this.currentUserRole);
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
