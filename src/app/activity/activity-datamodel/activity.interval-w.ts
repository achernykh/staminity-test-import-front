import {IActivityIntervalW, ICalcMeasures, IActivityIntervalPW} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalW extends ActivityInterval implements IActivityIntervalW {

    actualDataIsImported: boolean; // признак загрузки фактических данных с устройства
    calcMeasures: ICalcMeasures; // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }

    update(params: Object) {
        Object.assign(this, params);
    }

    clear(keys?: Array<string>):IActivityIntervalW{
        let interval: IActivityIntervalW = Object.assign({}, this);
        let params: Array<string> = keys || ['params', ...Object.keys(this.calcMeasures)];
        //Object.keys(this).map(k => api.indexOf(k) === -1 && delete this[k]);
        params.map(p => interval.hasOwnProperty(p) && delete interval[p]);
        return interval;
    }

    movingDuration():number {
        return this.calcMeasures.hasOwnProperty('movingDuration') &&
            this.calcMeasures.movingDuration.hasOwnProperty('value') &&
            this.calcMeasures.movingDuration.value;
    }

    distance():number {
        return this.calcMeasures.hasOwnProperty('distance') &&
            this.calcMeasures.distance.hasOwnProperty('value') &&
            this.calcMeasures.distance.value;
    }

    /**
     * @description Проверка тренировки на выполнение
     * @returns {boolean}
     */
    get isCompleted ():boolean {
        let measure: Array<string> = ['duration','movingDuration','distance'];
        return measure.some(m => this.calcMeasures[m].hasOwnProperty('value') && this.calcMeasures[m].value);
    }

    // TODO надо продумать алгоритм перевода фактических итогов плановый интервал
    toTemplate(): IActivityIntervalPW {
        return Object.assign(this.clear(), {
            type: 'pW'
        }, {

        });
    }
}