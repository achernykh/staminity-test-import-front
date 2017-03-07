import {ISocketService} from './socket.service';
import {
    GetComment, PostComment, PutComment,
    DeleteComment
} from "../../../api/social/comment.request";
import {IObjectComment} from "../../../api/social/comment.interface";

export default class CommentService {

    static $inject = ['SocketService'];

    constructor(private SocketService:ISocketService) {

    }

    /**
     *
     * @param type
     * @param id
     * @param limit
     * @param offset
     * @returns {Promise<any>}
     */
    get(type: string, id: number, limit?: number, offset?: number):Promise<Array<IObjectComment>> {
        return this.SocketService.send(new GetComment(type,id,limit,offset));
    }

    /**
     *
     * @param type
     * @param id
     * @param text
     * @returns {Promise<any>}
     */
    post(type: string, id: number, text: string):Promise<any> {
        return this.SocketService.send(new PostComment(type,id,text));
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