import {IActivityInterval} from "../../../../api/activity/activity.interface";
/**
 * Базовый класс для инетрвала, содержит общее параметры
 */
export class ActivityInterval implements IActivityInterval {

    public startTimestamp: number;
    public endTimestamp: number;
    public pos: number; //позиция интервала в перечне (используем для интервала P)

    constructor(public type: string, public params?: any) {
        Object.assign(this, params);
    }

    public update(params: Object) {
        Object.assign(this, params);
    }
}
