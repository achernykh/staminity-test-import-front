import {IActivityHeader, IActivityType, IActivityIntervals} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {copy} from 'angular';

export class ActivityHeader implements IActivityHeader {

    public startTimestamp: Date = new Date();
    public activityCategory: IActivityCategory = { // категория тренировки
        id: null,
        revision: null,
        code: null,
        activityTypeId: null,
        sortOrder: null
    };
    public activityType: IActivityType = { //вид спорта
        id: null,
        code: null,
        typeBasic: null
    };
    public intervals: Array<IActivityIntervals> = [];

    constructor(header?: IActivityHeader){
        this.startTimestamp = new Date();
        Object.assign(this, header || {});

    }
}