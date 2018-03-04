import './chat-room.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { SessionService, profileShort } from "../../core";
import { ChatRoom } from "./chat-room";
import { ChatMessage } from "../message/chat-message";
import { IUserProfileShort } from "@api/user";

class ChatRoomCtrl implements IComponentController {

    // public
    public room: ChatRoom;
    public onEvent: (response: Object) => Promise<void>;

    // private
    private input: string;
    private currentAuthor: IUserProfileShort;
    private messages: Array<ChatMessage> = [];

    static $inject = ['SessionService'];

    constructor (private session: SessionService) {

    }

    $onInit() {
        this.currentAuthor = profileShort(this.session.getUser());
        this.messages.push(new ChatMessage({
            text: this.room.lastMessage.text,
            ts: this.room.lastMessage.ts,
            author: this.room.companion,
            isMe: false
        }))
    }

    post (): void {
        this.messages.push(new ChatMessage({
            text: this.input,
            ts: new Date(),
            author: this.currentAuthor,
            isMe: true
        }));
        this.input = null;
    }
}

export const ChatRoomComponent:IComponentOptions = {
    bindings: {
        room: '<',
        onBack: '&',
        onClose: '&'
    },
    require: {
        chatForm: '^stChat'
    },
    controller: ChatRoomCtrl,
    template: require('./chat-room.component.html') as string
};