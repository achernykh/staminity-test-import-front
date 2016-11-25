import { UserProfile } from './user.interface'


export default class UserService {
    _$q: any;
    _$log: any;
    _Storage: any;
    _api: any;
    currentUser: UserProfile;
    currentUserRole: Array<any>;
    apiType: string;
    
    constructor ($q: any, $log: any, Storage: any, API: any) {
        this._$q = $q;
        this._$log = $log;
        this._Storage = Storage;
        this._api = API;
        this.currentUser = null;
        this.currentUserRole = [];
        this.apiType = 'userProfile';
    }

    get (key) : Promise<UserProfile> {
        return this._Storage.get('userProfile', key)
            .then((success) => {
                this._$log.info('UserService: get userProfile', success);
                return success;
            }, (error) => {
                this._$log.error('UserService: get userProfile', error);
                this._api.send('getUserProfile', key)
                    .then((success) => {
                        return success
                    }, (error) => {
                        this._$log.error('UserService: error in get() with key=', key);
                    });
            })
    }

    setCurrentUser (id: number) : Promise<any> {
        let result = this._$q.defer();

        this.get(id).then((success) => {
            this._$log.debug('UserService: setCurrentUser ', success);
            this.currentUser = success;
            let subscriptions = success.subscriptions;
            subscriptions.forEach(subsc => this.currentUserRole.push(subsc.code));
            this._$log.debug('UserService: userSubscriptions=', this.currentUserRole);
            result.resolve(success)
        }, (error) => { 
            result.resolve(error)
        });
            

        return result.promise;
    }

    logout () {
        this.currentUser = null;
        this.currentUserRole = [];
    }

    getCurrentUser () : UserProfile {
        return this.currentUser;
    }

    getCurrentUserRole () : any {
        return this.currentUserRole;
    }

    getCurrentUserId () : number {
        return this.currentUser.userId;
    }

    setUserpic (file: any) : Promise<UserProfile> {
      return Promise.all([this._Storage.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/avatar', data, authToken.token))
    }

    setHeader (file: any) : Promise<UserProfile> {
      return Promise.all([this._Storage.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/background', data, authToken.token))
    }

}
