import { ICalendarItemDialogOptions, ICalendarItemDialogResponse } from "./calendar-item-dialog.interface";
import { profileShort } from "../core/user.function";
import { ICalendarItem } from "../../../api/calendar/calendar.interface";
import AuthService from "../auth/auth.service";
import { IUserProfile } from "../../../api/user/user.interface";
import UserService from "../core/user.service";
import MessageService from "../core/message.service";
import {IActivityIntervalW} from "@api/activity";
import {isFutureDay} from "../share/date/date.filter";
import {PremiumDialogService} from "@app/premium/premium-dialog/premium-dialog.service";

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
    static $inject = ['$mdDialog', 'AuthService', 'UserService', 'message', 'PremiumDialogService'];

    constructor (private $mdDialog: any,
                 private auth: AuthService,
                 private userService: UserService,
                 private message: MessageService,
                 private premiumDialogService: PremiumDialogService) {}

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
                    athleteList: CalendarItemDialogService.getAthleteList(options.currentUser, options.owner)
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
              item: ICalendarItem = CalendarItemDialogService.activityFromOptions(options)): Promise<ICalendarItemDialogResponse> {

                  return this.$mdDialog.show(this.activityDialogOptions(env,options,item));
        //return Promise.resolve(() => {})
            //.then(() => false && this.completeTrainingZones(options))
            //.then((updOptions) => this.$mdDialog.show(this.activityDialogOptions(env,updOptions || options,item)) , error => this.message.toastError(error));

               /**
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
        }));**/
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
                 item: ICalendarItem = CalendarItemDialogService.measurementFromOptions(options)): Promise<ICalendarItemDialogResponse> {
        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
                template: `<md-dialog id="post-measurement" aria-label="Measurement">
                                <calendar-item-measurement
                                    layout="column"
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
            item: ICalendarItem = CalendarItemDialogService.recordFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="calendar-item-record" aria-label="Record">
                        <calendar-item-record
                                layout="column"
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
            },
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
                 item: ICalendarItem = CalendarItemDialogService.competitionFromOptions(options)): Promise<ICalendarItemDialogResponse> {

        if (!(this.auth.isCoach() || this.auth.isPremiumAccount()) && isFutureDay(item.dateStart)) {
            return this.premiumDialogService.open(null, 'futurePlaning').then();
        }

        return this.$mdDialog.show(Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="calendar-item-competition" aria-label="Competition">
                        <st-calendar-item-competition
                                layout="column" flex="auto"
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
                    athleteList: CalendarItemDialogService.getAthleteList(options.currentUser, options.owner)
                })
            }
        }));
    }

    private completeTrainingZones(options: ICalendarItemDialogOptions): Promise<any> {
        return this.userService.getTrainingZones(options.owner.userId)
            .then(response => {
                if (Array.isArray(response) && response[0].hasOwnProperty('trainingZones')) {
                    options.owner.trainingZones = response[0].trainingZones;
                } else {
                    throw new Error('errorResponseTrainingZones');
                }
            });
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
    public static activityFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
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

    private activityDialogOptions (env: Event, options: ICalendarItemDialogOptions, item: ICalendarItem): any {
        const hasActualData: boolean = item && item.activityHeader && item.activityHeader.intervals &&
            item.activityHeader.intervals.some(i => i.type === 'W') &&
            (item.activityHeader.intervals.filter(i => i.type === 'W')[0] as IActivityIntervalW).actualDataIsImported || false ;

        return Object.assign(this.defaultDialogOptions, {
            template: `<md-dialog id="post-activity" aria-label="Activity" layout="column">
                            <calendar-item-activity
                                    flex="auto" flex-gt-sm="none" layout="row"
                                    class="calendar-item-activity"
                                    style="margin: auto"
                                    ng-class="{'has-actual-data': $ctrl.hasActualData}"
                                    data="$ctrl.item"
                                    options="$ctrl.options"
                                    on-cancel="cancel()" on-answer="answer(formMode, item)">
                            </calendar-item-activity>
                       </md-dialog>`,
            targetEvent: env,
            locals: {
                item: item,
                hasActualData: hasActualData,
                options: Object.assign(options, {
                    isPro: this.isPro,
                    athleteList: CalendarItemDialogService.getAthleteList(options.currentUser, options.owner)
                })
            }
        });
    }

    /**
     * Пустая запись Измерения на основе параметров
     * @param options
     * @returns {ICalendarItem}
     */
    public static measurementFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
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
    public static recordFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
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
    public static competitionFromOptions (options: ICalendarItemDialogOptions): ICalendarItem {
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

    static getAthleteList (currentUser: IUserProfile, owner: IUserProfile): Array<{profile: IUserProfile, active: boolean}> {
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