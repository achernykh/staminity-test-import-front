import './chat-list.component.scss';
import { InitiatorType } from "../../../../api/notification";
import {IComponentOptions, IComponentController} from 'angular';
import { ChatRoom } from "../room/chat-room";

class ChatListCtrl implements IComponentController {

    // public
    public data: any;
    public onSelectRoom: (response: {room: ChatRoom}) => Promise<void>;

    // private
    private rooms: Array<ChatRoom> = [];
    static $inject = [];

    constructor() {

    }

    $onInit() {
        let room = {
            type: InitiatorType.user,
            companion: {
                userId: 12,
                public: {
                    firstName: 'Petr',
                    lastName: 'Vasechkin',
                    avatar: 'f58e10f9-d560-4a9e-aeb2-12108b32d4b5.jpg',
                }
            },
            lastMessage: {
                ts: new Date(),
                text: 'Длинная переписка по поводу и без повода, по тренировкам и по питанию. Всякая писанина о том и об этом. Длинная переписка по поводу и без повода, по тренировкам и по питанию. Всякая писанина о том и об этом',
            }
        }
        this.rooms.push(new ChatRoom(room));
        this.rooms.push(new ChatRoom(room));
        this.rooms.push(new ChatRoom(room));
        this.rooms.push(new ChatRoom(room));
    }

}

export const ChatListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onClose: '&',
        onSelectRoom: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ChatListCtrl,
    template: require('./chat-list.component.html') as string
};