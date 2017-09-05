import {IActivityIntervalG, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {genHash} from "../../share/utils-function";

/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG{

    code: string;
    repeatCount: number; //количество повторов сегментов
    calcMeasures: ICalcMeasures;
    totalMeasures: Array<ICalcMeasures>;
    grpLength: number; // количество сегментов в группе
    fPos: number; // intervalP.pos первого сегмента в группе

    constructor(type: string, params: any){
        super(type, params);
        this.code = this.code || `${genHash(6)}`;//`${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }

    clear():IActivityIntervalG{
        ['params', 'calcMeasures', 'totalMeasures'].map(p => delete this[p]);
        return <IActivityIntervalG>this;
    }
}