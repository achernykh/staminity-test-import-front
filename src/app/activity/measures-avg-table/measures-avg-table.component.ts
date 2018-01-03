import {IComponentController, IComponentOptions} from "angular";
import {IActivityMeasure, ICalcMeasures} from "../../../../api/activity/activity.interface";
import "./measures-avg-table.component.scss";

class MeasuresAvgTableCtrl implements IComponentController {

    private calcMeasures: ICalcMeasures;
    private sport: string;
    private selected: number[] = [];
    private options: Object = {
        rowSelection: false,
        multiSelect: false,
        autoSelect: false,
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

    constructor(private $scope: any) {

    }

    $onChanges(change: any): void {
        if (change.hasOwnProperty("changes") && !change.changes.isFirstChange()) {
            this.$onInit();
        }
    }

    $onInit() {
        // Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
        // this, а значит и нет доступа к массиву для фильтрации
        this.$scope.measure = ["heartRate", "speed", "power", "cadence"]; // elevationGain
        this.$scope.search = (m) => this.$scope.measure.indexOf(m.$key) !== -1;
    }
}

const MeasuresAvgTableComponent: IComponentOptions = {
    bindings: {
        calcMeasures: "<",
        changes: "<",
        sport: "<",
    },
    controller: MeasuresAvgTableCtrl,
    template: require("./measures-avg-table.component.html") as string,
};

export default MeasuresAvgTableComponent;
