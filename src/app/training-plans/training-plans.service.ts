import { ISocketService } from "../core/socket.service";
import { PostTrainingPlan, SearchTrainingPlan } from "../../../api/trainingPlans/training-plans.request";
import {
    ITrainingPlan,
    ITrainingPlanSearchResult,
    ITrainingPlanSearchRequest
} from "../../../api/trainingPlans/training-plans.interface";
import { IWSResponse } from "../../../api/core";

export class TrainingPlansService {

    static $inject = ['SocketService'];

    constructor (private socket: ISocketService) {

    }

    search (request: ITrainingPlanSearchRequest): Promise<ITrainingPlanSearchResult> {
        return this.socket.send(new SearchTrainingPlan(request));
    }

    post (plan: ITrainingPlan): Promise<IWSResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

}