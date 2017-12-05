import { SocketService } from "@app/core";
import {
    GetPeriodizationScheme,
    IGetPeriodizationSchemeResponse, IPeriodizationScheme, PostPeriodizationScheme, PutPeriodizationScheme,
    DeletePeriodizationScheme, IMesocycle, PostMesocycle, PutMesocycle, DeleteMesocycle
} from "../../../../api/seasonPlanning";
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
     * Создать Схему периодизации
     * @param scheme
     * @returns {Promise<IRevisionResponse>}
     */
    post (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PostPeriodizationScheme(scheme));
    }

    /**
     * Изменить Схему периодизации
     * @param scheme
     * @returns {Promise<IRevisionResponse>}
     */
    put (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PutPeriodizationScheme(scheme));
    }

    /**
     * Удалить Схему периодизации
     * @param scheme
     * @returns {Promise<IWSResponse>}
     */
    delete (scheme: IPeriodizationScheme): Promise<IWSResponse> {
        return this.socket.send(new DeletePeriodizationScheme(scheme));
    }

    /**
     * Создать Мезоцикл
     * @param schemeId
     * @param mesocycle
     * @returns {Promise<any>}
     */
    postMesocycle (schemeId: number, mesocycle: IMesocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMesocycle(schemeId, mesocycle));
    }

    /**
     * Изменить мезоцикл
     * @param mesocycle
     * @returns {Promise<any>}
     */
    putMesocycle (schemeId: number, mesocycle: IMesocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PutMesocycle(schemeId, mesocycle));
    }

    /**
     * Удалить мезоцикл
     * @param mesocycle
     * @returns {Promise<any>}
     */
    deleteMesocycle (schemeId: number, mesocycleId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteMesocycle(schemeId, mesocycleId));
    }

}