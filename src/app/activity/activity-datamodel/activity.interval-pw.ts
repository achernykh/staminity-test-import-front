import {IActivityIntervalPW, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityIntervalP} from "./activity.interval-p";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalPW extends ActivityIntervalP implements IActivityIntervalPW {

    trainersPrescription: string;
    calcMeasures: ICalcMeasures = new ActivityIntervalCalcMeasure();
    movingDurationApprox: boolean; // временя рассчитано приблизительно
    distanceApprox: boolean; // дистанция рассчитана приблизительно

    constructor(type: string, params: any) {
        super(type, params);
    }
}