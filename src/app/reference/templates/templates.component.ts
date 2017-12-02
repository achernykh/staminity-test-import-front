import { element, IComponentController, IComponentOptions, IPromise } from "angular";
import { IGroupProfile } from "../../../../api/group/group.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

import { getType } from "../../activity/activity.constants";
import { isManager } from "../../club/club.datamodel";
import IMessageService from "../../core/message.service";
import DialogsService from "../../share/dialogs";
import { entries, filter, fold, groupBy, isUndefined, keys, last, log, orderBy, pick, pipe, prop } from "../../share/util.js";
import { filtersToPredicate } from "../../share/utility";
import { getOwner, isOwner, isSystem, Owner, ReferenceFilterParams, templatesFilters } from "../reference.datamodel";
import ReferenceService from "../reference.service";
import { templateDialog, TemplateDialogMode } from "../template-dialog/template.dialog";
import "./templates.component.scss";

class TemplatesCtrl implements IComponentController {

    public user: IUserProfile;
    public categories: IActivityCategory[];
    public templates: IActivityTemplate[];
    public club: IGroupProfile;
    public filterParams: ReferenceFilterParams;

    private templatesByOwner: { [owner in Owner]: IActivityTemplate[] };

    public static $inject = ["$scope", "$mdDialog", "$mdMedia", "message", "dialogs", "ReferenceService"];

    constructor(
        private $scope,
        private $mdDialog,
        private $mdMedia,
        private message: IMessageService,
        private dialogs: DialogsService,
        private ReferenceService: ReferenceService,
    ) {

    }

    public $onChanges(changes) {
        this.handleChanges();
    }

    public handleChanges() {
        const filters = pick(["club", "activityType", "category"]) (templatesFilters);

        this.templatesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop("sortOrder")),
            groupBy(getOwner(this.user)),
        ) (this.templates);
    }

    public templateReorder(index: number, template: IActivityTemplate) {
        const { id, activityCategory, code, description, groupProfile, favourite, visible, content } = template;
        const owner = getOwner(this.user)(template);
        const groupId = groupProfile && groupProfile.groupId;
        const activityCategoryId = activityCategory && activityCategory.id;
        const targetTemplate = this.templatesByOwner[owner][index];
        const sortOrder = targetTemplate ? targetTemplate.sortOrder : 999999;

        this.ReferenceService.putActivityTemplate(id, activityCategoryId, groupId, sortOrder, code, description, favourite, visible, content)
        .catch((info) => {
            this.message.systemWarning(info);
            throw info;
        });
    }

    public createTemplate(targetEvent: MouseEvent) {
        const activityTypeId = this.filterParams.activityType.id;
        const category = this.filterParams.category;

        const template = {
            activityType: getType(activityTypeId),
            activityCategory: category,
            userProfileCreator: this.user,
            groupProfile: this.club,
        } as any;

        return this.$mdDialog.show(templateDialog("post", template, this.user, { targetEvent }));
    }

    public copyTemplate(template: IActivityTemplate) {
        const { id, activityCategory, code, description, groupProfile, favourite, content } = template;
        const groupId = groupProfile && groupProfile.groupId;
        const activityCategoryId = activityCategory && activityCategory.id;

        this.ReferenceService.postActivityTemplate(
            null, activityCategoryId, groupId, code, description, favourite, content,
        )
        .catch((info) => {
            this.message.systemWarning(info);
            throw info;
        });
    }

    public openTemplate(template: IActivityTemplate, targetEvent: MouseEvent) {
        const mode: TemplateDialogMode = isOwner(this.user, template) || isManager(this.user, this.club) ? "put" : "view";
        return this.$mdDialog.show(templateDialog(mode, template, this.user, { targetEvent }));
    }

    public deleteTemplate(template: IActivityTemplate) {
        const { id } = template;
        return this.dialogs.confirm({ text: "reference.templates.confirmDelete" })
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
        reference: "^",
    },
    bindings: {
        user: "<",
        categories: "<",
        templates: "<",
        filterParams: "<",
        club: "<",
    },
    controller: TemplatesCtrl,
    template: require("./templates.component.html") as string,
};

export default TemplatesComponent;
