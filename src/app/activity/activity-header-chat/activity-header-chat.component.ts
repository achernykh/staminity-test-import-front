import './activity-header-chat.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import CommentService from "../../core/comment.service";
import {CommentType} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";
import MessageService from "../../core/message.service";
import {IActivitySocial} from "../../../../api/activity/activity.interface";

class ActivityHeaderChatCtrl implements IComponentController {

    public data: any;
    public activityId: number;
    public social: IActivitySocial;
    private comments: Array<IObjectComment>;
    private readonly commentType: string = 'activity';
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['CommentService', 'message'];

    constructor(private comment: CommentService, private message: MessageService) {

    }

    $onInit() {
        if (this.social && this.social.hasOwnProperty('trainerCommentsCount') &&
            this.social.trainerCommentsCount > 0) {

            this.comment.get(this.commentType, this.activityId, true)
                .then(result => this.comments = result,
                    error => this.message.toastError(error));
        }
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
        social: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderChatCtrl,
    template: require('./activity-header-chat.component.html') as string
};

export default ActivityHeaderChatComponent;