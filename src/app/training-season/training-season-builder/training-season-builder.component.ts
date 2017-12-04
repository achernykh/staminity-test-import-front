import "./training-season-builder.component.scss";
import { IComponentOptions, IComponentController, IScope } from "angular";
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile } from "../../../../api/user/user.interface";
import { ICalendarItem } from "@api/calendar";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";
import { CalendarService } from "../../calendar/calendar.service";
import MessageService from "../../core/message.service";
import { TrainingSeasonService } from "../training-season.service";
import { TrainingSeasonDialogSerivce } from "../training-season-dialog.service";
import { FormMode } from "../../application.interface";
import { IPeriodizationScheme, ISeasonPlan } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import { profileShort } from "../../core/user.function";

class TrainingSeasonBuilderCtrl implements IComponentController {
    // bind
    seasons: Array<ISeasonPlan>;
    currentUser: IUserProfile;
    owner: IUserProfile;
    schemes: Array<IPeriodizationScheme>;

    // private
    private season: TrainingSeason;
    private competitions: Array<ICalendarItem>;
    private data: TrainingSeasonData;

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
        if ( this.seasons && this.seasons ) {
            this.season = new TrainingSeason(this.seasons[0]);
        }
        this.prepareData();
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
        this.season = new TrainingSeason(season);
        this.prepareData();
    }

    private prepareData (): void {
        // 1. Получаем детали по периодизации
        this.trainingSeasonService.get({ userId: this.currentUser.userId })
            .then(
                success => { },
                error => { }
            );

        // 2. Получаем перечень соревнований
        this.calendarService.search({
            userIdOwner: this.currentUser.userId,
            calendarItemTypes: ['competition']
        }).then(
            result => this.data.setCompetitions(result.arrayResult),
            error => { }
        );
        // 3. Строим модель периодиацзии
        this.data = new TrainingSeasonData(this.season, []);
    }

    private update (): void {
        this.$scope.$applyAsync();
    }
}

const TrainingSeasonBuilderComponent: IComponentOptions = {
    bindings: {
        seasons: '<',
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