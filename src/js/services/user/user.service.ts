import { UserProfile } from './user.interface'


export default class UserService {

    _StorageService: any;
    _SessionService: any;
    _api: any;
    profile: UserProfile;
    currentUser: UserProfile;
    currentUserRole: Array<any>;
    apiType: string;
    
    constructor (StorageService: any, SessionService: any, API: any) {
        this._StorageService = StorageService;
        this._SessionService = SessionService;
        this._api = API;
        this.profile = null;
        this.currentUser = null;
        this.currentUserRole = [];
    }

    currProfile() {
        return this.currentUser
    }

    getProfile (id: number) : Promise<UserProfile> {
        return this._api.wsRequest('getUserProfile', { userId: id, uri: "" })
            .then((response) => response[0].value)
        // new Promise((resolve, reject) => {
        //     console.log('getProfile, id=', id);
        //     this._StorageService.get('userProfile', id)
        //         .then((success: UserProfile) => {
        //             console.log('getProfile storage success', success);
        //             resolve(success);
        //         }, (empty) => {
        //             console.log('getProfile storage empty', empty);
        //             this._api.send('getUserProfile', id)
        //                 .then((success: UserProfile) => {
        //                     resolve(success)
        //                 }, (error) => {
        //                     console.log('getProfile: error in get() with key=', id);
        //                 });
        //         })
        // })
    }

    get (key) : Promise<UserProfile> {
        return this._api.wsRequest('getUserProfile', { userId: key, uri: "" })
            .then((response) => response[0].value)
        // this._StorageService.get('userProfile', key)
        //     .then((success) => {
        //         console.log('UserService: get userProfile', success);
        //         return success;
        //     }, (error) => {
        //         console.log('UserService: get userProfile', error);
        //         this._api.send('getUserProfile', key)
        //             .then((success) => {
        //                 return success
        //             }, (error) => {
        //                 console.log('UserService: error in get() with key=', key);
        //             });
        //     })
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

        return new Promise((resolve,reject) => {
            if (!!this.currentUser)
                resolve(this.currentUserRole);
            else {
                console.log('setCurrentUser user', this)
                this.setCurrentUser(this._SessionService.getUser()).then(()=> {
                    console.log('setCurrentUser user, role', !!this.currentUser, this.currentUserRole)
                    resolve(this.currentUserRole)
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

    putProfile (data: UserProfile): Promise<any> {
        return this._api.wsRequest('postUserProfile',data)
    }

}
