import './training-plans-filter.component.scss';
import { IComponentOptions, IComponentController, IPromise, IScope } from 'angular';
import { TrainingPlan } from "../training-plan/training-plan.datamodel";
import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { TrainingPlanDialogService } from "@app/training-plans/training-plan-dialog.service";
import { TrainingPlanConfig } from "@app/training-plans/training-plan/training-plan.config";
import { ICompetitionConfig } from "@app/calendar-item/calendar-item-competition/calendar-item-competition.config";
import { supportLng } from "../../core/display.constants";
import { SearchService } from "../../search/search.service";
import { SearchResultByUser } from "../../search/search";

class TrainingPlansFilterCtrl implements IComponentController {

    // bind
    filter: ITrainingPlanSearchRequest;
    view: string;
    onChangeFilter: (response: { filter: ITrainingPlanSearchRequest }) => IPromise<void>;

    // public
    // private
    private owner: Array<SearchResultByUser> = [];
    private panel: 'plans' | 'events' | 'hide' = 'plans';
    private weekCountRange: number;
    private supportLanguages: Array<string> = supportLng;

    // inject
    static $inject = ['$scope', 'TrainingPlanDialogService', 'trainingPlanConfig', 'CompetitionConfig', 'SearchService'];

    constructor (
        private $scope,
        private trainingPlanDialogService: TrainingPlanDialogService,
        private config: TrainingPlanConfig,
        private competitionConfig: ICompetitionConfig,
        private searchService: SearchService) {
        $scope.owner = []; // для fix бага с ng-change в md-contact-chips
    }

    $onInit () {
        this.filter.keywords = this.filter.keywords || [];
        this.filter.tags = this.filter.tags || [];
        //this.filter.lang = this.filter.lang || [];
        if (this.filter.weekCountFrom) {
            this.weekCountRange = this.config.weekRanges.findIndex(r => r[0] === this.filter.weekCountFrom);
        }
        if (this.filter.ownerId) {
            this.getOwner(this.filter.ownerId);
        }
        //this.onChangeFilter({filter: this.filter});
    }

    onPost (env: Event) {
        //this.trainingPlanDialogService.post(env);
    }

    get distanceType () : any {
        return this.filter.type && this.competitionConfig.distanceTypes
                .find((t) => t.type === this.filter.type && t.code === this.filter.distanceType);
    }

    set distanceType (distanceType: any) {
        distanceType.hasOwnProperty('code') ?
            this.filter.distanceType = distanceType.code : this.filter.distanceType = distanceType;
    }

    private change (): void {
        this.onChangeFilter({filter: this.filter});
    }

    private toggle (item, list): void {
        let idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
        this.onChangeFilter({filter: this.filter});
    }

    private exists (item, list): boolean {
        return list && list.indexOf(item) > -1;
    }

    private changeRange (item: Array<number>, param: string ): void {
        [this.filter[param+'From'], this.filter[param+'To']] = [...item];
        this.onChangeFilter({filter: this.filter});
    }

    get isSeacrh(): boolean {
        return this.view === 'search';
    }

    private changeOwner(owner: Array<SearchResultByUser> = this.$scope.owner): void {
        this.filter.ownerId = owner && owner[0] && owner[0].userId || undefined;
        this.onChangeFilter({filter: this.filter});
    }

    // async owner
    private ownerSearch (criteria): Promise<any> {
        return this.searchService.request('byParams', {objectType: 'user', name: criteria});
    }

    private getOwner (id: number) {
        this.searchService.request('byParams', {objectType: 'user', userId: Number(id)})
            .then(r => this.$scope.owner = r as Array<SearchResultByUser>);
    }
}

const TrainingPlansFilterComponent: IComponentOptions = {
    bindings: {
        view: '=',
        filter: '<',
        dialog: '=',
        onHide: '&',
        onChangeFilter: '&',
        onSearch: '&',
        onCancel: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansFilterCtrl,
    template: require('./training-plans-filter.component.html') as string
};

export default TrainingPlansFilterComponent;