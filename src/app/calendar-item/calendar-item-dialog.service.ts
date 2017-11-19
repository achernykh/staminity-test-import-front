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
              activity: Activity | ICalendarItem = this.activityFromOptions(options)): Promise<any> {

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
                                data="$ctrl.activity"
                                options="$ctrl.options"
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
    private activityFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
        return {
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
    }

}