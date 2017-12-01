import { ICalendarItem } from "../../../../api/calendar/calendar.interface";
import { IRevisionResponse } from "../../../../api/core/core";
import { IChart } from "../../../../api/statistics/statistics.interface";
import {
    ITrainingPlan,
    ITrainingPlanReview,
    TrainingPlanSearchResultAuthor, TrainingPlanSearchResultItem,
} from "../../../../api/trainingPlans/training-plans.interface";
import { IUserProfileShort } from "../../../../api/user/user.interface";

export class TrainingPlan implements ITrainingPlan {

    id: number;
    revision?: number;
    isPublic: boolean; // Тип плана: false - для внутреннего использования, true - для продажи
    status: string; // [D]raft/[P]ublished/[A]pplied
    name: string;
    description: string; // описание
    lang: string;
    keywords: string[];
    tags: string[]; // спец-е теги для классификации признаков, выставленных плану.
    distances: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по дистанциям в разрезе базовых видов спорта
    durations: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по времени тренировок в разрезе базовых видов спорта
    type: string; // [T]riathon, [R]un, [B]ike, [S]wim, [O]ther
    distanceType: string;
    icon: string; // абсолютный путь к аватарке (url)
    background?: string; // абсолютный путь к фоновому изображению (url)
    club: any[]; // club profile
    author: any[]; // профиль создателя, если club is null
    price: number;
    currency: string;
    isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    propagateMods: boolean; // правки плана распространяются всем приобретателям
    regularWeek?: string; // типовая неделя
    isStructured?: boolean; // имеются структурированные тренировки default = false
    weekCount: number; // кол-во тренировочных недель
    samples: ICalendarItem[]; // примеры тренировок
    effortStat: IChart[]; // статистика нагрузки по плану
    reviews: ITrainingPlanReview[]; // массив отзывов
    calendarItems?: ICalendarItem[]; // массив событий календаря
    startDate?: Date; // дата первой тренировки, если isFixedCalendarDates = true
    event: [string /*code*/, string /*date*/]; // план связан с конкретным спортивным событием


    private authorProfile: IUserProfileShort;

    private keys: string[] = ["keys", "authorProfile"];

    constructor (params?: Object | ITrainingPlan | any[]) {

        if ( Array.isArray(params) ) {
            Object.keys(new TrainingPlanSearchResultItem()).map((k: string, i: number) => this[k] = params[i]);
        } else {
            Object.assign(this, params);
        }

        // 1. Предустанавливаем тип плана на приватный (для собственного использования)
        if ( this.isPublic === undefined ) {
            this.isPublic = false;
        }

        this.prepareDefaultData();
        this.prepareObjects();

    }

    applyRevision (revision: IRevisionResponse): TrainingPlan {

        this.id = revision.value.id;
        this.revision = revision.value.revision;

        return this;

    }

    prepareObjects (): TrainingPlan {
        this.prepareAuthorObject();
        return this;
    }

    private prepareAuthorObject (): void {

        this.authorProfile = {
            userId: null,
            revision: null,
            public: {},
        };

        Object.keys(new TrainingPlanSearchResultAuthor()).map((k: string, i: number) => {
            if (["userId","revision"].indexOf(k) !== -1) {
                this.authorProfile[k] = this.author[i];
            } else {
                this.authorProfile.public[k] = this.author[i];
            }
        });
    }

    private prepareDefaultData (): void {
        if (!this.lang) { this.lang = "ru"; }
        if (!this.tags) { this.tags = []; }
        if (!this.keywords) {this.keywords = [];}
    }

    clear (keys: string[] = this.keys): ITrainingPlan {
        keys.map((p) => delete this[p]);
        return <ITrainingPlan>this;
    }

}