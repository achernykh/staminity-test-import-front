import { FormMode } from "../application.interface";
import { Activity } from "../activity/activity-datamodel/activity.datamodel";
import { ICalendarItemDialogOptions } from "./calendar-item-dialog.interface";
import { profileShort } from "../core/user.function";
import { ICalendarItem } from "../../../api/calendar/calendar.interface";

export class CalendarItemDialogService {

    // inject
    static $inject = ['$mdDialog'];

    constructor (private $mdDialog: any) {}

    /**
     * Диалог ведения Тренировки
     * @param env - элемент от куда вызван диалог
     * @param mode - режим формы: создание, изменение или просмотр
     * @param options - опции ведения тренировки
     * @param activity - объект тренировки
     * @returns {any}
     */
    activity (env: Event,
              mode: FormMode,
              options: ICalendarItemDialogOptions,
              activity: Activity = this.activityFromOptions(options)): Promise<any> {

        return this.$mdDialog.show({
            controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (mode, activity) => $mdDialog.hide({ mode: mode, activity: activity });
            }],
            controllerAs: '$ctrl',
            template: `<md-dialog id="post-activity" aria-label="Activity">
                            <calendar-item-activity
                                layout="row" class="calendar-item-activity"
                                date="$ctrl.activity"
                                mode="$ctrl.mode"
                                user="$ctrl.user"
                                popup="$ctrl.options.popup"
                                template="$ctrl.options.template"
                                training-plan="$ctrl.options.trainingPlan"
                                on-cancel="cancel()" on-answer="answer(mode,response)">
                            </calendar-item-activity>
                        </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                activity: activity,
                mode: mode,
                options: options,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true
        });
    }

    /**
     * Пустая тренировка на основе параметров
     * @param options
     * @returns {Activity}
     */
    private activityFromOptions (options: ICalendarItemDialogOptions): Activity {
        let item: ICalendarItem = {
            calendarItemId: null,
            calendarItemType: 'activity',
            revision: null,
            dateStart: options.dateStart,
            dateEnd: options.dateStart,
            activityHeader: {
                activityType: options.activityType || { id: null, code: null, typeBasic: null },
                activityCategory: options.activityCategory || null,
                intervals: []
            },
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
        let params: any = {
            isTemplate: options.template || false
        };
        return new Activity(item);
    }

}