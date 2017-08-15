import {IActivityIntervalG, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {genHash} from "../../share/utils-function";

/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG{

    code: string;
    repeatCount: number; //количество повторов сегментов
    length: number; //длина сегментам в интервалах
    calcMeasures: ICalcMeasures;

    constructor(type: string, params: any){
        super(type, params);
        this.code = this.code || `${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }

    clear():IActivityIntervalG{
        let params: Array<string> = ['params'];
        params.map(p => delete this[p]);
        return <IActivityIntervalG>this;
    }
}