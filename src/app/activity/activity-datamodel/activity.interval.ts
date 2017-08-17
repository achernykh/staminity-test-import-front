import {IActivityInterval} from "../../../../api/activity/activity.interface";
/**
 * Базовый класс для инетрвала, содержит общее параметры
 */
export class ActivityInterval implements IActivityInterval{

    parentGroup: string;
    startTimestamp: number;
    endTimestamp: number;
    pos: number; //позиция интервала в перечне (используем для интервала P)

    constructor(public type: string, private params?: any) {
        Object.assign(this, params);
    }
}