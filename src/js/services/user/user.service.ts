import {IUserProfile} from './user.interface';
import {ISocketService, IWSRequest} from '../api/socket.service';
import {ISessionService} from '../session/session.service';
import {PostData, PostFile, IRESTService} from '../api/rest.service'
/**
 * Сборщик запроса getUserProfile
 */
class GetRequest implements IWSRequest {

    requestType:string;
    requestData:{
        uri: number | string;
    }

    constructor(uri:string) {
        this.requestType = 'getUserProfile';
        this.requestData = {
            uri: uri
        }
    }
}
/**
 * Сборщик запроса putUserProfile
 */
class PutRequest implements IWSRequest {

    requestType:string;
    requestData:IUserProfile;

    constructor(profile:IUserProfile) {
        this.requestType = 'putUserProfile';
        this.requestData = profile;
    }
}

class GetSummaryStatisticsRequest implements IWSRequest {
    requestType:string;
    requestData:any;

    constructor(id: number, start: Date, end: Date, group: string, data: Array<string>) {
        this.requestType = 'getUserProfileSummaryStatistics';
        this.requestData = {
            userId: id,
            startDate: start, // период активностей: начало
            endDate: end, // период активностей: конец
            groupBy: group, // Y - Year, M - Month, D - Day// Y - Year, M - Month, D - Day
            activityTypes: data //список видов спорта["run", "etc.", "* = ALL"]
        };
    }
}

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
        console.log('getProfile =', uri);
        return this.SocketService.send(new GetRequest(uri))
            .then((result) => {return result[0].value})
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
