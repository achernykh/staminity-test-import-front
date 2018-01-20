import {copy} from "angular";
import {IActivityIntervalG, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {genHash} from "../../share/utils-function";
import {ActivityInterval} from "./activity.interval";
/**
 * Интервал типа Группа
 */
export class ActivityIntervalG extends ActivityInterval implements IActivityIntervalG {

    code: string;
    repeatCount: number; //количество повторов сегментов
    calcMeasures: ICalcMeasures;
    totalMeasures: ICalcMeasures[];
    grpLength: number; // количество сегментов в группе
    fPos: number; // intervalP.pos первого сегмента в группе

    hasRecalculate: boolean = false;
    keys: string[] = ["params", "calcMeasures", "totalMeasures", "hasRecalculate", "keys"];

    constructor(type: string, params: any) {
        super(type, params);
        this.code = this.code || `${genHash(6)}`; //`${genHash(6)}-${genHash(4)}-${genHash(4)}-${genHash(4)}-${genHash(12)}`;
    }

    clear(keys: string[] = this.keys): IActivityIntervalG {
        let interval: IActivityIntervalG = Object.assign({}, this);
        if (this.hasRecalculate) {
            ["totalMeasures"].map((key) => this.keys.splice(this.keys.indexOf(key), 1));
        }
        keys.map((p) => interval.hasOwnProperty(p) && delete interval[p]);
        return interval;
    }

    /**
    * @description Подготавливаем инетрвал для перерасчета на стороне бэка
    * @returns {IActivityIntervalP}
    */
    prepareForCalculateRange(): IActivityIntervalG {
        const interval: IActivityIntervalG = copy(this);
        this.keys.map((p) => delete interval[p]);
        this.hasRecalculate = true;

        interval.startTimestamp = null;
        interval.endTimestamp = null;

        return interval;
    }

}
