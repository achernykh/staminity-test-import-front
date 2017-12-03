import { IComponentController, IComponentOptions, IPromise } from "angular";
import { IActivityCategory } from "../../../../api/reference/reference.interface";

import { activityTypes, getType } from "../../activity/activity.constants";
import IMessageService from "../../core/message.service";
import { path } from "../../share/utility";
import ReferenceService from "../reference.service";
import "./category.component.scss";

class CategoryCtrl implements IComponentController {

    category: IActivityCategory;

    static $inject = ["$scope", "$filter", "$mdDialog", "$mdMedia", "message", "ReferenceService"];

    constructor(
        private $scope,
        private $filter,
        private $mdDialog,
        private $mdMedia,
        private message: IMessageService,
        private ReferenceService: ReferenceService,
    ) {

    }

    get isEnabled() {
        return this.category.visible;
    }

    set isEnabled(visible) {
        const { id, code, description, groupProfile, sortOrder } = this.category;
        const groupId = groupProfile && groupProfile.groupId;

        this.ReferenceService.putActivityCategory(id, code, description, groupId, sortOrder, visible)
        .catch((info) => {
            this.message.systemWarning(info);
            throw info;
        });
    }

    get activityTypeCode() {
        return getType(this.category.activityTypeId).code;
    }
}

const CategoryComponent: IComponentOptions = {
    bindings: {
        category: "<",
    },
    controller: CategoryCtrl,
    template: require("./category.component.html") as string,
};

export default CategoryComponent;
