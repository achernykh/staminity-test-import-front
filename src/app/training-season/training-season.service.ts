import { SocketService } from "@app/core";
import {
    ISeasonPlan,
    IMicrocycle,
    IGetSeasonPlanRequest,
    IWeekPeriodizationData,
    IGetMicrocycleResponse,
    IGetSeasonPlanResponse,
    GetSeasonPlan,
    PostSeasonPlan,
    PutSeasonPlan,
    DeleteSeasonPlan,
    GetMicrocycle,
    DeleteMicrocycle,
    PostMicrocycle,
    PutMicrocycle,
    GetWeekPeriodizationData
} from "../../../api/seasonPlanning";
import { IRevisionResponse, IWSResponse } from "@api/core";
import { IWeekPeriodizationDataResponse } from "../../../api/seasonPlanning/seasonPlanning.interface";

export class TrainingSeasonService {

    static $inject = ['SocketService'];

    constructor (private socket: SocketService) {
    }

    /**
     * Получить список планов на сезон
     * @returns {Promise<IGetSeasonPlanRequest>}
     */
    get (search: IGetSeasonPlanRequest): Promise<IGetSeasonPlanResponse> {
        return this.socket.send(new GetSeasonPlan(search));
    }

    /**
     * Создать План на сезон
     * @param season
     * @returns {Promise<IRevisionResponse>}
     */
    post (season: ISeasonPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostSeasonPlan(season));
    }

    /**
     * Изменить План на сезон
     * @param season
     * @returns {Promise<IRevisionResponse>}
     */
    put (season: ISeasonPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutSeasonPlan(season));
    }

    delete (season: ISeasonPlan): Promise<IWSResponse> {
        return this.socket.send(new DeleteSeasonPlan(season));
    }

    /**
     * Сохранить новый микроцикл в плане
     * @param cycle
     * @returns {Promise<IRevisionResponse>}
     */
    postMicrocycle (seasonId: number, cycle: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMicrocycle(seasonId, cycle));
    }

    /**
     * Перечень микроциклов по плану
     * @param seasonPlanId
     * @returns {Promise<any>}
     */
    getItems (seasonPlanId: number): Promise<IGetMicrocycleResponse> {
        return this.socket.send(new GetMicrocycle(seasonPlanId));
    }

    /**
     * Создать микроцикл
     * @param seasonId
     * @param item
     * @returns {Promise<IRevisionResponse>}
     */
    postItem (seasonId: number, item: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMicrocycle(seasonId, item));
    }

    /**
     * Изменить микроцикл
     * @param item
     * @returns {Promise<IRevisionResponse>}
     */
    putItem (item: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PutMicrocycle(item));
    }

    /**
     * Удалить микроцикл
     * @param item
     * @returns {Promise<any>}
     */
    deleteItem (item: IMicrocycle): Promise<IWSResponse> {
        return this.socket.send(new DeleteMicrocycle(item));
    }

    /**
     * Данные по периодизации для пользователя
     * @param userId
     * @param week
     * @returns {Promise<IWeekPeriodizationDataResponse>}
     */
    getUserWeekData (userId: number, week: string): Promise<IWeekPeriodizationDataResponse> {
        return this.socket.send(new GetWeekPeriodizationData(userId, null, week));
    }

    /**
     * Данные по периодизации для группы пользователей
     * @param groupId
     * @param week
     * @returns {Promise<IWeekPeriodizationDataResponse>}
     */
    getGroupWeekData (groupId: number, week: string): Promise<IWeekPeriodizationDataResponse> {
        return this.socket.send(new GetWeekPeriodizationData(null, groupId, week));
    }

}