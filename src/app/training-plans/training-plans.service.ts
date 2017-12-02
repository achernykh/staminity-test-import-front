import { IWSResponse } from "@api/core";
import { IRevisionResponse } from "../../../api/core/core";
import {
    ITrainingPlan, ITrainingPlanSearchRequest, ITrainingPlanSearchResult,
    PostTrainingPlan, PutTrainingPlan, SearchTrainingPlan,
} from "../../../api/trainingPlans";
import { DeleteTrainingPlan } from "../../../api/trainingPlans/training-plans.request";
import { SocketService } from "../core";

export class TrainingPlansService {

    public static $inject = [ "SocketService" ];

    constructor(private socket: SocketService) {

    }

    public search(request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.socket.send(new SearchTrainingPlan(request));
    }

    public post(plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

    public put(plan: ITrainingPlan): Promise<IRevisionResponse> {
        return this.socket.send(new PutTrainingPlan(plan));
    }

    public delete(planId: number): Promise<IWSResponse> {
        return this.socket.send(new DeleteTrainingPlan(planId));
    }

}
