import './activity-header.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity.datamodel";
import CommentService from "../../core/comment.service";
import {ChatSession} from "../../core/comment.service";

export class ActivityHeaderCtrl implements IComponentController {

    public item: CalendarItemActivityCtrl;
    public calendarActivity: CalendarItemActivityCtrl;
    public mode: string;
    public activity: Activity;

    private comments: number = null;

    static $inject = ['$mdMedia','CommentService'];

    constructor(private $mdMedia: any, private comment: CommentService) {
    }

    $onInit() {
    }

    openChat():void {
        let chat: ChatSession = {type: 'activity', id: this.item.activity.calendarItemId};
        this.comment.openChat$.next(chat);
    }

    closeChat():void {
        this.comment.openChat$.next(null);
    }

    updateComments(response):void {
        this.comments = response && response.hasOwnProperty('count') && response.count || null;
    }
}

const ActivityHeaderComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderCtrl,
    template: require('./activity-header.component.html') as string
};

export default ActivityHeaderComponent;
