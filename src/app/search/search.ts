// Ответ в случае поископ по пользователям/тренерам
import {InitiatorType} from "../../../api/notification/notification.interface";
import {IUserProfilePublic} from "@api/user";
import { fullImageUrl } from "../share/image/image.functions";
import { userName } from "../user/user.functions";

export class SearchResultByUser {
    userId: number = null;
    public: IUserProfilePublic = null;
    private: any = null;
    //name: string = null;
    athleteCount: number;
    coachLanguage: string[];

    constructor(result: any[]) {
        [this.userId, this.public, this.private, this.athleteCount, this.coachLanguage] = result;
        //this.name = `${this.public.lastName} ${this.public.firstName}`;
    }

    get name (): string {
        return userName()(this, 'full');
    }

    get icon(): string {
        return this.public && this.public.avatar && fullImageUrl()('/user/avatar/', this.public.avatar) || null;
    }

    get backgroundUrl (): string {
        return this.public && this.public.background && fullImageUrl()('/user/background/', this.public.background) || null;
    }

    get city (): string {
        return this.private && this.private.city;
    }

    get country (): string {
        return this.private && this.private.country;
    }

    get about (): string {
        return this.private && this.private.about;
    }

    get activity () {
        return this.private && this.private.activity;
    }

    get uri () {
        return this.public.uri;
    }

}

// Ответ поиск по клбуам/группам
export class SearchResultByGroup {
    groupId: number = null;
    avatar: string = null;
    city: string = null;
    activityTypes: string[] = [];
    memberCount: number = null;
    coachCount: number = null;
    athleteCount: number = null;
    name: string = null;
    about: string = null;
    groupUri: string = null;
    background: string = null;
    coachLanguage: string[] = [];

    type: number = InitiatorType.club;

    constructor(result: any[]) {
        [this.groupId, this.avatar, this.city, this.activityTypes,
            this.memberCount, this.coachCount, this.athleteCount,  this.name, this.about, this.groupUri,
            this.background, this.coachLanguage] = result;
    }

    get icon(): string {
        return this.avatar && fullImageUrl()('/group/avatar/', this.avatar) || null;
    }

    get backgroundUrl(): string {
        return this.background && fullImageUrl()('/group/background/', this.background) || null;
    }

    get activity () {
        return this.activityTypes;
    }

    get uri () {
        return this.groupUri;
    }
}