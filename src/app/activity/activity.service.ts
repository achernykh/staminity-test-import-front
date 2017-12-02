import {
    CalculateActivityRangeRequest, GetActivityDetailsRequest, GetActivityGategoryRequest, GetActivityIntervalsRequest, IActivityDetails,
    IActivityInterval, IActivityIntervalG,
    IActivityIntervalL, IActivityIntervalP, IActivityIntervalPW,
    IActivityIntervalW,
} from "../../../api";
import {SocketService} from "../core";
import {GetData, PostData, RESTService} from "../core/rest.service";

export default class ActivityService {

    //private _profile:IUserProfile;
    //private _permissions:Array<Object>;
    //private _displaySettings:Object;

    public static $inject = ["SocketService", "RESTService"];

    constructor(//private StorageService:any,
                //private SessionService:ISessionService,
                private SocketService: SocketService,
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
    public getDetails(id: number, ws: boolean = false): Promise<IActivityDetails> {
        return ws ?
            this.SocketService.send(new GetActivityDetailsRequest(id)) :
            this.RESTService.postData(new GetData(`/activity/${id}/full`, null));
    }

    /**
     * Запрос данных по интевалам тренировки
     * @param id
     * @param types
     * @returns {Promise<any>}
     */
    public getIntervals(id: number, types: string[] = ["L"]): Promise<Array<IActivityIntervalW | IActivityIntervalP | IActivityIntervalG | IActivityIntervalPW | IActivityIntervalL>> {
        return this.SocketService.send(new GetActivityIntervalsRequest(id, types))
            .then((response: {intervals: any[]}) => response.intervals);
    }

    /**
     * Получение списка категорий тренировки
     * @param id
     * @param onlyMine
     * @returns {Promise<any>}
     */
    public getCategory(id: number = null, onlyMine: boolean = false): Promise<any> {
        return this.SocketService.send(new GetActivityGategoryRequest(id , onlyMine));
    }

    public calculateRange(
        activityId: number,
        start: number,
        end: number,
        type: IActivityInterval[],
        nonContiguousMode: boolean = true): Promise<any> {
        return this.SocketService.send(new CalculateActivityRangeRequest(activityId, start, end, type, nonContiguousMode));
    }

}
