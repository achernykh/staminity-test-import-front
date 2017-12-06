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

    post (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Post, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) =>
                response.mode === FormMode.Post && this.postData(response.season),
                error => {})
            .then(() => this.update());
    }

    open (env: Event): void {
        this.trainingSeasonDialog.open(env, FormMode.Post, Object.assign({}, { userProfileOwner: profileShort(this.owner) }))
            .then((response: {mode: FormMode, season: TrainingSeason}) => {}, error => {})
            .then(() => this.update());
    }

    delete (season: TrainingSeason): void {
        this.trainingSeasonService.delete(season)
            .then(response => this.messageService.toastInfo('trainingSeason.seasonDeleted'),
                error => this.messageService.toastError(error))
            .then(() => this.deleteData(season));
    }

    private postData (season): void {
        this.seasons.push(season);
    }

    private deleteData (season: TrainingSeason): void {

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