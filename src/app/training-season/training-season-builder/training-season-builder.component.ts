import "./training-season-builder.component.scss";
import { IComponentOptions, IComponentController, IScope, ILocationService } from "angular";
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";
import { ICalendarItem } from "@api/calendar";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { TrainingSeasonService } from "../training-season.service";
import { TrainingSeasonDialogSerivce } from "../training-season-dialog.service";
import { FormMode } from "../../application.interface";
import {
    IPeriodizationScheme, ISeasonPlan,
    IMicrocycle
} from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { profileShort } from "../../core/user.function";
import {
    ICalendarItemDialogOptions,
    ICalendarItemDialogResponse
} from "../../calendar-item/calendar-item-dialog.interface";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";

export enum TrainingSeasonViewState {
    List,
    Builder
}

class TrainingSeasonBuilderCtrl implements IComponentController {
    // bind
    state: TrainingSeasonViewState;
    currentUser: IUserProfile;
    owner: IUserProfile;
    schemes: Array<IPeriodizationScheme>;

    // private
    private seasons: Array<ISeasonPlan>;
    private season: TrainingSeason;
    private competitions: Array<ICalendarItem>;
    private data: TrainingSeasonData;
    private athletes: Array<IUserProfileShort>;
    private itemOptions: ICalendarItemDialogOptions;

    // inject
    static $inject = ['$scope', '$location', '$mdMedia', '$stateParams', 'CalendarService', 'TrainingSeasonService',
        'TrainingSeasonDialogService', 'message', 'CalendarItemDialogService'];

    constructor (private $scope: IScope,
                 private $location: ILocationService,
                 private $mdMedia: any,
                 private $stateParams: any,
                 private calendarService: CalendarService,
                 private trainingSeasonService: TrainingSeasonService,
                 private trainingSeasonDialog: TrainingSeasonDialogSerivce,
                 private messageService: MessageService, private calendarItemDialog: CalendarItemDialogService) {

    }

    $onInit () {

        this.itemOptions = {
            currentUser: this.currentUser,
            owner: this.owner,
            popupMode: true,
            formMode: FormMode.View,
            trainingPlanMode: false,
            planId: null
        };

        this.prepareAthletesList();
        this.trainingSeasonService.get({userId: Number(this.$stateParams.userId) || this.currentUser.userId})
            .then(response => this.seasons = response.arrayResult)
            .then(() => this.prepareState());
    }

    private prepareState (): void {

        // Устанавливаем владельца данных
        if (this.$stateParams.userId && this.athletes &&
            this.athletes.some(a => a.userId === Number(this.$stateParams.userId))) {
            this.setOwner(this.athletes.filter(a => a.userId === Number(this.$stateParams.userId))[0]);
        } else {
            this.setOwner(this.currentUser);
        }

        // Устанавливаем тренировочный сезон
        if (this.$stateParams.seasonId && this.seasons &&
            this.seasons.some(s => s.id === Number(this.$stateParams.seasonId))) {
            this.season = new TrainingSeason(this.seasons.filter(s => s.id === Number(this.$stateParams.seasonId))[0]);
        } else if (this.seasons && this.seasons.length > 0) {
            this.season = new TrainingSeason(this.seasons[0]);
        }

        // Устанвливаем экран
        if (this.$stateParams.seasonId && this.season) {
            this.isBuilderState = true;
        } else {
            this.isListState = true;
        }

        /**if (!this.$stateParams.seasonId && this.$stateParams.userId && this.athletes &&
            this.athletes.some(a => a.userId === Number(this.$stateParams.userId))) {

            this.setOwner(this.athletes.filter(a => a.userId === Number(this.$stateParams.userId))[0]);
            this.isListState = true;

        } else if (this.$stateParams.seasonId && this.$stateParams.userId && this.seasons &&
            this.seasons.some(s => s.id === Number(this.$stateParams.seasonId))) {

            this.season = new TrainingSeason(this.seasons.filter(s => s.id === Number(this.$stateParams.seasonId))[0]);
            this.isBuilderState = true;

        } else if (this.seasons && this.seasons.length > 0) {

            this.isBuilderState = true;
            this.season = new TrainingSeason(this.seasons[0]);

        } else {
            this.isListState = true;
        }**/

        if (this.season) {
            this.prepareData();
        }

    }

