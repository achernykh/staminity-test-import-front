import { IComponentController, IComponentOptions, IPromise } from "angular";
import { IActivityType } from "../../../../api/activity/activity.interface";
import { IGroupProfile } from "../../../../api/group/group.interface";
import { IActivityCategory, IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";

import { activityTypes, getType } from "../../activity/activity.constants";
import { isManager } from "../../club/club.datamodel";
import IMessageService from "../../core/message.service";
import { entries, filter, fold, groupBy, isUndefined, keys, last, orderBy, pick, pipe, prop } from "../../share/util";
import { filtersToPredicate } from "../../share/utility/filtering";
import { CategoryDialogCtrl } from "../category-dialog/category-dialog.controller";
import { categoriesFilters, getOwner, isOwner, Owner, ReferenceFilterParams } from "../reference.datamodel";
import ReferenceService from "../reference.service";

import "./categories.component.scss";

class CategoriesCtrl implements IComponentController {

    user: IUserProfile;
    categories: IActivityCategory[];
    templates: IActivityTemplate[];
    club: IGroupProfile;
    filterParams: ReferenceFilterParams;

    private categoriesByOwner: { [owner in Owner]: IActivityCategory[] };
    private activityTypes: IActivityType[] = activityTypes;
    private getType: (id: number) => IActivityType = getType;

    static $inject = ["$scope", "$mdDialog", "message", "ReferenceService"];

    constructor(
        private $scope,
        private $mdDialog,
        private message: IMessageService,
        private ReferenceService: ReferenceService,
    ) {

    }

    $onChanges(changes) {
        this.handleChanges();
    }

    handleChanges() {
        const filters = pick(["club", "activityType"]) (categoriesFilters);

        this.categoriesByOwner = pipe(
            filter(filtersToPredicate(filters, this.filterParams)),
            orderBy(prop("sortOrder")),
            groupBy(getOwner(this.user)),
        ) (this.categories);
    }

    categoryReorder(index: number, category: IActivityCategory) {
        const { id, code, description, groupProfile, visible } = category;
        const owner = getOwner(this.user)(category);
        const groupId = groupProfile && groupProfile.groupId;
        const targetCategory = this.categoriesByOwner[owner][index];
        const sortOrder = targetCategory ? targetCategory.sortOrder : 999999;

        this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
        .catch((info) => {
            this.message.systemWarning(info);
            throw info;
        });
    }

    createCategory() {
        const data = {
            activityTypeId: this.filterParams.activityType.id,
            groupProfile: this.club,
        };

        this.categoryDialog(data, "create");
    }

    selectCategory(category: IActivityCategory) {
        const mode: CategoryDialogCtrl.Mode  = isOwner(this.user, category) || isManager(this.user, this.club) ? "edit" : "view";
        this.categoryDialog(category, mode);
    }

    categoryDialog(category: any, mode: CategoryDialogCtrl.Mode) {
        const locals = {
            mode,
            category: { ...category },
            user: this.user,
        };

        return this.$mdDialog.show({
            template: require("../category-dialog/category-dialog.template.html") as string,
            controller: CategoryDialogCtrl,
            locals,
            controllerAs: "$ctrl",
            clickOutsideToClose: true,
        });
    }
}

const CategoriesComponent: IComponentOptions = {
    bindings: {
        user: "<",
        categories: "<",
        filterParams: "<",
        club: "<",
    },
    controller: CategoriesCtrl,
    template: require("./categories.component.html") as string,
};

export default CategoriesComponent;
