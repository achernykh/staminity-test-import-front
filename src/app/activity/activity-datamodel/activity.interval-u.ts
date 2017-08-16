import {ActivityInterval} from "./activity.interval";
import {IActivityIntervalU} from "../../../../api/activity/activity.interface";
import {ICalcMeasure} from "../components/segment-chart/segmentsChart.input";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalU extends ActivityInterval implements IActivityIntervalU {
    calcMeasures: ICalcMeasure;

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }
}