import './chat-message.component.scss';
import {IComponentOptions, IComponentController} from 'angular';
import { ChatMessage } from "@app/chat/message/chat-message";

class ChatMessageCtrl implements IComponentController {

    // public
    public message: ChatMessage;
    public onBack: () => Promise<void>;

    // private
    static $inject = [];

    constructor() {

    }

    $onInit() {

    }
}

export const ChatMessageComponent:IComponentOptions = {
    bindings: {
        message: '<',
        onBack: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ChatMessageCtrl,
    template: require('./chat-message.component.html') as string
};