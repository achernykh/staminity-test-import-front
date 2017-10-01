import {
    ITrainingPlan, ITrainingPlanReview,
    ITrainingPlanSearchResult
} from "../../../../api/trainingPlans/training-plans.interface";
import {IGroupProfileShort} from "../../../../api/group/group.interface";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";

export class TrainingPlan implements ITrainingPlan {

    id?: number;
    revision?: number;
    isPublic: boolean; // Тип плана: для внутреннего использования, для продажи
    status: string; // [D]raft/[P]ublished/[S]old
    name: string;
    description: string; // описание
    lang: string;
    keywords: Array<string> = [];
    icon: string; // абсолютный путь к аватарке (url)
    background: string; // абсолютный путь к фоновому изображению (url)
    club?: IGroupProfileShort; // club profile
    author?: IUserProfileShort; // профиль создателя, если club is null
    price:number;
    currency: string;
    isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    isFlexibleSchedule: boolean; // правки плана распространяются всем приобретателям
    regularWeek: string; // типовая неделя
    isStructured: boolean; // имеются структурированные тренировки
    weekCount: number; // кол-во тренировочных недель
    samples?: Array<ICalendarItem>; // примеры тренировок
    //statistics: Array<IChart>; // статистика по плану (данные для графиков)
    reviews?: Array<ITrainingPlanReview>; // массив отзывов
    calendarItems?: Array<ICalendarItem> = []; // массив событий календаря
    startDate?: Date; // дата первой тренировки, если isFixedCalendarDates = true

    private keys: Array<string> = [];

    constructor(params?: Object | ITrainingPlan | ITrainingPlanSearchResult) {
        Object.assign(this, params);

        // 1. Предустанавливаем тип плана на приватный (для собственного использования)
        if(this.isPublic === undefined) {
            this.isPublic = false;
        }
    }

    clear(keys: Array<string> = this.keys): ITrainingPlan {
        keys.map(p => delete this[p]);
        return <ITrainingPlan>this;
    }

}