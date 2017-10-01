import './training-plans-search.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {TrainingPlansList} from "../training-plans-list/training-plans-list.datamodel";
import {
    ITrainingPlanSearchRequest,
    ITrainingPlanSearchResult
} from "../../../../api/trainingPlans/training-plans.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {profileShort} from "../../core/user.function";
import {timestamp} from "rxjs/operator/timestamp";
import {ISessionService, getUser} from "../../core/session.service";
import {Subject} from "rxjs/Rx";

class TrainingPlansSearchCtrl implements IComponentController {

    public list: TrainingPlansList;
    public onEvent: (response: Object) => IPromise<void>;

    private user: IUserProfile;
    private demoList: TrainingPlansList;

    private destroy: Subject<any> = new Subject();
    static $inject = ['SessionService'];

    constructor(private session: ISessionService) {
        session.getObservable()
            .takeUntil(this.destroy)
            .map(getUser)
            .subscribe(userProfile => {
                this.user = userProfile;
                this.prepareDemoList();
            });
    }

    $onInit() {
    }

    private prepareDemoList() {
        let searchResult: Array<ITrainingPlanSearchResult> = [];
        Array.from(new Array(40)).map((p,i) => searchResult.push({
            id: i + 1,
            isPublic: i % 5 === 0 ? true : false,
            name: `Марафон версия #${i}`,
            author: profileShort(this.user),
            weekCount: Math.random() * (30 - 4) + 4,
            distance: (Math.random() * (120 - 20) + 20) * 1000,
            icon: null,
            rate: Math.random() * (5 - 1) + 1,
            price: Math.random() * (6000 - 500) + 500,
            currency: 'RUB',
            priceIsApprox: i % 4 === 0 ? true : false,
            isCommercial: i % 6 === 0 ? true : false,
            totalFound: null
        }));

        this.demoList = new TrainingPlansList(searchResult);
    }
}

const TrainingPlansSearchComponent:IComponentOptions = {
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