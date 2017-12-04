import { SocketService } from "@app/core";
import {
    ISeasonPlan,
    IGetSeasonPlanRequest,
    GetPeriodizationScheme,
    IPeriodizationScheme,
    GetSeasonPlan,
    PostSeasonPlan,
    PutSeasonPlan,
    IMesocycle,
    PutMesocycle,
    PostMesocycle,
    DeletePeriodizationScheme,
    DeleteMesocycle
} from "../../../api/seasonPlanning";
import { IRevisionResponse, IWSResponse } from "@api/core";
import { IGetSeasonPlanResponse, IMicrocycle } from "../../../api/seasonPlanning/seasonPlanning.interface";
import { PostMicrocycle } from "../../../api/seasonPlanning/seasonPlanning.request";

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

    delete (scheme: IPeriodizationScheme): Promise<IWSResponse> {
        return this.socket.send(new DeletePeriodizationScheme(scheme));
    }

    /**
     * Сохранить новый микроцикл в плане
     * @param cycle
     * @returns {Promise<IRevisionResponse>}
     */
    postMicrocycle (cycle: IMicrocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMicrocycle(cycle));
    }

}