import { SocketService } from "../core";
import { IWSResponse, ITrainingPlan, PostTrainingPlan } from "../../../api";

export class TrainingPlansService {

    static $inject = ['SocketService'];

    constructor (private socket: SocketService) {}

    post (plan: ITrainingPlan): Promise<IWSResponse> {
        return this.socket.send(new PostTrainingPlan(plan));
    }

}