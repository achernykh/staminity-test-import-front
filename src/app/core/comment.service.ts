import {Observable, Subject} from "rxjs/Rx";
import {
    DeleteCommentRequest,
    GetCommentRequest, IObjectComment, PostCommentRequest,
    PutCommentRequest,
} from "../../../api";
import {SocketService} from "./index";

export interface ChatSession {
    type: string;
    id: number;
}

export default class CommentService {

    public comment$: Observable<any>;
    public openChat$: Subject<ChatSession>;

    static $inject = ["SocketService"];

    constructor(private SocketService: SocketService) {
        this.comment$ = this.SocketService.messages.filter((message) => message.type === "objectComment").share();
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
    get(type: string, id: number, coach: boolean = false, limit?: number, offset?: number):Promise<IObjectComment[]> {
        return this.SocketService.send(new GetCommentRequest(type,id,coach,limit,offset));
    }

    /**
     *
     * @param type
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    post(type: string, id: number, coach: boolean = false, text: string):Promise<any> {
        return this.SocketService.send(new PostCommentRequest(type,id,coach,text));
    }

    /**
     *
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    put(id: number, text: string):Promise<any> {
        return this.SocketService.send(new PutCommentRequest(id,text));
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    delete(id: number):Promise<any> {
        return this.SocketService.send(new DeleteCommentRequest(id));
    }

}