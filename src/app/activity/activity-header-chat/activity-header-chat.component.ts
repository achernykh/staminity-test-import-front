import './activity-header-chat.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import CommentService from "../../core/comment.service";
import {CommentType} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";
import MessageService from "../../core/message.service";

class ActivityHeaderChatCtrl implements IComponentController {

    public data: any;
    public activityId: number;
    private comments: Array<IObjectComment>;
    private readonly commentType: string = 'activity';
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['CommentService', 'message'];

    constructor(private comment: CommentService, private message: MessageService) {

    }

    $onInit() {
        this.comment.get(this.commentType, this.activityId, true)
            .then(result => this.comments = result,
                error => this.message.toastError(error));
    }

    onPostComment(text) {
        this.comment.post(this.commentType, this.activityId, true, text)
            .then(result=>console.log('comment post=',result),
                error => this.message.toastError(error));
    }
}

const ActivityHeaderChatComponent:IComponentOptions = {
    bindings: {
        data: '<',
        activityId: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderChatCtrl,
    template: require('./activity-header-chat.component.html') as string
};

export default ActivityHeaderChatComponent;