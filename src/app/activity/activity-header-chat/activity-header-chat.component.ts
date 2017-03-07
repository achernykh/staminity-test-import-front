import './activity-header-chat.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import CommentService from "../../core/comment.service";
import {CommentType} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";

class ActivityHeaderChatCtrl implements IComponentController {

    public data: any;
    public activityId: number;
    private comments: Array<IObjectComment>;
    private readonly commentType: string = 'activity';
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['CommentService'];

    constructor(private comment: CommentService) {

    }

    $onInit() {
        /*this.comment.get(this.commentType, this.activityId).then(result => {
            this.comments = result;
            console.log('comment=',result);
        });*/
    }

    onPostComment(text) {
        this.comment.post(this.commentType, this.activityId, text).then(result=>console.log('comment post=',result));
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