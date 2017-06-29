import './dashboard-day.component.scss';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import {IDashboardDay, DashboardCtrl} from "../dashboard.component";
import {IUserProfile} from "../../../../api/user/user.interface";
import {isSpecifiedActivity} from "../../activity/activity.function";
import {ICalendarItem} from "../../../../api/calendar/calendar.interface";
import {CalendarItemWizardSelectCtrl} from "../../calendar-item/calendar-item-wizard/calendar-item-wizard.component";

class DashboardDayCtrl implements IComponentController {

    public day: IDashboardDay;
    public athlete: IUserProfile;
    public selected: boolean;
    public onEvent: (response: Object) => IPromise<void>;
    private dashboard: DashboardCtrl;

    static $inject = ['$mdDialog','message'];

    constructor(private $mdDialog: any, private message: any) {

    }

    $onInit() {

    }

    onSelect() {
        this.selected = !this.selected;
    }

    isSpecified(item: ICalendarItem):boolean {
        return isSpecifiedActivity(item);
    }

    postItem($event, date){
        this.$mdDialog.show({
            controller: CalendarItemWizardSelectCtrl,
            controllerAs: '$ctrl',
            template:
                `<md-dialog id="wizard" aria-label="Activity">
                        <calendar-item-wizard
                                layout="column" class="calendar-item-wizard"
                                date="$ctrl.date"                     
                                user="$ctrl.user"
                                event="$ctrl.event"
                                on-cancel="cancel()" on-select="$ctrl.answer(itemType, activityType)">
                        </calendar-item-wizard>
                   </md-dialog>`,
            parent: element(document.body),
            targetEvent: $event,
            locals: {
                date: new Date(date), // дата дня в формате ГГГГ-ММ-ДД
                user: this.athlete,
                event: $event
            },
            //resolve: {
            //    details: () => this.ActivityService.getDetails(data.activityHeader.activityId)
            //        .then(response => response, error => console.error(error))
            //},
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true
        }).then(() => {}, ()=> {});
    }
}

const DashboardDayComponent:IComponentOptions = {
    bindings: {
        day: '<',
        athlete: '<',
        selected: '<',
        onSelect: '&'
    },
    require: {
        dashboard: '^dashboard'
    },
    controller: DashboardDayCtrl,
    template: require('./dashboard-day.component.html') as string
};

export default DashboardDayComponent;
