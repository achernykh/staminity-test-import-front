import {IUserProfile} from '../../../api/user/user.interface';
import { GetUserProfileSummaryStatistics } from '../../../api/statistics/statistics.request';
import { GetRequest, PutRequest } from '../../../api/user/user.request';
import {ISocketService} from './socket.service';
import {ISessionService} from './session.service';
import {PostData, PostFile, IRESTService} from './rest.service';
import { IHttpPromise } from 'angular';


export default class UserService {

    private _profile: IUserProfile;
    private _permissions: Array<Object>;
    private _displaySettings: Object;

    static $inject = ['SessionService', 'SocketService','RESTService'];

    constructor(
        //private StorageService:any,
        private SessionService:ISessionService,
        private SocketService:ISocketService,
        private RESTService:IRESTService) {
        //this.StorageService = StorageService;
        //this.SessionService = SessionService;
        //this.SocketService = SocketService;
        //this.RESTService = RESTService;
        //this._rxProfile = <BehaviorSubject<IUserProfile>>new BehaviorSubject([]);
        //this.rxProfile = this._rxProfile.asObservable();
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param request
     * @returns {Promise<T>}
     */
    getProfile(key:string|number):Promise<IUserProfile> {
        return this.SocketService.send(new GetRequest(key));
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(profile))
                .then((result)=>{
                    let currentUser = this.SessionService.getUser();
                    if (result.value.id === currentUser.userId){
                        this.SessionService.setUser(Object.assign(currentUser, profile, result.value.revision));
                    }
                    return result;
                });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any):IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
            .then((response) => response.data);
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any):IHttpPromise<any> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
            .then((response) => response.data);
    }

    /**
     * Запрос итоговой ститистики по тренировкам
     * @param id
     * @param start
     * @param end
     * @param group
     * @param data
     * @returns {Promise<TResult>}
     */
    getSummaryStatistics(id: number, start?: string, end?: string, group?: string, data?: Array<string>):Promise<Object> {
        return this.SocketService.send(new GetUserProfileSummaryStatistics(id, start, end, group, data));
    }

    get profile():IUserProfile {
        if (!!!this._profile) {
            this._profile = this.SessionService.getUser();
        }
        return this._profile;
    }

    set profile(profile:IUserProfile) {
        this._profile = profile;
        this.SessionService.setUser(this._profile);
    }

    get permissions():Array<Object> {
    	if(!!!this._permissions){
            this._permissions = this.SessionService.getPermissions();
        }
        return this._permissions;
    }

    get displaySettings():Object {
        if (!!!this._displaySettings) {
            this._displaySettings = this.SessionService.getDisplaySettings();
        }
        return this._displaySettings;
    }

    set displaySettings(display:Object){
        this._displaySettings = display;
        this.SessionService.setDisplaySettings(this._displaySettings);
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