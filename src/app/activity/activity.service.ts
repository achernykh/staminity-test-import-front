import {IPromise} from 'angular';
import {IActivityDetails} from '../../../api/activity/activity.interface';
import {GetDetailsRequest} from '../../../api/activity/activity.request';
import {ISocketService} from '../core/socket.service';
import {RESTService, PostData} from "../core/rest.service";

export default class ActivityService {

    //private _profile:IUserProfile;
    //private _permissions:Array<Object>;
    //private _displaySettings:Object;

    static $inject = ['SocketService','RESTService'];

    constructor(//private StorageService:any,
                //private SessionService:ISessionService,
                private SocketService:ISocketService,
                private RESTService: RESTService) {
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

    /**
     *
     * @param id
     * @returns {IHttpPromise<{}>}
     */
    getDetails2(id:number): IPromise<any>{
        return this.RESTService.postData(new PostData(`/activity/${id}/full`, null));
    }

}