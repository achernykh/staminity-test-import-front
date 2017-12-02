import {IActivityIntervalPW, IActivityIntervalW, ICalcMeasures} from "../../../../api/activity/activity.interface";
import {ActivityInterval} from "./activity.interval";
import {ActivityIntervalCalcMeasure} from "./activity.models";

export class ActivityIntervalW extends ActivityInterval implements IActivityIntervalW {

    public actualDataIsImported: boolean; // признак загрузки фактических данных с устройства
    public calcMeasures: ICalcMeasures; // рассчитанные фактические показатели

    constructor(type: string, params: any) {
        super(type, params);
        this.calcMeasures = this.calcMeasures || new ActivityIntervalCalcMeasure();
    }

    public update(params: Object) {
        Object.assign(this, params);
    }

    public clear(): IActivityIntervalW {
        const params: string[] = ["params", ...Object.keys(this.calcMeasures)];
        //Object.keys(this).map(k => api.indexOf(k) === -1 && delete this[k]);
        params.map((p) => delete this[p]);
        return this as IActivityIntervalW;
    }

    public movingDuration(): number {
        return this.calcMeasures.hasOwnProperty("movingDuration") &&
            this.calcMeasures.movingDuration.hasOwnProperty("value") &&
            this.calcMeasures.movingDuration.value;
    }

    public distance(): number {
        return this.calcMeasures.hasOwnProperty("distance") &&
            this.calcMeasures.distance.hasOwnProperty("value") &&
            this.calcMeasures.distance.value;
    }

    /**
     * @description Проверка тренировки на выполнение
     * @returns {boolean}
     */
    public completed(): boolean {
        const measure: string[] = ["duration", "movingDuration", "distance"];
        return measure.some((m) => this.calcMeasures[m].hasOwnProperty("value") && this.calcMeasures[m].value);
    }

    // TODO надо продумать алгоритм перевода фактических итогов плановый интервал
    public toTemplate(): IActivityIntervalPW {
        return Object.assign(this.clear(), {
            type: "pW",
        }, {

        });
    }
}
