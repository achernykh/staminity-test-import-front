import './activity-header.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {CalendarItemActivityCtrl} from "../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {Activity} from "../activity-datamodel/activity.datamodel";
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

    toggleStrucuredMode() {
        this.item.structuredMode = !this.item.structuredMode;
    }

    changeLayout (key: string): void {
        this.item.layout[key] = !this.item.layout[key];
        window.localStorage.setItem(key, JSON.stringify(this.item.layout[key]));
    }

    get isIonic (): boolean {
        return window.hasOwnProperty('ionic');
    }
}

export const ActivityHeaderComponent:IComponentOptions = {
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityHeaderCtrl,
    template: require('./activity-header.component.html') as string
};

export default ActivityHeaderComponent;