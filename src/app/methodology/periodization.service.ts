import { SocketService } from "@app/core";
import {
    GetSeasonPlan,
    IGetSeasonPlanRequest,
    ISeasonPlan,
    PostSeasonPlan,
    PutSeasonPlan,
    DeleteSeasonPlan,
    IGetMicrocycleResponse,
    GetMicrocycle,
    IMicrocycle,
    PostMicrocycle,
    DeleteMicrocycle,
    IWeekPeriodizationData,
    GetWeekPeriodizationData,
    IGetSeasonPlanResponse,
    GetPeriodizationScheme,
    IGetPeriodizationSchemeResponse
} from "../../../api/seasonPlanning";
import { IRevisionResponse, IWSResponse } from "@api/core";

export class PeriodizationService {

    static $inject = [ 'SocketService' ];

    constructor (private socket: SocketService) {
    }

    /**
     * Получить перечень Схем периодизации
     * @returns {Promise<any>}
     */
    get (): Promise<IGetPeriodizationSchemeResponse> {
        return this.socket.send(new GetPeriodizationScheme());
    }

    /**
     * Создать новый План на сезон
     * @param plan
     * @returns {Promise<any>}
     */
    post (plan: ISeasonPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostSeasonPlan(plan));
    }

    /**
     * Изменить План на сезон
     * @param plan
     * @returns {Promise<any>}
     */
    put (plan: ISeasonPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutSeasonPlan(plan));
    }

    /**
     * Удалить План на сезон
     * @param plan
     * @returns {Promise<any>}
     */
    delete (plan: ISeasonPlan): Promise<IWSResponse> {
        return this.socket.send(new DeleteSeasonPlan(plan));
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
     * @param item
     * @returns {Promise<any>}
     */
    postItem (item: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMicrocycle(item));
    }

    /**
     * Изменить микроцикл
     * @param item
     * @returns {Promise<any>}
     */
    putItem (item: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMicrocycle(item));
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
     * @returns {Promise<any>}
     */
    getUserWeekData (userId: number, week: string): Promise<IWeekPeriodizationData> {
        return this.socket.send(new GetWeekPeriodizationData(userId, null, week));
    }

    /**
     * Данные по периодизации для группы пользователей
     * @param groupId
     * @param week
     * @returns {Promise<any>}
     */
    getGroupWeekData (groupId: number, week: string): Promise<IWeekPeriodizationData> {
        return this.socket.send(new GetWeekPeriodizationData(null, groupId, week));
    }

}