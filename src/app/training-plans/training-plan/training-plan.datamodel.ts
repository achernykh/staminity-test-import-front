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

    public id: number;
    public revision?: number;
    public isPublic: boolean; // Тип плана: false - для внутреннего использования, true - для продажи
    public status: string; // [D]raft/[P]ublished/[A]pplied
    public name: string;
    public description: string; // описание
    public lang: string;
    public keywords: string[];
    public tags: string[]; // спец-е теги для классификации признаков, выставленных плану.
    public distances: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по дистанциям в разрезе базовых видов спорта
    public durations: [number /*run*/, number /*bike*/, number /*swim*/, number /*other*/]; // итоги по времени тренировок в разрезе базовых видов спорта
    public type: string; // [T]riathon, [R]un, [B]ike, [S]wim, [O]ther
    public distanceType: string;
    public icon: string; // абсолютный путь к аватарке (url)
    public background?: string; // абсолютный путь к фоновому изображению (url)
    public club: any[]; // club profile
    public author: any[]; // профиль создателя, если club is null
    public price: number;
    public currency: string;
    public isFixedCalendarDates: boolean; // тренировки жестко привязаны к датам
    public propagateMods: boolean; // правки плана распространяются всем приобретателям
    public regularWeek?: string; // типовая неделя
    public isStructured?: boolean; // имеются структурированные тренировки default = false
    public weekCount: number; // кол-во тренировочных недель
    public samples: ICalendarItem[]; // примеры тренировок
    public effortStat: IChart[]; // статистика нагрузки по плану
    public reviews: ITrainingPlanReview[]; // массив отзывов
    public calendarItems?: ICalendarItem[]; // массив событий календаря
    public startDate?: Date; // дата первой тренировки, если isFixedCalendarDates = true
    public event: [string /*code*/, string /*date*/]; // план связан с конкретным спортивным событием

    private authorProfile: IUserProfileShort;

    private keys: string[] = ["keys", "authorProfile"];

    constructor(params?: Object | ITrainingPlan | any[]) {

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

    public applyRevision(revision: IRevisionResponse): TrainingPlan {

        this.id = revision.value.id;
        this.revision = revision.value.revision;

        return this;

    }

    public prepareObjects(): TrainingPlan {
        this.prepareAuthorObject();
        return this;
    }

    private prepareAuthorObject(): void {

        this.authorProfile = {
            userId: null,
            revision: null,
            public: {},
        };

        Object.keys(new TrainingPlanSearchResultAuthor()).map((k: string, i: number) => {
            if (["userId", "revision"].indexOf(k) !== -1) {
                this.authorProfile[k] = this.author[i];
            } else {
                this.authorProfile.public[k] = this.author[i];
            }
        });
    }

    private prepareDefaultData(): void {
        if (!this.lang) { this.lang = "ru"; }
        if (!this.tags) { this.tags = []; }
        if (!this.keywords) {this.keywords = []; }
    }

    public clear(keys: string[] = this.keys): ITrainingPlan {
        keys.map((p) => delete this[p]);
        return this as ITrainingPlan;
    }

}
