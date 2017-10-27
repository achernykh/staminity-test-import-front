import {ISocketService} from "../core/socket.service";
import {PostTrainingPlan} from "../../../api/trainingPlans/training-plans.request";
import {ITrainingPlan} from "../../../api/trainingPlans/training-plans.interface";
import {IWSResponse} from "../../../api/core";

export class TrainingPlansService {

    static $inject = ['SocketService'];

    constructor(private socket: ISocketService) {

    }

    post(plan: ITrainingPlan):Promise<IWSResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

}