import { SocketService} from '../socket/socket.service';
import {
    GetComment, PostComment, PutComment,
    DeleteComment
} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";
import {Observable, Subject} from "rxjs/Rx";
import { ChatSession } from './comment.interface';
import { Injectable } from "@angular/core";

@Injectable()
export class CommentService {

    public comment$: Observable<any>;
    public openChat$: Subject<ChatSession>;

    constructor(private socket: SocketService) {

        this.comment$ = this.socket.messages
            .filter(message => message.type === 'objectComment')
            .share();

        this.openChat$ = new Subject();
    }

    /**
     *
     * @param type
     * @param id
     * @param limit
     * @param offset
     * @returns {Promise<any>}
     */
    get(type: string, id: number, coach: boolean = false, limit?: number, offset?: number):Promise<Array<IObjectComment>> {
        return this.socket.send(new GetComment(type,id,coach,limit,offset));
    }

    /**
     *
     * @param type
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    post(type: string, id: number, coach: boolean = false, text: string):Promise<any> {
        return this.socket.send(new PostComment(type,id,coach,text));
    }

    /**
     *
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    put(id: number, text: string):Promise<any> {
        return this.socket.send(new PutComment(id,text));
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    delete(id: number):Promise<any> {
        return this.socket.send(new DeleteComment(id));
    }

}