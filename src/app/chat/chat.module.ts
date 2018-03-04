import {module} from 'angular';
import { ChatListComponent } from "./list/chat-list.component";
import { ChatMessageComponent } from "./message/chat-message.component";
import { ChatRoomComponent } from "./room/chat-room.component";
import { ChatComponent } from "./chat.component";
import { ChatDialogService } from "./chat-dialog.service";

export const Chat = module('staminity.chat', [])
    .component('stChat', ChatComponent)
    .component('stChatList', ChatListComponent)
    .component('stChatMessage', ChatMessageComponent)
    .component('stChatRoom', ChatRoomComponent)
    .service('ChatDialog', ChatDialogService)
    .name;