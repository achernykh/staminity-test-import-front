import * as moment from 'moment/min/moment-with-locales.js';
import { InitiatorType } from "@api/notification";
import { IUserProfileShort } from "@api/user";
import { IGroupProfileShort } from "@api/group";
type ChatRoomType = 'user' | 'group' | 'activity';

export class ChatRoom {
    type: InitiatorType;
    companion: IUserProfileShort | IGroupProfileShort;
    lastMessage: {
        text: string;
        ts: Date
    };

    constructor (param: any) {
        Object.assign(this, param);
    }

    get icon (): string {
        return (this.companion as IUserProfileShort).public.avatar;
    }

    get code (): string {
        return `${(this.companion as IUserProfileShort).public.firstName} ${(this.companion as IUserProfileShort).public.lastName}`;
    }

    lastMessageDateFromNow (date) {
        return moment.utc(date).fromNow(true);
    }
}