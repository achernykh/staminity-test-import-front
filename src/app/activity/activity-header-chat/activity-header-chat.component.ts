import {IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import moment from "moment/min/moment-with-locales.js";
import {IActivitySocial} from "../../../../api/activity/activity.interface";
import {IObjectComment} from "../../../../api/social/comment.interface";
import {CommentType} from "../../../../api/social/comment.request";
import {IUserProfile} from "../../../../api/user/user.interface";
import CommentService from "../../core/comment.service";
import MessageService from "../../core/message.service";
import "./activity-header-chat.component.scss";

export class ActivityHeaderChatCtrl implements IComponentController {

    data: any;
    activityId: number;
    social: IActivitySocial;
    user: IUserProfile;
    currentUser: IUserProfile;
    coach: boolean;
    comments: IObjectComment[] = [];
    text: string = null;
    readonly commentType: string = "activity";
    inAction: boolean = false; // true - ждем ответа от бэка, false - на стороне клиента
    onUpdate: (response: Object) => IPromise<void>;
    static $inject = ["CommentService", "message", "$scope"];

    constructor(
        public comment: CommentService,
        public message: MessageService,
        public $scope: IScope) {
        this.comment.comment$
            .filter((item) => item.value.objectType === this.commentType && item.value.objectId === this.activityId &&
                    item.value.userProfile.userId !== this.currentUser.userId)
            .subscribe((item) => this.comments.push(item.value));
    }

    $onInit() {
        this.load();
    }

    load () {
        return this.comment.get(this.commentType, this.activityId, true, 50)
            .then((result) => this.comments = result, (error) => this.message.toastError(error))
            .then(() => this.onUpdate({response: {count: this.comments && this.comments.length || null}}));
    }

    onPostComment(text) {
        this.inAction = true;
        this.comment.post(this.commentType, this.activityId, true, text)
            .then((result) => {
                    this.text = null;
                    this.comments = result;
                }, (error) => this.message.toastError(error)).then(() => this.$scope.$evalAsync())
            .then(() => this.inAction = false)
            .then(() => this.onUpdate({response: {count: this.comments && this.comments.length || null}})); ;
            //.then(() => !this.$scope.$$phase && this.$scope.$apply());;
    }

    isMe(id: number): boolean {
        return (this.currentUser.hasOwnProperty("userId") && id === this.currentUser.userId) || false;
    }

    localDate(date) {
        console.log("date: ", date, moment.utc(date).format("DD MMM HH:mm"), new Date().getTimezoneOffset());
        return moment(date).add("minutes", -1 * (new Date().getTimezoneOffset())).format("DD MMM HH:mm");
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }
}

const ActivityHeaderChatComponent: IComponentOptions = {
    bindings: {
        data: "<",
        activityId: "<",
        social: "<",
        user: "<",
        currentUser: "<",
        coach: "<",
        onUpdate: "&",
    },
    require: {
        //component: '^component'
    },
    controller: ActivityHeaderChatCtrl,
    template: require("./activity-header-chat.component.html") as string,
};

export default ActivityHeaderChatComponent;
