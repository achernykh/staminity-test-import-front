import {copy} from "angular";
import {IActivityHeader, IActivityIntervals, IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory, IActivityTemplate} from "../../../../api/reference/reference.interface";

export class ActivityHeader implements IActivityHeader {

    activityId: number;
    startTimestamp: Date = new Date();
    activityCategory: IActivityCategory = { // категория тренировки
        id: null,
        revision: null,
        code: null,
        activityTypeId: null,
        sortOrder: null,
    };
    activityType: IActivityType = { //вид спорта
        id: null,
        code: null,
        typeBasic: null,
    };
    intervals: IActivityIntervals[] = [];
    templateId: number;

    // Вспомогательные поля фронт-енд
    template: IActivityTemplate;

    constructor(header?: IActivityHeader) {
        this.startTimestamp = new Date();
        Object.assign(this, header || {});
    }

    build(): IActivityHeader {
        this.templateId = (this.template && this.template.id) || null;
        return this.clear();
    }

    clear(): IActivityHeader {
        const params: string[] = ["template"];
        params.map((p) => delete this[p]);
        return this as IActivityHeader;
    }
}
