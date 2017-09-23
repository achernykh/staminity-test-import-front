import './activity-assignment-header.component.scss';
import {IComponentOptions, IComponentController, IPromise, INgModelController} from 'angular';
import {
    CalendarItemActivityCtrl,
    HeaderStructuredTab
} from "../../../calendar-item/calendar-item-activity/calendar-item-activity.component";
import {FtpState} from "../assignment/assignment.component";

class ActivityAssignmentHeaderCtrl implements IComponentController {

    private item: CalendarItemActivityCtrl;
    private onChange: (result: {form: INgModelController}) => IPromise<void>;

    private form: INgModelController;
    public ftpMode: number;

    static $inject = [];

    constructor() {

    }

    $onInit() {

    }

    private changeParam() {
        setTimeout(()=>{
            this.clearTemplate();
            //this.validateForm();
            this.updateForm();
            this.item.updateFilterParams();
        }, 100);
    }

    private changeStructuredMode(){
        this.item.structuredMode ? this.item.selectedTab = HeaderStructuredTab.Segments : angular.noop();
    }

    private clearTemplate() {
        this.item.activity.header.template = null;
    }

    private onTemplateOpen(){
        this.item.showSelectTemplate = true;
    }

    private ftpModeChange(mode: FtpState) {
        this.ftpMode = mode;
        this.item.ftpMode = mode;
        //this.prepareValues();
    }

    private updateForm(){
        this.onChange({form: this.form});
    }

    get templateSelectorText(): string {
        return this.item.activity.header.template && `Шаблон: ${this.item.activity.header.template.code}` ||
            this.item.templateByFilter && 'activity.template.enable' || 'activity.template.empty';
    }
}

const ActivityAssignmentHeaderComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onChange: '&'
    },
    require: {
        item: '^calendarItemActivity'
    },
    controller: ActivityAssignmentHeaderCtrl,
    template: require('./activity-assignment-header.component.html') as string
};

export default ActivityAssignmentHeaderComponent;