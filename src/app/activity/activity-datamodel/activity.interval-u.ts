import {ActivityInterval} from "./activity.interval";
import {IActivityIntervalU, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalU extends ActivityInterval implements IActivityIntervalU {
    calcMeasures: ICalcMeasures;

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }
}