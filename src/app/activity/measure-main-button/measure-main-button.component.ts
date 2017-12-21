import { IComponentController, IComponentOptions} from "angular";
import {IActivityMeasure, ICalcMeasures} from "../../../../api/activity/activity.interface";
import "./measure-main-button.component.scss";

class MeasureMainButtonCtrl implements IComponentController {

    private calcMeasures: ICalcMeasures;
    private sport: string;
    private filter: string[] = ["calories", "adjustedPower"];
    static $inject = ["$scope"];

    constructor(private $scope: any) {

    }

    $onChanges(change: any): void {
        if (change.hasOwnProperty("changes") && !change.changes.isFirstChange()) {
            this.$onInit();
        }
    }

    $onInit() {

        if (this.calcMeasures.hasOwnProperty("elevationGain") || this.calcMeasures.hasOwnProperty("elevationLoss")) {
            this.calcMeasures["elevation"] = {
                value: Number(this.calcMeasures.elevationGain.value) - Number(this.calcMeasures.elevationLoss.value),
            };
        }

        // Пришлось добавить $scope, так как иначе при использования фильтра для ng-repeat в функции нет доступа к
        // this, а значит и нет доступа к массиву для фильтрации
        this.$scope.measure = {
            run: ["duration", "movingDuration", "distance", "calories", "elevationGain", "elevationLoss", "grade", "vamPowerKg", "intensityLevel", "efficiencyFactor", "speedDecoupling"],
            bike: ["duration", "movingDuration", "distance", "calories", "trainingLoad", "adjustedPower", "vamPowerKg", "variabilityIndex", "efficiencyFactor", "elevationGain", "elevationLoss", "grade", "intensityLevel", "powerDecoupling"],
            swim: ["duration", "movingDuration", "distance", "calories", "intensityLevel"],
            strength: ["duration", "movingDuration", "distance", "calories", "intensityLevel"],
            transition: ["duration", "movingDuration", "distance", "calories", "elevationGain", "elevationLoss", "grade", "intensityLevel", "speedDecoupling"],
            ski: ["duration", "movingDuration", "distance", "calories", "elevationGain", "elevationLoss", "grade", "vamPowerKg", "intensityLevel", "efficiencyFactor", "speedDecoupling"],
            other: ["duration", "movingDuration", "distance", "calories", "elevationGain", "elevationLoss", "grade", "vamPowerKg", "intensityLevel", "efficiencyFactor", "speedDecoupling"],
        };

        this.$scope.data = [
            {
                needParam: false,
                measure: ["distance", "duration", "movingDuration"],
            },
            {
                needParam: false,
                measure: ["calories", "intensityLevel", "trainingLoad"],
            },
            {
                needParam: true,
                param: ["elevationGain"],
                measure: ["elevation", "elevationGain", "elevationLoss"],
            },
            {
                needParam: true,
                param: ["elevationGain"],
                measure: ["grade", "vam", "vamPowerKg"],
            },
            {
                needParam: true,
                param: ["power"],
                measure: ["adjustedPower", "powerDecoupling", "variabilityIndex"],
            },
            {
                needParam: true,
                param: ["speed", "heartRate"],
                measure: ["adjustedSpeed", "speedDecoupling", "efficiencyFactor"],
            },
        ];

        this.$scope.search = (m) => this.$scope.measure[this.sport].indexOf(m.$key) !== -1;
    }

    link(url) {
        window.open(url);
    }

    check(data: any): boolean {
        return !data.needParam || (data.needParam && data.param.every((p) => this.calcMeasures.hasOwnProperty(p)));
    }
}

const MeasureMainButtonComponent: IComponentOptions = {
    bindings: {
        calcMeasures: "<",
        sport: "<",
    },
    controller: MeasureMainButtonCtrl,
    template: `
        <md-list class="md-dense">
            <md-list-item>
                <p class="md-caption" style="color: #455A64">Основные показатели</p>
                <md-icon ng-click="$ctrl.link('https://help.staminity.com/ru/basics/measures.html')" class="material-icon md-secondary">help_outline</md-icon>
            </md-list-item>
            <div layout="row" ng-repeat-start="data in $ctrl.$scope.data" ng-if="$ctrl.check(data)" style="padding: 0px 16px 8px 16px">
                <div flex="33" ng-repeat="m in data.measure">
                    <div ng-if="$ctrl.calcMeasures.hasOwnProperty(m) && $ctrl.calcMeasures[m].hasOwnProperty('value')"
                         class="md-body-2 md-dark center" style="min-height: 24px">{{$ctrl.calcMeasures[m].value | measureCalc:$ctrl.sport:m}} {{m | measureUnit:$ctrl.sport | translate}}</div>
                    <div ng-if="!($ctrl.calcMeasures.hasOwnProperty(m) && $ctrl.calcMeasures[m].hasOwnProperty('value'))"
                         class="md-body-2 md-dark md-inactive center">-</div>
                    <div class="md-caption md-dark md-inactive center">{{m | translate}}</div>
                </div>
            </div>
            <md-divider ng-repeat-end ng-if="!$last && $ctrl.check(data)" style="margin: 0px 16px"></md-divider>
            <!--
            <md-list-item layout="row" layout-wrap>
                <md-button class="md-exclude"
                            ng-repeat="measure in $ctrl.calcMeasures | toArray | filter:search track by measure.$key">
                    {{measure.$key | translate}}:&nbsp{{measure.value | measureCalc:$ctrl.sport:measure.$key}}&nbsp
                    <span>{{measure.$key | measureUnit:$ctrl.sport | translate}}</span>
                </md-button>
            </md-list-item>-->
        </md-list>`,

};

export default MeasureMainButtonComponent;
