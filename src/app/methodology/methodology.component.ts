import "./methodology.component.scss";
import { IComponentOptions, IComponentController, ILocationService } from "angular";
import { Subject } from "rxjs/Rx";
import ReferenceService from "../reference/reference.service";
import { IActivityCategory, IActivityTemplate } from "../../../api/reference/reference.interface";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters } from "../reference/reference.datamodel";
import { activityTypes } from "../activity/activity.constants";
import { filtersToPredicate } from "../share/utility/filtering";
import { pipe, prop, pick, orderBy, groupBy } from "../share/util";
import { IUserProfile } from "../../../api/user";
import { IGroupProfile } from "../../../api/group";
import { IActivityType } from "../../../api/activity/activity.interface";
import { ITrainingPlanSearchRequest } from "@api/trainingPlans";
import { PeriodizationService } from "./periodization/periodization.service";
import { IPeriodizationScheme } from "@api/seasonPlanning";
import AuthService from "../auth/auth.service";

class MethodologyCtrl implements IComponentController {

    // public
    currentUser: IUserProfile;
    club: IGroupProfile;
    onEvent: (response: Object) => Promise<void>;
    categories: Array<IActivityCategory> = [];
    categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
    templates: Array<IActivityTemplate> = [];

    // private
    private leftBarShow: boolean = true;
    private navBarStates: Array<string> = ['trainingPlans','periodization', 'categories', 'templates'];
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

    static $inject = ['$scope', '$stateParams', '$location', 'ReferenceService', 'PeriodizationService', 'AuthService'];

    constructor (private $scope,
                 private $stateParams: any,
                 private $location: ILocationService,
                 private referenceService: ReferenceService,
                 private periodizationService: PeriodizationService,
                 private authService: AuthService) {

    }

    $onInit (): void {
        this.filterParams.club = this.club;
        this.prepareStates();
        this.getCategories();
        this.getTemplates();
        this.getSchemes();
        this.prepareTrainingPlansFilter();
        this.updateFilterParams();
    }

    $onChanges (): void {
        this.updateFilterParams();
    }

    $onDestroy (): void {
        this.destroy.next();
        this.destroy.complete();
    }

    checkAuth (): boolean {
        switch (this.currentState) {
            case 'trainingPlans': {
                return this.currentUser.public.isCoach;
            }
            case 'periodization': case 'categories': case 'templates': {
                return this.authService.isAuthorized(['ActivitiesPlan_User', 'ActivitiesPlan_Athletes'], false);
            }
            default: {
                return true;
            }
        }
    }

    private prepareStates(): void {
        if (this.club) {
            this.navBarStates = ['categories', 'templates'];
            this.currentState = 'categories';
        } else {
            this.setState(this.$stateParams.hasOwnProperty('state') &&
                this.$stateParams.state ? this.$stateParams.state : this.currentState);
        }
    }

    private getSchemes (): void {
        this.periodizationService.get()
            .then(result => result.arrayResult &&
            this.setPeriodizationData(result.arrayResult,
                this.$stateParams.scheme ? Number(this.$stateParams.scheme) : null));
    }

    private getCategories (): void {
        this.categories = this.referenceService.categories;
        this.referenceService.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe((categories) => {
                this.categories = categories;
                this.updateFilterParams();
                this.$scope.$apply();
            });
    }

    private getTemplates (): void {
        this.templates = this.referenceService.templates;
        this.referenceService.templatesChanges
            .takeUntil(this.destroy)
            .subscribe((templates) => {
                this.templates = templates;
                this.updateFilterParams();
                this.$scope.$apply();
            });
    }

    private setState (state: string): void {
        if (this.navBarStates.indexOf(state) === -1) { return; }
        this.currentState = state;
        this.$location.search('state', state);
    }

    private setPeriodizationData (schemes: Array<IPeriodizationScheme>, id: number): void {
        this.periodizationData = schemes;
        this.setPeriodizationScheme(id ? this.periodizationData.filter(s => s.id === id) : this.periodizationData[0]);
    }

    private prepareTrainingPlansFilter (): void {
        this.trainingPlansFilter = {
            ownerId: this.currentUser.userId
        };
    }

    setPeriodizationScheme (scheme: IPeriodizationScheme): void {
        this.currentPeriodizationScheme = scheme;
        if (this.currentState === 'periodization') {
            this.$location.search('scheme', scheme.id);
        }
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
        return this.templates.filter(t => t.activityCategory.id === category.id && ((this.club && t.groupProfile && t.groupProfile.groupId === this.club.groupId) || !this.club)).length;
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