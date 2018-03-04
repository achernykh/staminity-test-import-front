import './chat.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { ChatOptions } from "./chat.interface";
import { ChatRoom } from "@app/chat/room/chat-room";

class ChatCtrl implements IComponentController {

    // public
    public options: ChatOptions;
    public currentRoom: ChatRoom;
    public onEvent: (response: Object) => Promise<void>;

    // private
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    set room (value: ChatRoom) {
        this.currentRoom = value;
    }

    get room (): ChatRoom {
        return this.currentRoom;
    }

    get isRoomState (): boolean {
        return !!this.currentRoom;
    }
}

export const ChatComponent:IComponentOptions = {
    bindings: {
        options: '<',
        currentRoom: '<',
        onClose: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ChatCtrl,
    template: require('./chat.component.html') as string
};