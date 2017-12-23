import {ITrainingPlanSearchResult} from "../../../../api/trainingPlans/training-plans.interface";
import {TrainingPlan} from "../training-plan/training-plan.datamodel";
interface ITrainingPlans {

};

export class TrainingPlansList implements ITrainingPlans {

    list: TrainingPlan[] = [];

    constructor(list?: any[][]) {
        if (list) {
           list.map((r) => this.list.push(new TrainingPlan(r)));
        }
    }

    push(plan: TrainingPlan): void {
        this.list.push(plan);
    }

    put(plan: TrainingPlan): void {
        const id: number = this.list.findIndex((p) => p.id === plan.id);

        if (id !== -1) {
            this.list[id] = plan;
        }
    }

    delete(planId: number): void {
        const id: number = this.list.findIndex((p) => p.id === planId);

        if (id !== -1) {
            this.list.splice(id, 1);
        }
    }
};
