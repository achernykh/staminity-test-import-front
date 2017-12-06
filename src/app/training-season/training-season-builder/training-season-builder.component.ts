import "./training-season-builder.component.scss";
import { IComponentOptions, IComponentController, IScope } from "angular";
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile, IUserProfileShort } from "../../../../api/user/user.interface";
import { ICalendarItem } from "@api/calendar";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { TrainingSeasonService } from "../training-season.service";
import { TrainingSeasonDialogSerivce } from "../training-season-dialog.service";
import { FormMode } from "../../application.interface";
import { IPeriodizationScheme, ISeasonPlan } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { profileShort } from "../../core/user.function";

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

    // inject
    static $inject = ['$scope', '$stateParams', 'CalendarService', 'TrainingSeasonService', 'TrainingSeasonDialogService', 'message'];

    constructor (private $scope: IScope,
                 private $stateParams: any,
                 private calendarService: CalendarService,
                 private trainingSeasonService: TrainingSeasonService,
                 private trainingSeasonDialog: TrainingSeasonDialogSerivce,
                 private messageService: MessageService) {

    }

    $onInit () {

        this.prepareAthletesList();
        this.prepareState();

        this.trainingSeasonService.get({userId: this.currentUser.userId})
            .then(response => this.seasons = response.arrayResult)
            .then(() => this.season = new TrainingSeason(this.seasons[0]))
            .then(() => this.prepareData());
    }

    private prepareState (): void {
        if (this.$stateParams.userId && this.athletes.some(a => a.userId === Number(this.$stateParams.userId))) {
            this.changeOwner(this.athletes.filter(a => a.userId === Number(this.$stateParams.userId))[0]);
            this.isListState = true;
        } else {
            this.isBuilderState = true;
        }
    }

    open (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Post, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) => {}, error => {})
            .then(() => this.update());
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

    changeSeason (season: ISeasonPlan): void {
        this.state = TrainingSeasonViewState.Builder;
        this.season = new TrainingSeason(season);
        this.prepareData();
    }

    changeOwner (user: IUserProfile | IUserProfileShort): void {
        this.owner = user;
        this.trainingSeasonService.get({userId: this.owner.userId})
            .then(response => this.seasons = response.arrayResult, error => this.messageService.toastInfo(error))
            .then(() => this.update());
    }

    private prepareData (): void {
        // 1. Получаем детали по периодизации
        this.trainingSeasonService.getItems(this.season.id)
            .then(
                result => this.data = new TrainingSeasonData(this.season, result.arrayResult),
                error => { })
            // 2. Получаем данные по соревнованиям
            .then(() => this.calendarService.search({
                userIdOwner: this.currentUser.userId,
                calendarItemTypes: ['competition']}))
            .then(
                result => this.data.setCompetitions(result.arrayResult),
                error => { }
            );
    }

    private prepareAthletesList(): void {
        if (this.currentUser.public.isCoach) {
            this.athletes = this.currentUser.connections.allAthletes.groupMembers;
        }
    }

    private update (): void {
        this.$scope.$applyAsync();
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
        state: '<',
        currentUser: '<',
        owner: '<',
        schemes: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingSeasonBuilderCtrl,
    template: require('./training-season-builder.component.html') as string
};

export default TrainingSeasonBuilderComponent;