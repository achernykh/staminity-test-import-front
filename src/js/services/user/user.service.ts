import {IUserProfile} from '../../../../api/user/user.interface';
import { GetUserProfileSummaryStatistics } from '../../../../api/statistics/statistics.request'
import { GetRequest, PutRequest } from '../../../../api/user/user.request'
import {ISocketService} from '../api/socket.service';
import {ISessionService} from '../session/session.service';
import {PostData, PostFile, IRESTService} from '../api/rest.service';

export default class UserService {

    StorageService:any;
    SessionService:ISessionService;
    SocketService:ISocketService;
    RESTService:IRESTService;

    private _profile: IUserProfile;
    private _permissions: Array<Object>;
    private _displaySettings: Object;

    constructor(StorageService:any, SessionService:ISessionService, SocketService:ISocketService, RESTService:IRESTService) {
        this.StorageService = StorageService;
        this.SessionService = SessionService;
        this.SocketService = SocketService;
        this.RESTService = RESTService;
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param request
     * @returns {Promise<T>}
     */
    getProfile(key:string|number):Promise<IUserProfile> {
        let request = new GetRequest(key);
        
        if (typeof key === 'string') {
            request.requestData.uri = key
        } else {
            request.requestData.userId = key
        }
        
        return this.SocketService.send(request)
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(profile))
                .then((result)=>{
                    if (profile.hasOwnProperty('display'))
                        this.displaySettings = profile.display;
                    return result
                })
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
            .then((response) => response.data)
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
            .then((response) => response.data)
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
        return this.SocketService.send(new GetUserProfileSummaryStatistics(id, start, end, group, data))
    }

    get profile():IUserProfile {
        if (!!!this._profile) {
            this._profile = this.SessionService.getUser();
        }
        return this._profile;
    }

    set profile(profile:IUserProfile) {
        this._profile = profile;
    }

    get permissions():Array<Object> {
    	if(!!!this._permissions)
            this._permissions = this.SessionService.getPermissions();
        return this._permissions;
    }

    get displaySettings():Object {
        if (!!!this._displaySettings) {
            this._displaySettings = this.SessionService.getDisplaySettings();
        }
        return this._displaySettings;
    }

    set displaySettings(display:Object){
        this._displaySettings = display
        this.SessionService.setDisplaySettings(this._displaySettings)
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