    open (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Post, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) => {}, error => {})
            .then(() => this.update());
    }

    /**
     * Диалого создания Соревнования
     * @param event
     */
    postCompetition (event: Event): void {
        this.calendarItemDialog.competition(event, Object.assign(this.itemOptions, {formMode: FormMode.Post}))
            .then(() => {}, () => {});
    }

    /**
     * Диалог просмотра Соревнования
     * @param event
     * @param item
     */
    viewCompetition (event: Event, item: ICalendarItem): void {
        this.calendarItemDialog.competition(event, this.itemOptions, item)
            .then(() => {}, () => {});
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

    /**
     * Устанваливаем План на сезон
     * @param season
     */
    setSeason (season: ISeasonPlan): void {
        this.season = new TrainingSeason(season);
        this.$location.search('seasonId', this.season.id);
        this.prepareData();
        this.state = TrainingSeasonViewState.Builder;
    }

    /**
     * Устанавливаем данные Плана на сезон
     * Содержит перечень микроциклов по всему периоду плана
     * @param data
     */
    setSeasonData (data: Array<IMicrocycle>): void {
        this.data = new TrainingSeasonData(this.season, data);
    }

    /**
     * Устанавливаем владельца данных - атлета
     * При смене владельца запрашиваем данные по сеоревнованиям
     * @param user
     */
    setOwner (user: IUserProfile | IUserProfileShort): void {
        this.owner = user;
        this.itemOptions.owner = this.owner;
        this.$location.search('userId', this.owner.userId);
        this.trainingSeasonService.get({userId: this.owner.userId})
            .then(response => this.seasons = response.arrayResult, error => this.messageService.toastInfo(error))
            .then(() => this.calendarService.search({ userIdOwner: this.owner.userId, calendarItemTypes: ['competition']}))
            .then(response => response.arrayResult && this.setCompetitionList(response.arrayResult))
            .then(() => this.update());
    }

    /**
     * Устанавливаем перечень соревнований владельца
     * @param list
     */
    setCompetitionList (list: Array<ICalendarItem>): void {
        this.competitions = list;
    }

    /**
     * Подготовка данных
     * 1. Получаем микроциклы и устанвливаем их
     * 2. Получаем перечень соревнований и устанавливаем их
     */
    private prepareData (): void {
        this.trainingSeasonService.getItems(this.season.id)
            .then(result => this.setSeasonData(result.arrayResult), error => {})
            .then(() => this.calendarService.search({userIdOwner: this.owner.userId, calendarItemTypes: ['competition']}))
            .then(result => this.data.setCompetitions(result.arrayResult), error => {});
    }

    /**
     * Подготавливаем перечень атлетов для тренера
     * Перечень используемтся при смене владельца
     */
    private prepareAthletesList(): void {
        if (this.currentUser.public.isCoach && this.currentUser.connections.hasOwnProperty('allAthletes')) {
            this.athletes = this.currentUser.connections.allAthletes.groupMembers;
        }
    }

    private update (): void {
        this.$scope.$applyAsync();
    }

    get isLargeScreen (): boolean {
        return this.$mdMedia('min-width: 1440px');
    }

    get isListState (): boolean {
        return this.state === TrainingSeasonViewState.List;
    }

    set isListState (value: boolean) {
        value ? this.state = TrainingSeasonViewState.List : this.state = TrainingSeasonViewState.Builder;
    }

    get isBuilderState (): boolean {
        return this.state === TrainingSeasonViewState.Builder;
    }

    set isBuilderState (value: boolean) {
        value ? this.state = TrainingSeasonViewState.Builder : this.state = TrainingSeasonViewState.List;
    }

}

const TrainingSeasonBuilderComponent: IComponentOptions = {
    bindings: {
        currentUser: '<',
        owner: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonBuilderCtrl,
    template: require('./training-season-builder.component.html') as string
};

export default TrainingSeasonBuilderComponent;