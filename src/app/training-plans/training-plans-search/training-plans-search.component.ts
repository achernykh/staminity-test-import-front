import { IComponentController, IComponentOptions, IPromise } from "angular";
import {Subject} from "rxjs/Rx";
import {
    ITrainingPlanSearchRequest,
    ITrainingPlanSearchResult,
} from "../../../../api/trainingPlans/training-plans.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {getUser, SessionService} from "../../core";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";
import { TrainingPlansService } from "../training-plans.service";
import "./training-plans-search.component.scss";

class TrainingPlansSearchCtrl implements IComponentController {

    // bind
    public list: TrainingPlansList;
    public onEvent: (response: Object) => IPromise<void>;

    // public
    public leftBarShow: boolean = true;
    public rightBarShow: boolean = false;

    // private
    private user: IUserProfile;
    private plans: TrainingPlansList;

    private searchParams: ITrainingPlanSearchRequest;
    private destroy: Subject<any> = new Subject();
    public static $inject = ["SessionService", "TrainingPlansService"];

    constructor(private session: SessionService, private trainingPlansService: TrainingPlansService) {
        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe((userProfile) => this.user = userProfile);

        this.searchParams = {
            ownerId: this.user.userId,
        };

        this.trainingPlansService.search(this.searchParams)
            .then(
                this.prepareList.bind(this),
                (error) => {debugger; },
            );

    }

    public $onInit() {

    }

    public prepareList(result: ITrainingPlanSearchResult) {

        this.plans = new TrainingPlansList(result.items);
    }

}

const TrainingPlansSearchComponent: IComponentOptions = {
    bindings: {
        list: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansSearchCtrl,
    template: require("./training-plans-search.component.html") as string,
};

export default TrainingPlansSearchComponent;
