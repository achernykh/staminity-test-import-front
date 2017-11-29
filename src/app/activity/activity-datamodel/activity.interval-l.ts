import {IActivityIntervalL, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ICalcMeasure} from "../components/segment-chart/segmentsChart.input";
import {ActivityInterval} from "./activity.interval";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalL extends ActivityInterval implements IActivityIntervalL {

    calcMeasures: ICalcMeasures; // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }
}