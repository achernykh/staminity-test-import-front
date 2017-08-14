import {IActivityIntervalW, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalW extends ActivityInterval implements IActivityIntervalW {

    actualDataIsImported: boolean; // признак загрузки фактических данных с устройства
    calcMeasures: ICalcMeasures; // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }

    /**
     * @description Проверка тренировки на выполнение
     * @returns {boolean}
     */
    completed():boolean {
        let measure: Array<string> = ['duration','movingDuration','distance'];
        return measure.some(m => this.calcMeasures[m].hasOwnProperty('value') && this.calcMeasures[m].value);
    }
}