import { IComponentController, IComponentOptions, ILocationService } from "angular";
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
    private readonly urlKeys: Array<string> = ['name', 'type', 'distanceType', 'tags'];
    static $inject = ['$stateParams', '$location', "SessionService", "TrainingPlansService", 'AuthService'];

    constructor(
        private $stateParams: any,
        private $location: ILocationService,
        private session: SessionService,
        private trainingPlansService: TrainingPlansService,
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
        debugger;
        ['name', 'type', 'distanceType'].map(p => this.storePlansFilter[p] = this.$location.search()[p] || null);
        ['tags'].map(p => this.$location.search()[p] && (this.storePlansFilter[p] =
             Array.isArray(this.$location.search()[p]) ? this.$location.search()[p] : [this.$location.search()[p]]));
        this.purchasesPlansFilter = this.user ? { ownerId: this.user.userId, purchased: true } : {};
    }

    private prepareStates(): void {
        this.setState(this.$stateParams.hasOwnProperty('state') &&
            this.$stateParams.state ? this.$stateParams.state : this.currentState);
    }

    private setState (state: string): void {
        if (this.navBarStates.indexOf(state) === -1) { return; }
        this.currentState = state;
        this.$location.search('state', state);
    }

    private leftPanel (): boolean {
        return this.currentState === 'store';
    }

    private authCheck (): boolean {
        return this.authService.isAuthenticated();
    }

    changeStorePlansFilter (filter: ITrainingPlanSearchRequest): void {
        this.storePlansFilter = filter;
        this.storePlansFilterChange++;
        Object.keys(this.storePlansFilter).map(k => this.$location.search(k, this.storePlansFilter[k]));
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
