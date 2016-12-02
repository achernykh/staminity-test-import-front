import {IUserProfile} from './user.interface';
import {IWS, IWSRequest} from '../api/ws.service';

/**
 * Сборщик запроса getUserProfile
 */
class UserProfileGetRequest implements IWSRequest {
    requestId:number;
    requestType:string = 'getUserProfile';
    requestData:{userId:number; uri:string;}

    constructor(userId:number) {
        this.requestData.userId = userId;
    }
}

/**
 * Сборщик запроса putUserProfile
 */
class UserProfilePutRequest implements IWSRequest {
    requestId:number;
    requestType:string = 'updateUserProfile';
    requestData:IUserProfile;

    constructor(profile:IUserProfile) {
        this.requestData = profile;
    }
}

export default class UserService {

    _StorageService:any;
    _SessionService:any;
    _API:IWS;
    profile:IUserProfile;
    currentUser:IUserProfile;
    currentUserRole:Array<any>;

    constructor(StorageService:any, SessionService:any, API2:IWS) {
        this._StorageService = StorageService;
        this._SessionService = SessionService;
        this._API = API2;
        this.profile = null;
        this.currentUser = null;
        this.currentUserRole = [];
    }

    /**
     *
     * @returns {IUserProfile}
     */
    currProfile() {
        return this.currentUser
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param request
     * @returns {Promise<T>}
     */
    getProfile(id:number):Promise<IUserProfile> {

        return new Promise((resolve) => {
            console.log('getProfile, id=', id);
            this._StorageService.get('userProfile', id)
                .then((success:IUserProfile) => {
                    console.log('getProfile storage success', success);
                    resolve(success);
                }, (empty) => {
                    console.log('getProfile storage empty', empty);
                    let request = new UserProfileGetRequest(id);
                    request.requestType = 'getUserProfile';
                    this._API.wsRequest(request)
                        .then((success:IUserProfile) => {
                            resolve(success)
                        }, (error) => {
                            console.log('getProfile: error in get() with key=', request.requestData.userId);
                        });
                })
        })
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return new Promise((resolve)=> {
            let request = new UserProfilePutRequest(profile);
            console.log('putProfile=', request);
            this._API.wsRequest(request)
                .then((profile:IUserProfile) => resolve(profile));

        })
    }

    /**
     * Устанавливаем пользователя сессии
     * Номер текущего пользователя берется 1) ответа на sign in 2) application storage authToken.userId
     * @param id
     * @returns {Promise<T>}
     */
    setCurrentUser(id:number):Promise<any> {
        return this.getProfile(id)
            .then((success) => {
                console.log('setCurrentUser get success', success);
                this.currentUser = success;
                return success;
            }, (error) => {
                return error
            })
    }

    logout() {
        this.currentUser = null;
        this.currentUserRole = [];
    }

    getCurrentUser():IUserProfile {
        return this.currentUser;
    }

    getCurrentUserRole():Promise<any> {

        return new Promise((resolve) => {
            if (!!this.currentUser)
                resolve(this.currentUserRole);
            else {
                console.log('setCurrentUser user', this);
                this.setCurrentUser(this._SessionService.getUser()).then(()=> {
                    console.log('setCurrentUser user, role', !!this.currentUser, this.currentUserRole);
                    resolve(this.currentUserRole)
                })
            }

        })
    }

    getCurrentUserId():number {
        return this.currentUser.userId;
    }

    /*setUserpic (file: any) : Promise<IUserProfile> {
     return Promise.all([this._StorageService.get('authToken'), file])
     .then(([authToken, data]) => this._API.uploadPicture('/user/avatar', data, authToken.token))
     }

     setHeader (file: any) : Promise<IUserProfile> {
     return Promise.all([this._StorageService.get('authToken'), file])
     .then(([authToken, data]) => this._API.uploadPicture('/user/background', data, authToken.token))
     }*/
}
