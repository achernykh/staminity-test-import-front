import { Activity } from "../activity/activity-datamodel/activity.datamodel";
import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "./calendar-item-dialog.interface";
import { profileShort } from "../core/user.function";
import { ICalendarItem } from "../../../api/calendar/calendar.interface";

export class CalendarItemDialogService {

    // private
    private readonly defaultDialogOptions = {
        controller: ['$scope', '$mdDialog', ($scope, $mdDialog) => {
            $scope.hide = () => $mdDialog.hide();
            $scope.cancel = () => $mdDialog.cancel();
            $scope.answer = (formMode, item) => $mdDialog.hide({ formMode: formMode, item: item });
        }],
        controllerAs: '$ctrl',
        parent: angular.element(document.body),
        bindToController: true,
        clickOutsideToClose: false,
        escapeToClose: true,
        fullscreen: true
    };

    // inject
    static $inject = ['$mdDialog'];

    constructor (private $mdDialog: any) {}

    /**
     * Диалог ведения Тренировки
     * @param env - элемент от куда вызван диалог
     * @param options - опции ведения тренировки
     * @param activity - объект тренировки
     * @returns {any}
     */
    activity (env: Event,
              options: ICalendarItemDialogOptions,
              activity: ICalendarItem = this.activityFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="post-activity" aria-label="Activity">
                            <calendar-item-activity layout="row" class="calendar-item-activity"
                                    data="$ctrl.activity"
                                    options="$ctrl.options"
                                    on-cancel="cancel()" on-answer="answer(formMode, item)">
                            </calendar-item-activity>
                       </md-dialog>`,
            targetEvent: env,
            locals: {
                activity: activity,
                options: options,
            }
        }));
    }

    /**
     * Диалог ведения Измерения
     * @param env
     * @param options
     * @param item
     * @returns {any}
     */
    measurement (env: Event,
                 options: ICalendarItemDialogOptions,
                 item: ICalendarItem = this.measurementFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
                template: `<calendar-item-measurement
                            class="calendar-item-measurement"
                            data="$ctrl.item"
                            mode="post"
                            user="$ctrl.user"
                            on-cancel="cancel()" on-answer="answer(response)">
                          </calendar-item-measurement>`,
                targetEvent: env,
                locals: {
                    item: item,
                    options: options,
                }
            })
        );
    }

    /**
     * Диалог ведения Записи
     * @param env
     * @param options
     * @param item
     * @returns {any}
     */
    record (env: Event,
            options: ICalendarItemDialogOptions,
            item: ICalendarItem = this.recordFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="calendar-item-record" aria-label="Record">
                        <calendar-item-record 
                                data="$ctrl.item"
                                calendar-range="$ctrl.calendarRange"
                                mode="post"
                                on-cancel="cancel()">
                        </calendar-item-record>
                   </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                calendarRange: [null,null]//this.calendar.calendarRange
            }
        }));
    }

    /**
     * Диалог ведения Соревнования
     * @param env
     * @param options
     * @param item
     * @returns {any}
     */
    competition (
        env: Event,
        options: ICalendarItemDialogOptions,
        item: ICalendarItem = this.competitionFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="calendar-item-competition" aria-label="Competition">
                        <st-calendar-item-competition 
                                item="$ctrl.item"
                                options="$ctrl.options"
                                on-cancel="cancel()"
                                on-answer="answer(formMode, item)">
                        </st-calendar-item-competition>
                   </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                options: options
            }
        }));
    }

    /**
     * Пустая тренировка на основе параметров
     * @param options
     * @returns {ICalendarItem}
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

    /**
     * Пустая запись Измерения на основе параметров
     * @param options
     * @returns {ICalendarItem}
     */
    private measurementFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
        return {
            calendarItemId: null,
            calendarItemType: 'measurement',
            revision: null,
            dateStart: options.dateStart,
            dateEnd: options.dateStart,
            measurementHeader: {},
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
    }

    /**
     * Пустая запись События на основе параметров
     * @param options
     * @returns {ICalendarItem}
     */
    private recordFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
        return {
            calendarItemId: null,
            calendarItemType: 'record',
            revision: null,
            dateStart: options.dateStart,
            dateEnd: options.dateStart,
            recordHeader: {},
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
    }

    /**
     * Пустая запись Соревнования на основе параметров
     * @param options
     * @returns {ICalendarItem}
     */
    private competitionFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
        return {
            calendarItemId: null,
            calendarItemType: 'competition',
            revision: null,
            dateStart: options.dateStart,
            dateEnd: options.dateStart,
            competitionHeader: {
                type: 'run',
                distanceType: 'marathon',
                priority: 'C'
            },
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
    }

}