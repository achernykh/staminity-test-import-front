import { SocketService } from "../core";
import {
    PostTrainingPlan, PutTrainingPlan, SearchTrainingPlan,
    ITrainingPlan, ITrainingPlanSearchResult, ITrainingPlanSearchRequest
} from "../../../api/trainingPlans";
import { IWSResponse } from "@api/core";
import { IRevisionResponse } from "../../../api/core/core";

export class TrainingPlansService {

    static $inject = [ 'SocketService' ];

    constructor (private socket: SocketService) {

    }

    search (request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.socket.send(new SearchTrainingPlan(request));
    }

    post (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

    put (plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutTrainingPlan(plan));
    }

}