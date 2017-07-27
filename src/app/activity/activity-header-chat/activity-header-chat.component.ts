import './activity-header-chat.component.scss';
import moment from 'moment/min/moment-with-locales.js';
import {IComponentOptions, IComponentController, IPromise, IScope} from 'angular';
import CommentService from "../../core/comment.service";
import {CommentType} from "../../../../api/social/comment.request";
import {IObjectComment} from "../../../../api/social/comment.interface";
import {IActivitySocial} from "../../../../api/activity/activity.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {IMessageService} from "../../core/message.service";

export class ActivityHeaderChatCtrl implements IComponentController {

  public data: any;
  public activityId: number;
  public social: IActivitySocial;
  public user: IUserProfile;
  public currentUser: IUserProfile;
  public coach: boolean;

    protected comments: Array<IObjectComment> = [];
    protected text: string = null;
    protected readonly commentType: string = 'activity';
    private inAction: boolean = false; // true - ждем ответа от бэка, false - на стороне клиента
    public onUpdate: (response: Object) => IPromise<void>;
    static $inject = ['CommentService', 'message','$scope'];

    constructor(protected comment: CommentService, protected message: IMessageService, protected $scope: IScope) {
        this.comment.comment$
            .filter(item => item.value.objectType === this.commentType && item.value.objectId === this.activityId &&
                    item.value.userProfile.userId !== this.currentUser.userId)
            .subscribe((item) => this.comments.push(item.value));
    }

    $onInit() {
        this.comment.get(this.commentType, this.activityId, true, 50)
            .then(result => this.comments = result, error => this.message.toastError(error))
    .then(() => this.onUpdate({response: {count: this.comments && this.comments.length || null}}));}

    onPostComment(text) {
        this.inAction = true;
        this.comment.post(this.commentType, this.activityId, true, text)
            .then(result=> {
                    this.text = null;
                    this.comments = result;
                }, error => this.message.toastError(error)).then(()=>this.$scope.$evalAsync())
            .then(() => this.inAction = false)
            .then(() => this.onUpdate({response: {count: this.comments && this.comments.length || null}}));;
            //.then(() => !this.$scope.$$phase && this.$scope.$apply());;
  }

  isMe(id: number): boolean {
    return (this.currentUser.hasOwnProperty('userId') && id === this.currentUser.userId) || false;
  }

  localDate(date) {
    console.log('date: ', date, moment.utc(date).format('DD MMM HH:mm'), new Date().getTimezoneOffset());
    return moment(date).add('minutes', -1 * (new Date().getTimezoneOffset())).format('DD MMM HH:mm');
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
        onUpdate: '&'
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderChatCtrl,
    template: require('./activity-header-chat.component.html') as string
};

export default ActivityHeaderChatComponent;
