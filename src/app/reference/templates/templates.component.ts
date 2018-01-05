import { IComponentOptions, IComponentController, IPromise, element } from 'angular';
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { IGroupProfile } from "../../../../api/group/group.interface";

import IMessageService from "../../core/message.service";
import ReferenceService from "../reference.service";
import DialogsService from '../../share/dialogs';
import { getType } from "../../activity/activity.constants";
import { pipe, prop, pick, last, filter, fold, orderBy, groupBy, keys, entries, isUndefined, log } from '../../share/util.js';
import { ReferenceFilterParams, templatesFilters, Owner, isSystem, getOwner, isOwner } from "../reference.datamodel";
import { filtersToPredicate } from "../../share/utility/filtering";
import { templateDialog, TemplateDialogMode } from "../template-dialog/template.dialog";
import { isManager } from "../../club/club.datamodel";
import "./templates.component.scss";
import { CalendarItemDialogService } from "../../calendar-item/calendar-item-dialog.service";
import { ICalendarItemDialogOptions } from "../../calendar-item/calendar-item-dialog.interface";
import { FormMode } from "../../application.interface";


class TemplatesCtrl implements IComponentController {

    public user: IUserProfile;
    public categories: Array<IActivityCategory>;
    public templates: Array<IActivityTemplate>;
    public club: IGroupProfile;
    public filterParams: ReferenceFilterParams;
    
    private templatesByOwner: { [owner in Owner]: Array<IActivityTemplate> };
    private dialogOptions: ICalendarItemDialogOptions;

    static $inject = ['$scope', '$mdDialog', '$mdMedia', 'message', 'dialogs', 'ReferenceService',
        'CalendarItemDialogService'];

    constructor (
        private $scope, 
        private $mdDialog, 
        private $mdMedia, 
        private message: IMessageService,
        private dialogs: DialogsService,
        private ReferenceService: ReferenceService,
        private calendarDialog: CalendarItemDialogService
    ) {

    }

    $onInit (): void {
        this.dialogOptions = {
            currentUser: this.user,
            owner: this.user,
            popupMode: true,
            formMode: FormMode.Post,
            trainingPlanMode: false,
            planId: null,
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

    $onChanges (changes) {
        this.handleChanges();
    }

    handleChanges () {
        let filters = pick(['club', 'activityType', 'category']) (templatesFilters);
        
        this.templatesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop('sortOrder')),
            groupBy(getOwner(this.user)),
        ) (this.templates);
    }

    templateReorder (index: number, template: IActivityTemplate) {
        let { id, activityCategory, code, description, groupProfile, favourite, visible, content } = template;
        let owner = getOwner(this.user)(template);
        let groupId = groupProfile && groupProfile.groupId;
        let activityCategoryId = activityCategory && activityCategory.id;
        let targetTemplate = this.templatesByOwner[owner][index];
        let sortOrder = targetTemplate? targetTemplate.sortOrder : 999999;

        this.ReferenceService.putActivityTemplate(id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible, content)
        .catch((info) => { 
            this.message.systemWarning(info);
            throw info;
        });
    }

    createTemplate (targetEvent: MouseEvent) {
        let activityTypeId = this.filterParams.activityType.id;
        let category = this.filterParams.category;
        
        let template = <any> {
            activityType: getType(activityTypeId),
            activityCategory: category,
            userProfileCreator: this.user,
            groupProfile: this.club
        };
        
        return this.$mdDialog.show(templateDialog('post', template, this.user, { targetEvent }));
    }

    post (e: Event): void {
        this.calendarDialog.activity(e, this.dialogOptions).then(response => {});
    }

    copyTemplate (template: IActivityTemplate) {
        let { id, activityCategory, code, description, groupProfile, favourite, content } = template;
        let groupId = groupProfile && groupProfile.groupId;
        let activityCategoryId = activityCategory && activityCategory.id;

        this.ReferenceService.postActivityTemplate(
            null, activityCategoryId, groupId, code, description, favourite, content
        )
        .catch((info) => { 
            this.message.systemWarning(info);
            throw info;
        });
    }

    openTemplate (template: IActivityTemplate, targetEvent: MouseEvent) {
        let mode: TemplateDialogMode = isOwner(this.user, template) || isManager(this.user, this.club)? 'put' : 'view';
        return this.$mdDialog.show(templateDialog(mode, template, this.user, { targetEvent }));
    }

    deleteTemplate (template: IActivityTemplate) {
        let { id } = template;
        return this.dialogs.confirm({ text: 'reference.templates.confirmDelete' })
            .then(() => this.ReferenceService.deleteActivityTemplate(id))
            .catch((error) => { 
                if (error) {
                    this.message.systemWarning(error); 
                }
            });
    }
}


const TemplatesComponent: IComponentOptions = {
    require: {
        //reference: '^'
    },
    bindings: {
        user: '<',
        categories: '<',
        templates: '<',
        filterParams: '<',
        club: '<'
    },
    controller: TemplatesCtrl,
    template: require('./templates.component.html') as string
};


export default TemplatesComponent;