import {ISocketService} from './socket.service';
import {
    GetComment, PostComment, PutComment,
    DeleteComment
} from "../../../api/social/comment.request";
import {IObjectComment} from "../../../api/social/comment.interface";
import {Observable, Subject} from "rxjs/Rx";

interface OpenChat {
    type: string;
    id: string;
};

export default class CommentService {
    comment$: Observable<any>;
    openChat$: Subject<OpenChat>;
    static $inject = ['SocketService'];

    constructor(private SocketService:ISocketService) {
        this.comment$ = this.SocketService.messages.filter(message => message.type === 'objectComment').share();
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
        return this.SocketService.send(new GetComment(type,id,coach,limit,offset));
    }

    /**
     *
     * @param type
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    post(type: string, id: number, coach: boolean = false, text: string):Promise<any> {
        return this.SocketService.send(new PostComment(type,id,coach,text));
    }

    /**
     *
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    put(id: number, text: string):Promise<any> {
        return this.SocketService.send(new PutComment(id,text));
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    delete(id: number):Promise<any> {
        return this.SocketService.send(new DeleteComment(id));
    }

}