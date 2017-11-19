import { SocketService } from "../core";
import { IRevisionResponse } from "@api/core";
import {
    PostPeriodizationScheme,
    PutPeriodizationScheme,
    DeletePeriodizationScheme,
    IPeriodizationScheme
} from "../../../api/seasonPlanning";

export class SeasonPlanService {
    static $inject = ['SocketService'];

    constructor (private socket: SocketService) {}

    postScheme (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PostPeriodizationScheme((scheme)));
    }

    putScheme (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new PutPeriodizationScheme((scheme)));
    }

    deleteScheme (scheme: IPeriodizationScheme): Promise<IRevisionResponse> {
        return this.socket.send(new DeletePeriodizationScheme((scheme)));
    }

}