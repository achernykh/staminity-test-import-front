import {IComponentController, IComponentOptions, IPromise} from "angular";
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import CommentService from "../../core/comment.service";
import {ChatSession} from "../../core/comment.service";
import {Activity} from "../activity.datamodel";
import "./activity-header.component.scss";

export class ActivityHeaderCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public calendarActivity: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;

    private comments: number = null;

    public static $inject = ["$mdMedia", "CommentService"];

    constructor(private $mdMedia: any, private comment: CommentService) {
    }

    public $onInit() {
    }

    public openChat(): void {
        const chat: ChatSession = {type: "activity", id: this.item.activity.calendarItemId};
        this.comment.openChat$.next(chat);
    }

    public closeChat(): void {
        this.comment.openChat$.next(null);
    }

    public updateComments(response): void {
        this.comments = response && response.hasOwnProperty("count") && response.count || null;
    }

    public toggleStrucuredMode() {
        this.item.structuredMode = !this.item.structuredMode;
    }
}

const ActivityHeaderComponent: IComponentOptions = {
    require: {
        item: "^calendarItemActivity",
    },
    controller: ActivityHeaderCtrl,
    template: require("./activity-header.component.html") as string,
};

export default ActivityHeaderComponent;
