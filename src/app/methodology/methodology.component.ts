import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { IComponentController, IComponentOptions, IPromise } from "angular";
import { Subject } from "rxjs/Rx";
import { IActivityType } from "../../../api/activity/activity.interface";
import { IGroupProfile } from "../../../api/group";
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { IUserProfile } from "../../../api/user";
import { activityTypes } from "../activity/activity.constants";
import { categoriesFilters, getOwner, Owner, ReferenceFilterParams } from "../reference/reference.datamodel";
import ReferenceService from "../reference/reference.service";
import { groupBy, orderBy, pick, pipe, prop } from "../share/util";
import { filtersToPredicate } from "../share/utility";
import "./methodology.component.scss";

class MethodologyCtrl implements IComponentController {

    // public
    public currentUser: IUserProfile;
    public club: IGroupProfile;
    public onEvent: (response: Object) => IPromise<void>;
    public categories: IActivityCategory[] = [];
    public categoriesByOwner: { [owner in Owner]: IActivityCategory[] };
    public templates: IActivityTemplate[] = [];

    // private
    private leftBarShow: boolean = true;
    private navBarStates: string[] = ["trainingPlans", "periodization", "categories", "templates"];
    private currentState: string = "trainingPlans";
    private activityTypes: IActivityType[] = activityTypes;
    private trainingPlansFilter: ITrainingPlanSearchRequest;
    private filterParams: ReferenceFilterParams = {
        club: null,
        activityType: activityTypes[0],
        category: null,
    };
    private destroy: Subject<void> = new Subject<void>();

    public static $inject = ["$scope", "ReferenceService"];

    constructor(private $scope,
                private referenceService: ReferenceService) {

    }

    public $onInit() {
        this.filterParams.club = this.club;

        this.categories = this.referenceService.categories;
        this.referenceService.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe((categories) => {
                this.categories = categories;
                this.updateFilterParams();
                this.$scope.$apply();
            });

        this.templates = this.referenceService.templates;
        this.referenceService.templatesChanges
            .takeUntil(this.destroy)
            .subscribe((templates) => {
                this.templates = templates;
                this.updateFilterParams();
                this.$scope.$apply();
            });

        this.prepareTrainingPlansFilter();
        this.updateFilterParams();
    }

    public $onChanges() {
        this.updateFilterParams();
    }

    public $onDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareTrainingPlansFilter(): void {
        this.trainingPlansFilter = {
            ownerId: this.currentUser.userId,
        };
    }

    public changeTrainingPlansFilter(filter: ITrainingPlanSearchRequest): void {
        this.trainingPlansFilter = filter;
    }

    public updateFilterParams() {
        const filters = pick(["club", "activityType", "isActive"])(categoriesFilters);
        const categories = this.categories.filter(filtersToPredicate(filters, this.filterParams));
        const category = this.filterParams.category;

        this.filterParams = {
            ...this.filterParams,
            category: category && categories.find(({ id }) => category.id === id) ? category : categories[0],
        };

        this.categoriesByOwner = pipe(
            orderBy(prop("sortOrder")),
            groupBy(getOwner(this.currentUser)),
        )(categories);
    }

}

const MethodologyComponent: IComponentOptions = {
    bindings: {
        currentUser: "<",
        club: "<",
        onEvent: "&",
    },
    require: {
        //component: '^component'
    },
    controller: MethodologyCtrl,
    template: require("./methodology.component.html") as string,
};

export default MethodologyComponent;
