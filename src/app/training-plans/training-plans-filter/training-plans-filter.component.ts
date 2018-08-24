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
import DisplayService from "../../core/display.service";
import {deepCopy} from "../../share/data/data.finctions";

export class TrainingPlansFilterCtrl implements IComponentController {

    // bind
    filter: ITrainingPlanSearchRequest;
    view: string;
    onChangeFilter: (response: { filter: ITrainingPlanSearchRequest }) => Promise<void>;

    // public
    // private
    private datamodel: ITrainingPlanSearchRequest;
    private owner: Array<SearchResultByUser> = [];
    private panel: 'plans' | 'events' | 'hide' = 'plans';
    private weekCountRange: any;
    private supportLanguages: Array<string> = supportLng;

    // inject
    static $inject = ['$scope', 'trainingPlanConfig', 'CompetitionConfig', 'SearchService', 'DisplayService'];

    constructor (
        private $scope,
        private config: TrainingPlanConfig,
        private competitionConfig: ICompetitionConfig,
        private searchService: SearchService,
        private displayService: DisplayService) {
        $scope.owner = []; // для fix бага с ng-change в md-contact-chips
    }

    $onInit () {
        this.datamodel = deepCopy(this.filter);
        this.datamodel.keywords = this.datamodel.keywords || [];
        this.datamodel.tags = this.datamodel.tags || [];
        this.datamodel.lng = this.datamodel.lng || []; //[this.displayService.getLocale()];
        if (this.datamodel.weekCountFrom) {
            this.weekCountRange = this.config.weekRanges.findIndex(r => r[0] === this.datamodel.weekCountFrom);
        }
        if (this.datamodel.ownerId) {
            this.getOwner(this.datamodel.ownerId);
        }
        //this.onChangeFilter({filter: this.datamodel});
    }

    onPost (env: Event) {
        //this.trainingPlanDialogService.post(env);
    }

    get distanceType () : any {
        return this.datamodel.type && this.competitionConfig.distanceTypes
                .find((t) => t.type === this.datamodel.type && t.code === this.datamodel.distanceType);
    }

    set distanceType (distanceType: any) {
        distanceType = JSON.parse(distanceType);
        distanceType.hasOwnProperty('code') ?
            this.datamodel.distanceType = distanceType.code : this.datamodel.distanceType = distanceType;
    }

    private change (): void {
        this.onChangeFilter({filter: this.datamodel});
    }

    private toggle (item, list): void {
        let idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item);
        }
        this.onChangeFilter({filter: this.datamodel});
    }

    private exists (item, list): boolean {
        return list && list.indexOf(item) > -1;
    }

    private changeRange (item: Array<number>, param: string ): void {
        [this.datamodel[param+'From'], this.datamodel[param+'To']] = [...item];
        this.onChangeFilter({filter: this.datamodel});
    }

    get isSearch(): boolean {
        return this.view === 'search';
    }

    private changeOwner(owner: Array<SearchResultByUser> = this.$scope.owner): void {
        this.datamodel.ownerId = owner && owner[0] && owner[0].userId || undefined;
        this.onChangeFilter({filter: this.datamodel});
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
        filter: '=',
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