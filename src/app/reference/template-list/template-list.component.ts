import "./template-list.component.scss";
import { IScope, IComponentOptions, IComponentController } from "angular";
import { pipe, prop, pick, orderBy, groupBy, filter } from "../../share/utility";
import { filtersToPredicate } from "../../share/utility/filtering";
import { IUserProfile, IUserProfilePublic } from "../../../../api/user/user.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IGroupProfile } from "../../../../api/group/group.interface";
import { activityTypes } from "../../activity/activity.constants";
import ReferenceService from "../reference.service";
import { Owner, getOwner, ReferenceFilterParams, categoriesFilters, templatesFilters } from "../reference.datamodel";
import { Subject } from "rxjs/Rx";
import { ICalendarItem } from "@api/calendar";
import {CalendarItemDialogService} from "@app/calendar-item/calendar-item-dialog.service";
import {ICalendarItemDialogOptions} from "@app/calendar-item/calendar-item-dialog.interface";
import {FormMode} from "../../application.interface";
import {PremiumDialogService} from "@app/premium/premium-dialog/premium-dialog.service";
import AuthService from "@app/auth/auth.service";

class TemplateListCtrl implements IComponentController {

    // bind
    currentUser: IUserProfile | IUserProfilePublic;
    onSelect: (response: Object) => Promise<void>;
    onDrop: (response: {template: IActivityTemplate, date: string}) => Promise<void>;

    // private
    private destroy: Subject<void> = new Subject<void>();
    public categories: Array<IActivityCategory> = [];
    public categoriesByOwner: { [owner in Owner]: Array<IActivityCategory> };
    public templates: Array<IActivityTemplate> = [];
    private templatesByOwner: { [owner in Owner]: Array<IActivityTemplate> };
    public clubUri: string;
    public club: IGroupProfile;
    private activityTypes = activityTypes;
    private filterParams: ReferenceFilterParams = {
        club: null,
        activityType: activityTypes[0],
        category: null
    };
    private dialogOptions: ICalendarItemDialogOptions;

    // inject
    static $inject = ['$scope', 'ReferenceService', 'CalendarItemDialogService', 'PremiumDialogService', 'AuthService'];

    constructor (
        private $scope: IScope,
        private referenceService: ReferenceService,
        private calendarDialog: CalendarItemDialogService,
        private premiumDialogService: PremiumDialogService,
        private authService: AuthService) {

    }

    $onInit () {
        this.categories = this.referenceService.categories;
        this.referenceService.categoriesChanges
            .takeUntil(this.destroy)
            .subscribe((categories) => {
                this.categories = categories;
                this.updateFilterParams();
                this.$scope.$applyAsync();
            });

        this.templates = this.referenceService.templates;
        this.referenceService.templatesChanges
            .takeUntil(this.destroy)
            .subscribe((templates) => {
                this.templates = templates.map(t => Object.assign(t, {index: Number(`${t.id}${t.revision}`)}));
                this.updateFilterParams();
                this.$scope.$applyAsync();
            });

        this.updateFilterParams();

        this.dialogOptions = {
            currentUser: this.currentUser,
            owner: this.currentUser,
            popupMode: true,
            formMode: FormMode.Post,
            trainingPlanMode: false,
            templateMode: true,
            templateOptions: {
                templateId: null,
                code: null,
                visible: true,
                favourite: false,
                groupProfile: this.club
            }
        };
    }

    $onChanges () {
        this.updateFilterParams();
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

        filters = pick(['club', 'activityType', 'category']) (templatesFilters);

        this.templatesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop('sortOrder')),
            //groupBy(getOwner(this.currentUser)),
        ) (this.templates);

    }

    dropTemplate (srcItem: IActivityTemplate, operation: string, srcIndex: number, trgDate: string, trgIndex: number) {
        this.onDrop({template: srcItem, date: trgDate});
    }

    checkAuth (): boolean {
        return this.authService.isCoach() || this.authService.isPremiumAccount();
    }

    post (e: Event): void {
        if (this.checkAuth()) {
            this.calendarDialog.activity(e, this.dialogOptions).then(response => {});
        } else {
            this.premiumDialogService.open(e, 'templates');
        }
    }


}

const TemplateListComponent: IComponentOptions = {
    bindings: {
        currentUser: '<',
        onDrop: '&',
        onSelect: '&'
    },
    controller: TemplateListCtrl,
    template: require('./template-list.component.html') as string
};

export default TemplateListComponent;