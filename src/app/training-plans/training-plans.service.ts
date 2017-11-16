import { SocketService } from "../core";
import {
    PostTrainingPlan, PutTrainingPlan, SearchTrainingPlan,
    ITrainingPlan, ITrainingPlanSearchResult, ITrainingPlanSearchRequest
} from "../../../api/trainingPlans";
import { IWSResponse } from "@api/core";
import { IRevisionResponse } from "../../../api/core/core";
import { DeleteTrainingPlan } from "../../../api/trainingPlans/training-plans.request";

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

    delete (planId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteTrainingPlan(planId));
    }

}