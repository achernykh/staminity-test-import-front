import {IUserProfile} from '../../../../api/user/user.interface';
import { GetRequest, PutRequest, GetSummaryStatisticsRequest } from '../../../../api/user/user.request'
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
    getProfile(uri:string):Promise<IUserProfile> {
        return this.SocketService.send(new GetRequest(uri))
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(profile))
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
    }
    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
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
    getSummaryStatistics(id: number, start: Date, end: Date, group: string, data: Array<string>):Promise<Object> {
        return this.SocketService.send(new GetSummaryStatisticsRequest(id,start,end,group,data))
            .then((data:any) => {
                return data.value
            });
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

    /*setUserpic (file: any) : Promise<IUserProfile> {
     return Promise.all([this._StorageService.get('authToken'), file])
     .then(([authToken, data]) => this._API.uploadPicture('/user/avatar', data, authToken.token))
     }

     setHeader (file: any) : Promise<IUserProfile> {
     return Promise.all([this._StorageService.get('authToken'), file])
     .then(([authToken, data]) => this._API.uploadPicture('/user/background', data, authToken.token))
     }*/
}
