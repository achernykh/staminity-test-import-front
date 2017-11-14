import "./training-plans-search.component.scss";
import { IComponentOptions, IComponentController, IPromise } from "angular";
import { TrainingPlansList } from "../training-plans-list/training-plans-list.datamodel";
import {
    ITrainingPlanSearchRequest,
    ITrainingPlanSearchResult
} from "../../../../api/trainingPlans/training-plans.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {SessionService, getUser} from "../../core";
import {Subject} from "rxjs/Rx";
import { TrainingPlansService } from "../training-plans.service";

class TrainingPlansSearchCtrl implements IComponentController {

    // bind
    list: TrainingPlansList;
    onEvent: (response: Object) => IPromise<void>;

    // public
    leftBarShow: boolean = true;
    rightBarShow: boolean = false;

    // private
    private user: IUserProfile;
    private plans: TrainingPlansList;

    private searchParams: ITrainingPlanSearchRequest;
    private destroy: Subject<any> = new Subject();
    static $inject = ['SessionService', 'TrainingPlansService'];

    constructor (private session: SessionService, private trainingPlansService: TrainingPlansService) {
        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(userProfile => this.user = userProfile);

        this.searchParams = {
            ownerId: this.user.userId
        };

        this.trainingPlansService.search(this.searchParams)
            .then(
                this.prepareList.bind(this),
                error => {debugger;}
            );


    }

    $onInit () {

    }

    prepareList (result: ITrainingPlanSearchResult) {

        this.plans = new TrainingPlansList(result.items);
    }

}

const TrainingPlansSearchComponent: IComponentOptions = {
    bindings: {
        list: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: TrainingPlansSearchCtrl,
    template: require('./training-plans-search.component.html') as string
};

export default TrainingPlansSearchComponent;