import { SocketService } from "@app/core";
import {
    IGetPeriodizationSchemeResponse, GetPeriodizationScheme, IPeriodizationScheme,
    PostPeriodizationScheme, PutPeriodizationScheme, IMesocycle, PutMesocycle, PostMesocycle, DeletePeriodizationScheme,
    DeleteMesocycle
} from "../../../api/seasonPlanning";
import { IRevisionResponse, IWSResponse } from "@api/core";

export class TrainingSeasonService {

    static $inject = ['SocketService'];

    constructor (
        private socket: SocketService) {
    }

    /**
     * Получить Схемы периодизации
     * @returns {Promise<any>}
     */
    get (): Promise<IGetPeriodizationSchemeResponse> {
        return this.socket.send(new GetPeriodizationScheme());
    }

    /**
     * Создать схему периодизации
     * @param scheme
     * @returns {Promise<any>}
     */
    post (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PostPeriodizationScheme(scheme));
    }

    /**
     * Изменить схему периодизации
     * @param scheme
     * @returns {Promise<any>}
     */
    put (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PutPeriodizationScheme(scheme));
    }

    delete (scheme: IPeriodizationScheme): Promise<IWSResponse> {
        return this.socket.send(new DeletePeriodizationScheme(scheme));
    }

    /**
     * Создать мезоцикл в схеме периодизации
     * @param schemeId
     * @param mesocycle
     * @returns {Promise<any>}
     */
    postMesocycle (schemeId: number, mesocycle: IMesocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PostMesocycle(schemeId, mesocycle));
    }

    /**
     * Изменить мезоцикл в схеме периодизации
     * @param schemeId
     * @param mesocycle
     * @returns {Promise<any>}
     */
    putMesocycle (schemeId: number, mesocycle: IMesocycle): Promise<IRevisionResponse> {
        return this.socket.send(new PutMesocycle(schemeId, mesocycle));
    }

    /**
     * Удалить мезоцикл в схеме периодизации
     * @param schemeId
     * @param mesocycleId
     * @returns {Promise<any>}
     */
    deleteMesocycle (schemeId: number, mesocycleId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteMesocycle(schemeId, mesocycleId));
    }

}