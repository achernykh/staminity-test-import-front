import {IComponentController, IComponentOptions, IPromise} from "angular";
import {Subject} from "rxjs/Rx";
import {IActivityTemplate} from "../../../../api";
import {IUserProfile} from "../../../../api/user/user.interface";
import {getOwner, ReferenceFilterParams, templatesFilters} from "../../reference/reference.datamodel";
import ReferenceService from "../../reference/reference.service";
import { entries, filter, fold, groupBy, isUndefined, keys, last, log, orderBy, pick, pipe, prop } from "../../share/util.js";
import {filtersToPredicate} from "../../share/utility/filtering";
import "./calendar-item-template-selector.component.scss";

class CalendarItemTemplateSelectorCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;
    private templatesByOwner: { [owner: string]: IActivityTemplate[] };

    public static $inject = ["$scope", "ReferenceService"];

    constructor(
        private $scope,
        private ReferenceService: ReferenceService) {

    }

    public $onInit(): void {
    }

    public $onDestroy(): void {
    }

}

const CalendarItemTemplateSelectorComponent: IComponentOptions = {
    bindings: {
        templatesByOwner: "<",
        onBack: "&",
        onSelect: "&",
    },
    require: {
        //component: '^component'
    },
    controller: CalendarItemTemplateSelectorCtrl,
    template: require("./calendar-item-template-selector.component.html") as string,
};

export default CalendarItemTemplateSelectorComponent;
