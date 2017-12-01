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
    currentUser: IUserProfile;
    club: IGroupProfile;
    onEvent: (response: Object) => IPromise<void>;
    categories: IActivityCategory[] = [];
    categoriesByOwner: { [owner in Owner]: IActivityCategory[] };
    templates: IActivityTemplate[] = [];

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

    static $inject = ["$scope", "ReferenceService"];

    constructor (private $scope,
                 private referenceService: ReferenceService) {

    }

    $onInit () {
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

    $onChanges () {
        this.updateFilterParams();
    }

    $onDestroy () {
        this.destroy.next();
        this.destroy.complete();
    }

    private prepareTrainingPlansFilter (): void {
        this.trainingPlansFilter = {
            ownerId: this.currentUser.userId,
        };
    }

    changeTrainingPlansFilter (filter: ITrainingPlanSearchRequest): void {
        this.trainingPlansFilter = filter;
    }

    updateFilterParams () {
        let filters = pick(["club", "activityType", "isActive"])(categoriesFilters);
        let categories = this.categories.filter(filtersToPredicate(filters, this.filterParams));
        let category = this.filterParams.category;

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