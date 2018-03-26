// Ответ в случае поископ по пользователям/тренерам
import {InitiatorType} from "../../../api/notification/notification.interface";
import {IUserProfilePublic} from "@api/user";
import { image, userName } from "../share/share.module";

export class SearchResultByUser {
    userId: number = null;
    public: IUserProfilePublic = null;
    private: any = null;
    //name: string = null;
    athleteCount: number;

    constructor(result: any[]) {
        [this.userId, this.public, this.private, this.athleteCount] = result;
        //this.name = `${this.public.lastName} ${this.public.firstName}`;
    }

    get name (): string {
        return userName()(this, 'full');
    }

    get icon(): string {
        return this.public && this.public.avatar && image()('/user/avatar/', this.public.avatar) || null;
    }

    get city (): string {
        return this.private.city;
    }

    get country (): string {
        return this.private.country;
    }

    get about (): string {
        return this.private.about;
    }

    get activity () {
        return this.private.activity;
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

    type: number = InitiatorType.club;

    constructor(result: any[]) {
        [this.groupId, this.avatar, this.city, this.activityTypes,
            this.memberCount, this.coachCount, this.athleteCount,  this.name, this.about, this.groupUri] = result;
    }

    get icon(): string {
        return this.avatar && image()('/group/avatar/', this.avatar) || null;
    }

    get activity () {
        return this.activityTypes;
    }
}