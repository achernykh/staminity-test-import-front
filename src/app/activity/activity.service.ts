import {IPromise, IHttpPromise} from 'angular';
import {
    IActivityDetails, IActivityIntervalW, IActivityIntervalP, IActivityIntervalG, IActivityIntervalPW,
    IActivityIntervalL, IActivityInterval
} from '../../../api/activity/activity.interface';
import {
    GetDetailsRequest, GetActivityGategory, GetActivityIntervals,
    CalculateActivityRange
} from '../../../api/activity/activity.request';
import {ISocketService} from '../core/socket.service-ajs';
import {RESTService, PostData, GetData} from "../core/rest.service";

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
     * @param ws - протокол запроса, true - websocket, false - http
     * @returns {Promise<T>}
     */
    getDetails(id:number, ws: boolean = false):Promise<IActivityDetails> {
        return ws ?
            this.SocketService.send(new GetDetailsRequest(id)) :
            this.RESTService.postData(new GetData(`/activity/${id}/full`, null));
    }

    /**
     * Запрос данных по интевалам тренировки
     * @param id
     * @param types
     * @returns {Promise<any>}
     */
    getIntervals(id:number, types: string = 'L'):Promise<Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalG | IActivityIntervalPW | IActivityIntervalL>> {
        return this.SocketService.send(new GetActivityIntervals(id, types))
            .then((response: {intervals: Array<any>}) => response.intervals);
    }

    /**
     * Получение списка категорий тренировки
     * @param id
     * @param onlyMine
     * @returns {Promise<any>}
     */
    getCategory(id: number = null, onlyMine: boolean = false): Promise<any> {
        return this.SocketService.send(new GetActivityGategory(id , onlyMine));
    }

    calculateRange(activityId: number, start: number, end: number, type: Array<IActivityInterval>):Promise<any> {
        return this.SocketService.send(new CalculateActivityRange(activityId, start,end, type));
    }

}