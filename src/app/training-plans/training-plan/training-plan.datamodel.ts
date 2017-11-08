import {
    ITrainingPlan,
    ITrainingPlanReview,
    TrainingPlanSearchResultItem, TrainingPlanSearchResultAuthor
} from "../../../../api/trainingPlans/training-plans.interface";
import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IChart } from "../../../../api/statistics/statistics.interface";
import { IUserProfileShort } from "../../../../api/user/user.interface";

export class TrainingPlan implements ITrainingPlan {

    id: number;
    revision?: number;
    isPublic: boolean; // Тип плана: false - для внутреннего использования, true - для продажи
    status: string; // [D]raft/[P]ublished/[A]pplied
    name: string;
    description: string; // описание
    lang: string;
    keywords: Array<string>;
    tags: Array<string>; // спец-е теги для классификации признаков, выставленных плану.
    distances: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по дистанциям в разрезе базовых видов спорта
    durations: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по времени тренировок в разрезе базовых видов спорта
    type: string; // [T]riathon, [R]un, [B]ike, [S]wim, [O]ther
    distanceType: string;
    icon: string; // абсолютный путь к аватарке (url)
    background?: string; // абсолютный путь к фоновому изображению (url)
    club: Array<any>; // club profile
    author: Array<any>; // профиль создателя, если club is null
    price: number;
    currency: string;
    isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    propagateMods: boolean; // правки плана распространяются всем приобретателям
    regularWeek?: string; // типовая неделя
    isStructured?: boolean; // имеются структурированные тренировки default = false
    weekCount: number; // кол-во тренировочных недель
    samples: Array<ICalendarItem>; // примеры тренировок
    effortStat: Array<IChart>; // статистика нагрузки по плану
    reviews: Array<ITrainingPlanReview>; // массив отзывов
    calendarItems?: Array<ICalendarItem>; // массив событий календаря
    startDate?: Date; // дата первой тренировки, если isFixedCalendarDates = true
    event: [string /*code*/, string /*date*/]; // план связан с конкретным спортивным событием

    private authorProfile: IUserProfileShort = {
        userId: null,
        revision: null,
        public: {}
    };
    private keys: Array<string> = ['keys','authorProfile'];

    constructor (params?: Object | ITrainingPlan | Array<any>) {

        if ( Array.isArray(params) ) {
            Object.keys(new TrainingPlanSearchResultItem()).map((k: string, i: number) => this[k] = params[i]);

            if (this.author) {
                Object.keys(new TrainingPlanSearchResultAuthor()).map((k: string, i: number) => {
                    if (['userId','revision'].indexOf(k) !== -1) {
                        this.authorProfile[k] = this.author[i];
                    } else {
                        this.authorProfile.public[k] = this.author[i];
                    }
                });
            }

        } else {
            Object.assign(this, params);
        }

        // 1. Предустанавливаем тип плана на приватный (для собственного использования)
        if ( this.isPublic === undefined ) {
            this.isPublic = false;
        }
    }

    clear (keys: Array<string> = this.keys): ITrainingPlan {
        keys.map(p => delete this[p]);
        return <ITrainingPlan>this;
    }

}