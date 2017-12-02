import { element, IComponentController, IPromise } from "angular";

import { IActivityTemplate } from "../../../../api/reference/reference.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { activityTypes, getType } from "../../activity/activity.constants";
import { Activity } from "../../activity/activity.datamodel";

export type TemplateDialogMode = "post" | "put" | "view";

class TemplateDialogCtrl implements IComponentController {

    public static $inject = ["$scope", "$mdDialog"];

    constructor(private $scope, private $mdDialog) {
        $scope.hide = () => $mdDialog.hide();
        $scope.cancel = () => $mdDialog.cancel();
        $scope.answer = (answer) => $mdDialog.hide(answer);
    }
}

const defaultParams = {
    controller: TemplateDialogCtrl,
    controllerAs: "$ctrl",
    template: require("./template.dialog.html") as string,
    parent: element(document.body),
    bindToController: true,
    clickOutsideToClose: false,
    escapeToClose: false,
    fullscreen: true,
};

function templateToActivity(template: IActivityTemplate): Activity {
    const { id, code, description, favourite, visible, userProfileCreator, groupProfile, activityCategory, content } = template;
    const activityTypeId = activityCategory && activityCategory.activityTypeId;

    return new Activity({
        code, description, favourite, visible, userProfileCreator, groupProfile,
        isTemplate: true,
        templateId: id,
        userProfileOwner: userProfileCreator,
        activityHeader: {
            id, activityCategory,
            activityType: getType(activityTypeId) || activityTypes[0],
            intervals: content || [],
        },
    } as any);
}

export function templateDialog(mode: TemplateDialogMode, template: IActivityTemplate, user: IUserProfile, params?: any) {
    return {
        ...defaultParams,
        ...params,
        locals: {
            mode, user,
            item: templateToActivity(template),
            date: new Date(),
        },
    };
}
