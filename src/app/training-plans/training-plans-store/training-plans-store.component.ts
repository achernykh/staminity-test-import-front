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
    private searchParams: ITrainingPlanSearchRequest;
    private destroy: Subject<any> = new Subject();
    static $inject = ['$location', "SessionService", "TrainingPlansService"];

    constructor(
        private $location: ILocationService,
        private session: SessionService,
        private trainingPlansService: TrainingPlansService) {

        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe((userProfile) => this.user = userProfile);
    }

    $onInit() {
        Object.assign(this.searchParams, {...this.$location.search()});
        this.trainingPlansService.store(this.searchParams)
            .then(result => {debugger;}, error => {debugger;});

    }

    prepareList(result: ITrainingPlanSearchResult) {
        this.plans = new TrainingPlansList(result.items);
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
