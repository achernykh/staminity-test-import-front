import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "./calendar-item-dialog.interface";
import { profileShort } from "../core/user.function";
import { ICalendarItem } from "../../../api/calendar/calendar.interface";
import AuthService from "../auth/auth.service";
import { IUserProfile } from "../../../api/user/user.interface";

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
    static $inject = ['$mdDialog', 'AuthService'];

    constructor (private $mdDialog: any,
                 private auth: AuthService) {}

    /**
     * Диалог создания новой записи календаря
     * Можно выбрать
     * 1) базовые виды спорта по тренироке
     * 2) базовые события: день отдаых, болезнь, режим питания
     * 3) измерение
     * 4) соревнование
     * @param env
     * @param options
     * @param item
     */
    wizard (env: Event, options: ICalendarItemDialogOptions,
            item: ICalendarItem = this.itemFromOptions(options)): Promise<any> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="wizard" aria-label="Wizard">
                            <calendar-item-wizard 
                                    layout="column"
                                    class="calendar-item-wizard"
                                    data="$ctrl.item"
                                    options="$ctrl.options"
                                    on-cancel="cancel()" on-answer="answer(formMode, item)">
                            </calendar-item-wizard>
                       </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                options: Object.assign(options, {
                    isPro: this.isPro,
                    athleteList: this.getAthleteList(options.currentUser, options.owner)
                })
            }
        })).then(response => this[response.item.calendarItemType](env, options, response.item));

    }

    /**
     * Диалог ведения Тренировки
     * @param env - элемент от куда вызван диалог
     * @param options - опции ведения тренировки
     * @param item - объект тренировки
     * @returns {Promise<ICalendarItemDialogResponse>}
     */
    activity (env: Event,
              options: ICalendarItemDialogOptions,
              item: ICalendarItem = this.activityFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="post-activity" aria-label="Activity">
                            <calendar-item-activity layout="row" class="calendar-item-activity"
                                    data="$ctrl.item"
                                    options="$ctrl.options"
                                    on-cancel="cancel()" on-answer="answer(formMode, item)">
                            </calendar-item-activity>
                       </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                options: Object.assign(options, {
                    isPro: this.isPro,
                    athleteList: this.getAthleteList(options.currentUser, options.owner)
                })
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
                template: `<md-dialog id="post-measurement" aria-label="Measurement">
                                <calendar-item-measurement
                                    class="calendar-item-measurement"
                                    data="$ctrl.item"
                                    options="$ctrl.options"
                                    on-cancel="cancel()" on-answer="answer(formMode, item)">
                                </calendar-item-measurement>
                            </md-dialog>`,
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
                                item="$ctrl.item"
                                options="$ctrl.options"
                                calendar-range="$ctrl.calendarRange"
                                on-cancel="cancel()"
                                on-answer="answer(formMode, item)">
                        </calendar-item-record>
                   </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                options: options,
                calendarRange: [null, null]//this.calendar.calendarRange
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
    competition (env: Event,
                 options: ICalendarItemDialogOptions,
                 item: ICalendarItem = this.competitionFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="calendar-item-competition" aria-label="Competition">
                        <st-calendar-item-competition
                                class="calendar-item-competition" layout="column"
                                item="$ctrl.item"
                                options="$ctrl.options"
                                on-cancel="cancel()"
                                on-answer="answer(formMode, item)">
                        </st-calendar-item-competition>
                   </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                options: Object.assign(options, {
                    isPro: this.isPro,
                    athleteList: this.getAthleteList(options.currentUser, options.owner)
                })
            }
        }));
    }

    /**
     * Пустая запись календаря на основе парметров
     * Используется для визарда
     * @param options
     * @returns {{calendarItemId: null, calendarItemType: string, revision: null, dateStart: string, dateEnd: string, userProfileOwner: IUserProfileShort, userProfileCreator: IUserProfileShort, groupProfile: IGroupProfileShort}}
     */
    private itemFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
        return {
            calendarItemId: null,
            calendarItemType: 'activity',
            revision: null,
            dateStart: options.dateStart,
            dateEnd: options.dateStart,
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
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
            /**competitionHeader: {
                type: 'triathlon',
                distanceType: 'olympic',
                priority: 'C'
            },**/
            userProfileOwner: profileShort(options.owner),
            userProfileCreator: profileShort(options.currentUser),
            groupProfile: options.groupCreator
        };
    }

    private get isPro (): boolean {
        return this.auth.isActivityPro();
    }

    private getAthleteList (currentUser: IUserProfile, owner: IUserProfile): Array<{profile: IUserProfile, active: boolean}> {
        let athleteList: Array<{profile: IUserProfile, active: boolean}> = [];

        //
        if ( currentUser.connections.hasOwnProperty('allAthletes') && currentUser.connections.allAthletes ) {
            athleteList = currentUser.connections.allAthletes.groupMembers
                .filter(user => user.hasOwnProperty('trainingZones'))
                .map(user => ({profile: user, active: user.userId === owner.userId}));
        }
        //
        if(athleteList.length === 0 || !athleteList.some(athlete => athlete.active)) {
            athleteList.push({profile: owner, active: true});
        }

        return athleteList;

    }

}