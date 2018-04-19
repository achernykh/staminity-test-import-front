import {IActivityHeader, IActivityType, IActivityIntervals} from "../../../../api/activity/activity.interface";
import {IActivityCategory, IActivityTemplate} from "../../../../api/reference/reference.interface";
import {copy} from 'angular';
import { getType } from "../activity.constants";

export class ActivityHeader implements IActivityHeader {

    activityId: number;
    startTimestamp: Date = new Date();
    activityCategory: IActivityCategory = { // категория тренировки
        id: null,
        revision: null,
        code: null,
        activityTypeId: null,
        sortOrder: null
    };
    activityType: IActivityType = { //вид спорта
        id: null,
        code: null,
        typeBasic: null
    };
    intervals: Array<IActivityIntervals> = [];
    templateId: number;
    initStartDate?: string; // номер позиции этапа в рамках соревнования

    // Вспомогательные поля фронт-енд
    public template: IActivityTemplate;

    constructor(header?: IActivityHeader){
        this.startTimestamp = new Date();
        Object.assign(this, header || {});
    }

    get id(): number {
        return this.activityId;
    }

    get sport() {
        return this.activityType.id;
    }

    set sport(id) {
        this.activityType = getType(Number(id));
    }

    get sportBasic(){
        return this.activityType.typeBasic;
    }

    get sportUrl() {
        return `assets/icon/${this.activityType.code || 'default_sport'}.svg`;
    }

    get category(): IActivityCategory {
        return this.hasOwnProperty('activityCategory') && this.activityCategory;
    }

    set category (c: IActivityCategory) {
        this.activityCategory = c;
    }

    get categoryCode():string {
        return (this.activityCategory && this.activityCategory.hasOwnProperty('code'))
            && this.activityCategory.code;
    }


    build():IActivityHeader{
        this.templateId = (this.template && this.template.id) || null;
        return this.clear();
    }

    clear():IActivityHeader {
        ['template'].map(p => delete this[p]);
        return <IActivityHeader>this;
    }
}