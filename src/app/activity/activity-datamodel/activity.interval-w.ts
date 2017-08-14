import {IActivityIntervalW, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalW extends ActivityInterval implements IActivityIntervalW {

    actualDataIsImported: boolean; // признак загрузки фактических данных с устройства
    calcMeasures: ICalcMeasures = new ActivityIntervalCalcMeasure(); // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
    }
}