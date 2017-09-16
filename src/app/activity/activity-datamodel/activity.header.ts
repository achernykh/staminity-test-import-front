import {IActivityHeader, IActivityType, IActivityIntervals} from "../../../../api/activity/activity.interface";
import {IActivityCategory, IActivityTemplate} from "../../../../api/reference/reference.interface";
import {copy} from 'angular';

export class ActivityHeader implements IActivityHeader {

    public activityId: number;
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
    public templateId: number;

    // Вспомогательные поля фронт-енд
    public template: IActivityTemplate;

    constructor(header?: IActivityHeader){
        this.startTimestamp = new Date();
        Object.assign(this, header || {});
    }

    build():IActivityHeader{
        this.templateId = (this.template && this.template.id) || null;
        return this.clear();
    }

    clear():IActivityHeader {
        let params: Array<string> = ['template'];
        params.map(p => delete this[p]);
        return <IActivityHeader>this;
    }
}