import { IComponentController, IComponentOptions, ILocationService } from "angular";
import { StateService} from 'angular-ui-router';
import {Subject} from "rxjs/Rx";
import {
    ITrainingPlanSearchRequest,
    ITrainingPlanSearchResult,
} from "../../../../api/trainingPlans/training-plans.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {getUser, SessionService} from "../../core";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import "./training-plans-store.component.scss";
import AuthService from "@app/auth/auth.service";
import { TrainingPlanDialogService } from "../training-plan-dialog.service";

class TrainingPlansStoreCtrl implements IComponentController {

    // bind
    list: TrainingPlansList;
    onEvent: (response: Object) => Promise<void>;

    // public
    leftBarShow: boolean = true;
    rightBarShow: boolean = false;

    // private
    private user: IUserProfile;
    private plans: TrainingPlansList;
    private searchParams: ITrainingPlanSearchRequest = {};
    private destroy: Subject<any> = new Subject();
    private navBarStates: Array<string> = ['store','purchases'];
    private currentState: string = 'store';
    private storePlansFilter: ITrainingPlanSearchRequest = {};
    private purchasesPlansFilter: ITrainingPlanSearchRequest;
    private storePlansFilterChange: number = 0;
    private leftPanel: boolean;
    private cardView: boolean;
    private readonly urlKeys: Array<string> = ['name', 'type', 'distanceType', 'tags'];
    static $inject = ['$mdMedia', '$state', '$stateParams', '$location', "SessionService",
        "TrainingPlansService", 'TrainingPlanDialogService', 'AuthService'];

    constructor(
        private $mdMedia,
        private $state: StateService,
        private $stateParams: any,
        private $location: ILocationService,
        private session: SessionService,
        private trainingPlansService: TrainingPlansService,
        private trainingPlanDialog: TrainingPlanDialogService,
        private authService: AuthService) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe((userProfile) => this.user = userProfile);
    }

    $onInit (): void {
        this.prepareUrlParams();
        this.prepareStates();
    }

    private prepareUrlParams (): void {
        let clearStateParams = {};
        Object.keys(this.$stateParams).map(k => this.$stateParams[k] && (clearStateParams[k] = this.$stateParams[k]));
        let search: Object = Object.assign(this.$location.search(), clearStateParams);
        ['ownerId', 'name', 'type', 'distanceType', 'weekCountFrom', 'weekCountTo'].map(p => this.storePlansFilter[p] = search[p] || null);
        ['tags','lng'].map(p => this.storePlansFilter[p] = search[p] && (Array.isArray(search[p]) ? search[p] : [search[p]]) || null);


        this.leftPanel = search['leftPanel'] || this.$mdMedia('gt-sm') ? true : false;
        this.cardView = search['cardView'] || true;
        this.purchasesPlansFilter = this.user ? { ownerId: this.user.userId, purchased: true } : {};
    }

    private prepareStates(): void {
        this.setState(this.$stateParams.hasOwnProperty('state') &&
            this.$stateParams.state || this.$location.search().state ?
                this.$stateParams.state || this.$location.search().state :
                this.currentState);
    }

    private setState (state: string): void {
        if (this.navBarStates.indexOf(state) === -1) { return; }
        this.currentState = state;
        this.$location.search('state', state);
    }

    private showLeftPanel (): boolean {
        return this.currentState === 'store' && this.$mdMedia('gt-sm') && this.leftPanel;
    }

    private authCheck (): boolean {
        return this.authService.isAuthenticated();
    }

    changeStorePlansFilter (filter: ITrainingPlanSearchRequest): void {
        debugger;
        this.storePlansFilter = filter;
        this.storePlansFilterChange++;
        Object.keys(this.storePlansFilter).map(k => this.$location.search(k, this.storePlansFilter[k]));
    }

    filter (e: Event): void {
        if (this.$mdMedia('gt-sm')) {
            this.leftPanel = !this.leftPanel;
            this.$location.search('leftPanel', this.leftPanel);
        } else {
            this.trainingPlanDialog.filter(e, this.storePlansFilter)
                .then(response => this.changeStorePlansFilter(response));
        }
    }

    view (): void {
        this.cardView = !this.cardView;
        this.$location.search('cardView', this.cardView);
    }

}

export const TrainingPlansStoreComponent: IComponentOptions = {
    bindings: {
        list: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansStoreCtrl,
    template: require("./training-plans-store.component.html") as string,
};
