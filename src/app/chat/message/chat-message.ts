import { IUserProfilePublic } from "@api/user";
import { IGroupProfileShort } from "@api/group";
import * as moment from 'moment/min/moment-with-locales.js';

export class ChatMessage {
    text: string;
    ts: Date;
    author: IUserProfilePublic | IGroupProfileShort;
    isMe: boolean;

    constructor (obj: any) {
        Object.assign(this, obj);
    }

    date (date) {
        return moment.utc(date).format("DD MMM HH:mm");
    }

}