import "./methodology.component.scss";
import { IComponentOptions, IComponentController, IPromise } from "angular";
import { Subject } from "rxjs/Rx";
import ReferenceService from "../reference/reference.service";
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "../reference/reference.datamodel";
import { activityTypes } from "../activity/activity.constants";
import { filtersToPredicate } from "../share/utility";
import { pipe, prop, pick, orderBy, groupBy } from "../share/util";
import { IUserProfile } from "../../../api/user";
import { IGroupProfile } from "../../../api/group";
import { IActivityType } from "../../../api/activity/activity.interface";
import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { PeriodizationService } from "./periodization/periodization.service";
import { IPeriodizationScheme } from "@api/seasonPlanning";

class MethodologyCtrl implements IComponentController {

    // public
    currentUser: IUserProfile;
    club: IGroupProfile;
    onEvent: (response: Object) => IPromise<void>;
    categories: Array<IActivityCategory> = [];
    categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
    templates: Array<IActivityTemplate> = [];

    // private
    private leftBarShow: boolean = true;
    private navBarStates: Array<string> = ['trainingPlans', 'periodization', 'categories', 'templates'];
    private currentState: string = 'trainingPlans';
    private activityTypes: Array<IActivityType> = activityTypes;
    private trainingPlansFilter: ITrainingPlanSearchRequest;
    private trainingPlansFilterChange: number = 0;
    private filterParams: ReferenceFilterParams = {
        club: null,
        activityType: activityTypes[0],
        category: null
    };
    private periodizationData: Array<IPeriodizationScheme>;
    private currentPeriodizationScheme: IPeriodizationScheme;
    private destroy: Subject<void> = new Subject<void>();

    static $inject = ['$scope', 'ReferenceService', 'PeriodizationService'];

    constructor (private $scope,
                 private referenceService: ReferenceService,
                 private periodizationService: PeriodizationService) {

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

        this.periodizationService.get()
            .then(result => this.periodizationData = result.arrayResult);

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
            ownerId: this.currentUser.userId
        };
    }

    selectPeriodizationScheme (scheme: IPeriodizationScheme): void {
        this.currentPeriodizationScheme = scheme;
    }

    changeTrainingPlansFilter (filter: ITrainingPlanSearchRequest): void {
        this.trainingPlansFilterChange++;
        this.trainingPlansFilter = filter;
    }

    updateFilterParams () {
        let filters = pick(['club', 'activityType', 'isActive'])(categoriesFilters);
        let categories = this.categories.filter(filtersToPredicate(filters, this.filterParams));
        let category = this.filterParams.category;

        this.filterParams = {
            ...this.filterParams,
            category: category && categories.find(({ id }) => category.id === id) ? category : categories[0]
        };

        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(this.currentUser))
        )(categories);
    }

    templatesCountByCategory (category: IActivityCategory): number {
        return this.templates.filter(t => t.activityCategory.id === category.id).length;
    }

}

const MethodologyComponent: IComponentOptions = {
    bindings: {
        currentUser: '<',
        club: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: MethodologyCtrl,
    template: require('./methodology.component.html') as string
};

export default MethodologyComponent;