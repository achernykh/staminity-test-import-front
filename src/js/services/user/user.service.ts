import { UserProfile } from './user.interface'


export default class UserService {
    _$q: any;
    _$log: any;
    _StorageService: any;
    _api: any;
    _AuthService: any;
    profile: UserProfile;
    currentUser: UserProfile;
    currentUserRole: Array<any>;
    apiType: string;
    
    constructor ($q: any, $log: any, StorageService: any, API: any, AuthService: any) {
        this._$q = $q;
        this._$log = $log;
        this._StorageService = StorageService;
        this._api = API;
        this._AuthService = AuthService;
        this.profile = null;
        this.currentUser = null;
        this.currentUserRole = [];
        this.apiType = 'userProfile';
    }

    currProfile() {
        return this.currentUser
    }

    getProfile(id: number) : Promise<UserProfile> {

        return new Promise((resolve, reject) => {
            console.log('getProfile, id=', id)
            this._StorageService.get('userProfile', id)
                .then((success) => {
                    console.log('getProfile storage success', success);
                    resolve(success);
                }, (empty) => {
                    console.log('getProfile storage empty', empty);
                    this._api.send('getUserProfile', id)
                        .then((success) => {
                            resolve(success)
                        }, (error) => {
                            console.log('getProfile: error in get() with key=', id);
                        });
                })
        })
    }

    get (key) : Promise<UserProfile> {
        return this._StorageService.get('userProfile', key)
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

        return new Promise ((resolve, reject) => {
            console.log('setCurrentUser, id=', id)
            this.getProfile(id).then((success) => {
                console.log('setCurrentUser get success', success);
                this.currentUser = success;
                let subscriptions = success.subscriptions;
                subscriptions.forEach(subsc => this.currentUserRole.push(subsc.code));
                console.log('setCurrentUser subscriptions=', this.currentUserRole);
                resolve(success)
            }, (error) => {
                reject(error)
            });
        })
    }

    logout () {
        this.currentUser = null;
        this.currentUserRole = [];
    }

    getCurrentUser () : UserProfile {
        return this.currentUser;
    }

    getCurrentUserRole () : Promise<any> {
        console.log('getCurrentUserRole user, role', !!this.currentUser, this.currentUserRole)

        return new Promise((resolve,reject) => {
            if (!!this.currentUser)
                return resolve(this.currentUserRole);
            else {
                console.log('setCurrentUser user')
                this.setCurrentUser(4).then(()=> {
                    console.log('setCurrentUser user, role', !!this.currentUser, this.currentUserRole)
                    return resolve(this.currentUserRole)
                })
            }

        })
    }

    getCurrentUserId () : number {
        return this.currentUser.userId;
    }

    setUserpic (file: any) : Promise<UserProfile> {
      return Promise.all([this._StorageService.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/avatar', data, authToken.token))
    }

    setHeader (file: any) : Promise<UserProfile> {
      return Promise.all([this._StorageService.get('authToken'), file])
        .then(([authToken, data]) => this._api.uploadPicture('/user/background', data, authToken.token))
    }

}
