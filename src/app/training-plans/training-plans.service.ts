import { SocketService } from "../core";
import {
    PostTrainingPlan, PutTrainingPlan, SearchTrainingPlan, DeleteTrainingPlan, GetTrainingPlan, ModifyTrainingPlanItem,
    ITrainingPlan, ITrainingPlanSearchResult, ITrainingPlanSearchRequest
} from "../../../api/trainingPlans";
import { IWSResponse, IRevisionResponse } from "@api/core";
import { ICalendarItem } from "@api/calendar";

/**
 * Сервис для работы с данными Долгосрочного плана
 * Долгосрочный план имеет карточку и запланированные записи в календаре, которые можно применить к календарю
 * пользователя сервиса
 * Долгосрочные планы могут быть использованы тренерами или тренерскими клубами как для внутренней работы по
 * развитию методологиии тренирочного процесса, так и выставлены на продажу пользователям сервиса для самостоятельной
 * подготовки к соревнованию
 */
export class TrainingPlansService {

    static $inject = [ 'SocketService' ];

    constructor (private socket: SocketService) {

    }

    /**
     * Поиск долгосрочных планов
     * @param request
     * @returns {Promise<any>}
     */
    search (request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.socket.send(new SearchTrainingPlan(request));
    }

    /**
     * Полная карточка долгосрочного плана
     * @param planId
     * @returns {Promise<any>}
     */
    get (planId: number): Promise<ITrainingPlan> {
        return this.socket.send(new GetTrainingPlan(planId));
    }

    /**
     * Создание карточки долгосрочного плана
     * @param plan
     * @returns {Promise<any>}
     */
    post (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

    /**
     * Изменение карточки долгосрочного плана
     * @param plan
     * @returns {Promise<any>}
     */
    put (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutTrainingPlan(plan));
    }

    /**
     * Удаление долгосрочного плана
     * @param planId
     * @returns {Promise<any>}
     */
    delete (planId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteTrainingPlan(planId));
    }

    /**
     * Создание записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    postItem (planId: number, item: ICalendarItem, isSample: boolean = false): Promise<IRevisionResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('I', planId, item, isSample));
    }

    /**
     * Изменение записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    putItem (planId: number, item: ICalendarItem, isSample: boolean = false): Promise<IRevisionResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('U', planId, item, isSample));
    }

    /**
     * Удаление записи календаря в долгосрочном плане
     * @param planId
     * @param item
     * @param isSample
     * @returns {Promise<any>}
     */
    deleteItem (planId: number, item: ICalendarItem, isSample: boolean = false): Promise<IWSResponse> {
        return this.socket.send(new ModifyTrainingPlanItem('D', planId, item, isSample));
    }
}