import {copy} from "angular";
import {IActivityIntervalG, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {genHash} from "../../share/utils-function";
import {ActivityInterval} from "./activity.interval";
/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG {

    public code: string;
    public repeatCount: number; //количество повторов сегментов
    public calcMeasures: ICalcMeasures;
    public totalMeasures: ICalcMeasures[];
    public grpLength: number; // количество сегментов в группе
    public fPos: number; // intervalP.pos первого сегмента в группе

    public hasRecalculate: boolean = false;
    public keys: string[] = ["params", "calcMeasures", "totalMeasures", "hasRecalculate", "keys"];

    constructor(type: string, params: any) {
        super(type, params);
        this.code = this.code || `${genHash(6)}`; //`${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }

    public clear(keys: string[] = this.keys): IActivityIntervalG {
        if (this.hasRecalculate) {
            ["totalMeasures"].map((key) => this.keys.splice(this.keys.indexOf(key), 1));
        }
        keys.map((p) => delete this[p]);
        return this as IActivityIntervalG;
    }

    /**
    * @description Подготавливаем инетрвал для перерасчета на стороне бэка
    * @returns {IActivityIntervalP}
    */
    public prepareForCalculateRange(): IActivityIntervalG {
        const interval: IActivityIntervalG = copy(this);
        this.keys.map((p) => delete interval[p]);
        this.hasRecalculate = true;

        interval.startTimestamp = null;
        interval.endTimestamp = null;

        return interval;
    }

}
