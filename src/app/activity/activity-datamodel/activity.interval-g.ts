import {IActivityIntervalG, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {genHash} from "../../share/utils-function";

/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG{

    code: string;
    repeatCount: number;
    calcMeasures: ICalcMeasures;

    constructor(type: string, params: any){
        super(type, params);
        this.code = `${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }
}