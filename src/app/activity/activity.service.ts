import {IActivityDetails} from '../../../api/activity/activity.interface';
import {GetDetailsRequest} from '../../../api/activity/activity.request';
import {ISocketService} from '../core/socket.service';
//import {ISessionService} from '../core/session.service';
//import {PostData, PostFile, IRESTService} from '../core/rest.service';
//import { IHttpPromise } from 'angular';

export default class ActivityService {

    //private _profile:IUserProfile;
    //private _permissions:Array<Object>;
    //private _displaySettings:Object;

    static $inject = ['SocketService'];

    constructor(//private StorageService:any,
                //private SessionService:ISessionService,
                private SocketService:ISocketService) {
        //this.StorageService = StorageService;
        //this.SessionService = SessionService;
        //this.SocketService = SocketService;
        //this.RESTService = RESTService;
    }

    /**
     * Обновляем данные пользователя
     * @param profile - может содержать частичные данные профиля, по секциям
     * @returns {Promise<T>}
     */
    getDetails(id:number):Promise<IActivityDetails> {
        return this.SocketService.send(new GetDetailsRequest(id));
    }

}