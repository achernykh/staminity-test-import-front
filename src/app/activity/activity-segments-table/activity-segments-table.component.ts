import {IComponentController, IComponentOptions, IPromise, IScope} from "angular";
import {ActivityIntervalP} from "../activity-datamodel/activity.interval-p";
import "./activity-segments-table.component.scss";

class ActivitySegmentsTableCtrl implements IComponentController {

    segments: ActivityIntervalP[];
    onSelect: (response: Object) => IPromise<void>;
    selected: any[] = [];

    private options: Object = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: false,
        pageSelect: false,
    };
    private query: Object = {
        order: "code",
        limit: 5,
        page: 1,
    };

    static $inject = ["$scope"];

    constructor(private $scope: IScope) {

    }

    $onInit() {
        this.prepareSegments();
        this.$scope["change"] = () => this.onSelect({
            initiator: "splits",
            selection: {
                U: null,
                P: this.selected.map((i) => i.pos - 1),
                L: null},
        });
    }

    prepareSegments() {
        this.$scope["segments"] = this.segments;
    }

    $onChanges() {
        this.prepareSegments();
    }
}

const ActivitySegmentsTableComponent: IComponentOptions = {
    bindings: {
        segments: "<",
        sport: "<",
        change: "<",
        onSelect: "&",
    },
    require: {
        //component: '^component'
    },
    controller: ActivitySegmentsTableCtrl,
    template: require("./activity-segments-table.component.html") as string,
};

export default ActivitySegmentsTableComponent;
