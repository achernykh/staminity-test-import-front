import {IPromise} from 'angular';
import {
    IActivityDetails, IActivityIntervalW, IActivityIntervalP, IActivityIntervalG, IActivityIntervalPW,
    IActivityIntervalL, IActivityInterval
} from '../../../api/activity/activity.interface';
import {
    GetActivityDetailsRequest, GetActivityGategoryRequest, GetActivityIntervalsRequest,
    CalculateActivityRangeRequest
} from '../../../api/activity/activity.request';
import {ISocketService} from '../core/socket.service';
import {RESTService, GetData} from "../core/rest.service";

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
        return this.SocketService.send(new GetActivityDetailsRequest(id));
    }

    /**
     * Запрос данных по интевалам тренировки
     * @param id
     * @param types
     * @returns {Promise<any>}
     */
    getIntervals(id:number, types: Array<string> = ['L']):Promise<Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalG | IActivityIntervalPW | IActivityIntervalL>> {
        return this.SocketService.send(new GetActivityIntervalsRequest(id, types))
            .then((response: {intervals: Array<any>}) => response.intervals);
    }

    /**
     *
     * @param id
     * @returns {IHttpPromise<{}>}
     */
    getDetails2(id:number): IPromise<any>{
        return this.RESTService.postData(new GetData(`/activity/${id}/full`, null));
    }

    /**
     * Получение списка категорий тренировки
     * @param id
     * @param onlyMine
     * @returns {Promise<any>}
     */
    getCategory(id: number = null, onlyMine: boolean = false): Promise<any> {
        return this.SocketService.send(new GetActivityGategoryRequest(id , onlyMine));
    }

    calculateRange(activityId: number, start: number, end: number, type: Array<IActivityInterval>):Promise<any> {
        return this.SocketService.send(new CalculateActivityRangeRequest(activityId, start,end, type));
    }

}
