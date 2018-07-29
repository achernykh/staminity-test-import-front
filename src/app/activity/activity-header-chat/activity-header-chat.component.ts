import {IComponentController, IComponentOptions, IPromise, IScope, element} from "angular";
import moment from "moment/min/moment-with-locales.js";
import {IActivitySocial} from "../../../../api/activity/activity.interface";
import {IObjectComment} from "../../../../api/social/comment.interface";
import {CommentType} from "../../../../api/social/comment.request";
import {IUserProfile} from "../../../../api/user/user.interface";
import CommentService from "../../core/comment.service";
import MessageService from "../../core/message.service";
import "./activity-header-chat.component.scss";
import * as Autolinker from 'autolinker';
import { ImagesService } from "../../core/images.service";

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

    // private
    private chatBox: Element;
    private fileUrlBuffer: string[] = [];

    static $inject = ["CommentService", "message", "$scope", "ImagesService"];

    constructor(
        public comment: CommentService,
        public message: MessageService,
        public $scope: IScope,
        private imageService: ImagesService) {
        this.comment.comment$
            .filter((item) => item.value.objectType === this.commentType && item.value.objectId === this.activityId &&
                    item.value.userProfile.userId !== this.currentUser.userId)
            .subscribe((item) => this.comments.push(item.value));
    }

    $onInit() {
        this.load();
        this.chatBox = document.getElementsByClassName('chat-wrapper')[0];
    }

    paste (e: ClipboardEvent):void {
        var items = e.clipboardData.items;
        console.log(JSON.stringify(items)); // will give you the mime types
        var blob = null;
        for (var i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") === 0) {
                blob = items[i].getAsFile();
            }
        }
        if (blob !== null) {
            this.imageService.postImage(blob)
                .then(url => this.fileUrlBuffer.push(url), e => this.message.toastError(e))
                .then(_ => this.$scope.$applyAsync());
        }

    }

    load () {
        return this.comment.get(this.commentType, this.activityId, true, 50)
            .then((result) => this.comments = result, (error) => this.message.toastError(error))
            .then(() => this.onUpdate({response: {count: this.comments && this.comments.length || null}}));
    }

    deleteFile (index: number): void {
        this.fileUrlBuffer.splice(index, 1);
    }

    get imgTag (): string {
        return this.fileUrlBuffer.map(u => `<img src="${u}">`).join('<br>');
    }

    onPostComment(text) {
        debugger;
        this.inAction = true;
        console.debug('autolinker', Autolinker.link(text,{safe: true, embed: true,youtube: true}));
        this.comment.post(this.commentType, this.activityId, true, this.imgTag + Autolinker.link(text,{safe: true, embed: true,youtube: true}))
            .then((result) => {
                    this.fileUrlBuffer = [];
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

    updateScroll (): void {
        setTimeout(() => {
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        }, 400);
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
