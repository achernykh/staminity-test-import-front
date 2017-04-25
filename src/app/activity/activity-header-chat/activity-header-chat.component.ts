import './activity-header-chat.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import CommentService from "../../core/comment.service";
import {CommentType} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";
import MessageService from "../../core/message.service";
import {IActivitySocial} from "../../../../api/activity/activity.interface";
import {IUserProfile} from "../../../../api/user/user.interface";

class ActivityHeaderChatCtrl implements IComponentController {

    public data: any;
    public activityId: number;
    public social: IActivitySocial;
    public user: IUserProfile;
    public currentUser: IUserProfile;
    public coach: boolean;

    private comments: Array<IObjectComment> = [];
    private text: string = null;
    private readonly commentType: string = 'activity';
    public onEvent: (response: Object) => IPromise<void>;
    static $inject = ['CommentService', 'message'];

    constructor(private comment: CommentService, private message: MessageService) {
        this.comment.comment$
            .filter(item => item.value.objectType === this.commentType && item.value.objectId === this.activityId &&
                    item.value.userProfile.userId !== this.currentUser.userId)
            .subscribe((item) => this.comments.push(item.value));
    }

    $onInit() {
        this.comment.get(this.commentType, this.activityId, true, 50)
            .then(result => this.comments = result, error => this.message.toastError(error));
    }

    onPostComment(text) {
        this.comment.post(this.commentType, this.activityId, true, text)
            .then(result=> {
                    this.text = null;
                    this.comments = result;
                }, error => this.message.toastError(error));
    }

    isMe(id: number): boolean {
        return (this.currentUser.hasOwnProperty('userId') && id === this.currentUser.userId) || false;
    }

    localDate(date){
        console.log('date: ',date,moment.utc(date).format('DD MMM HH:mm'),new Date().getTimezoneOffset());
        return moment(date).add('minutes',-1*(new Date().getTimezoneOffset())).format('DD MMM HH:mm');
    }
}

const ActivityHeaderChatComponent:IComponentOptions = {
    bindings: {
        data: '<',
        activityId: '<',
        social: '<',
        user: '<',
        currentUser: '<',
        coach: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderChatCtrl,
    template: require('./activity-header-chat.component.html') as string
};

export default ActivityHeaderChatComponent;