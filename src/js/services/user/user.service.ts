import {IUserProfile} from './user.interface';
import {ISocketService, IWSRequest} from '../api/socket.service';
import {ISessionService} from '../session/session.service';
import {PostData, PostFile, IRESTService} from '../api/rest.service'
/**
 * Сборщик запроса getUserProfile
 */
class GetRequest implements IWSRequest {

    requestType:string;
    requestData:{userId:number; uri:string;}

    constructor(userId:number, uri:string = "") {
        this.requestType = 'getUserProfile';
        this.requestData.userId = userId;
        this.requestData.uri = uri;
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

    profile:IUserProfile;
    currentUser:IUserProfile;
    currentUserRole:Array<any>;

    constructor(StorageService:any, SessionService:ISessionService, SocketService:ISocketService, RESTService:IRESTService) {
        this.StorageService = StorageService;
        this.SessionService = SessionService;
        this.SocketService = SocketService;
        this.profile = null;
        this.currentUser = null;
        this.currentUserRole = [];
    }

    /**
     * Запрашиваем UserProfile на сервере
     * @param request
     * @returns {Promise<T>}
     */
    getProfile(id:number):Promise<IUserProfile> {

        return this.StorageService.get('userProfile', id)
            .then((profile:IUserProfile) => {
                console.log('getProfile storage success', profile);
                return profile;
            }, (empty) => {
                console.log('getProfile storage empty', empty);
                this.SocketService.send(new GetRequest(id))
                    .then((success:IUserProfile) => {
                        return success;
                    }, (error) => {
                        throw new Error(error);
                    });
            })
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    putProfile(profile:IUserProfile):Promise<IUserProfile> {
        return this.SocketService.send(new PutRequest(profile))
            .then((profile:IUserProfile) => {
                return profile
            });
    }

    /**
     * Аплоад аватара пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileAvatar(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/avatar',file))
            .then((profile:IUserProfile) => {
                return profile
            });
    }

    /**
     * Аплоад фонового изоражения пользователя
     * @param file
     * @returns {Promise<IUserProfile>|Promise<T>|PromiseLike<IUserProfile>|Promise<TResult2|IUserProfile>}
     */
    postProfileBackground(file:any):Promise<IUserProfile> {
        return this.RESTService.postFile(new PostFile('/user/background',file))
            .then((profile:IUserProfile) => {
                return profile
            });
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

    /**
     *
     * @returns {IUserProfile}
     */
    currProfile() {
        return this.currentUser
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
                this.setCurrentUser(this.SessionService.getUser()).then(()=> {
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
