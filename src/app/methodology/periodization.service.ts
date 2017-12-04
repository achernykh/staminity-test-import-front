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

}