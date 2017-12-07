import './training-season-list.component.scss';
import {IComponentOptions, IComponentController, IScope} from 'angular';
import { ISeasonPlan } from "../../../../api/seasonPlanning/seasonPlanning.interface";
import MessageService from "../../core/message.service";
import { TrainingSeasonService } from "../training-season.service";
import { TrainingSeasonDialogSerivce } from "../training-season-dialog.service";
import { FormMode } from "../../application.interface";
import { TrainingSeason } from "../training-season/training-season.datamodel";
import { IUserProfile } from "../../../../api/user/user.interface";
import { profileShort } from "../../core/user.function";
import { TrainingSeasonData } from "../training-season-data/training-season-data.datamodel";

class TrainingSeasonListCtrl implements IComponentController {

    // bind
    data: Array<ISeasonPlan>;
    owner: IUserProfile;
    onSelect: (response: { season: ISeasonPlan }) => Promise<void>;

    // private
    private seasons: Array<ISeasonPlan>;
    private selected: Array<any> = [];

    static $inject = ['$scope', 'TrainingSeasonService', 'TrainingSeasonDialogService', 'message'];

    constructor(private $scope: IScope,
                private trainingSeasonService: TrainingSeasonService,
                private trainingSeasonDialog: TrainingSeasonDialogSerivce,
                private messageService: MessageService) {

    }

    $onInit() {
        this.prepareData();
    }

    $onChanges (change): void {
        if(change.hasOwnProperty('data') && !change.data.isFirstChange()) {
            this.prepareData();
        }
    }

    openMenu ($mdMenu, ev) {
        $mdMenu.open(ev);
    }

    post (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Post, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) =>
                response.mode === FormMode.Post && this.postData(response.season),
                error => {})
            .then(season => this.fillSeason(season))
            .then(() => this.update());
    }

    open (season: TrainingSeason): void {
        this.onSelect({season: season});
    }

    edit (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Put, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) => {}, error => {})
            .then(() => this.update());
    }

    delete (season: TrainingSeason): void {
        this.trainingSeasonService.delete(season)
            .then(response => this.messageService.toastInfo('trainingSeason.seasonDeleted'),
                error => this.messageService.toastError(error))
            .then(() => this.deleteData(season));
    }

    /**
     * Заполняем Сезон микроциклами
     * По всем неделям создаются пустые микроциклы, это позволит получить факт по всем сторокам плана
     * @param season
     * @returns {Promise<void>}
     */
    private fillSeason (season: TrainingSeason): Promise<any> {
        let data: TrainingSeasonData = new TrainingSeasonData(season, []);
        return Promise.all(<Array<Promise<any>>>data.grid.map(c =>
            this.trainingSeasonService.postItem(season.id, c.prepare())))
            .then(() => this.open(season));
    }

    private postData (season: TrainingSeason): TrainingSeason {
        this.seasons.push(season);
        return season;
    }

    private deleteData (season: TrainingSeason): void {
        let ind: number = this.seasons.findIndex(s => s.id === season.id);
        this.seasons.splice(ind,1);
    }

    private prepareData (): void {
        this.seasons = this.data && [...this.data];
    }

    private update (): void {
        this.$scope.$applyAsync();
    }

}

export const TrainingSeasonListComponent:IComponentOptions = {
    bindings: {
        data: '<',
        owner: '<',
        onSelect: '&'
    },
    controller: TrainingSeasonListCtrl,
    template: require('./training-season-list.component.html') as string
};