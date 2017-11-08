import {ITrainingPlanSearchResult} from "../../../../api/trainingPlans/training-plans.interface";
import {TrainingPlan} from "../training-plan/training-plan.datamodel";
interface ITrainingPlans {

};

export class TrainingPlansList implements ITrainingPlans{

    list: Array<TrainingPlan> = [];

    constructor(list?: Array<Array<any>>) {
        if(list) {
           list.map(r => this.list.push(new TrainingPlan(r)));
        }
    }
};