import {element, IComponentController, IComponentOptions, IPromise} from "angular";
import {AnalyticsChartFilterPanelCtrl} from "./analytics-chart-filter-panel.controller";
import "./analytics-chart-filter.component.scss";
import {IAnalyticsChartFilter} from "./analytics-chart-filter.model";

class AnalyticsChartFilterCtrl implements IComponentController {

    filter: IAnalyticsChartFilter;
    onEvent: (response: Object) => IPromise<void>;

    private position;
    private config;

    static $inject = ["$mdPanel", "$mdDialog"];

    constructor(private $mdPanel: any, private $mdDialog: any) {

        this.position = $mdPanel.newPanelPosition()
            .relativeTo(".open-button")
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

        this.config = {
            attachTo: element(document.body),
            controller: AnalyticsChartFilterPanelCtrl,
            controllerAs: "ctrl",
            template: require("./analytics-chart-filter-panel.html") as string,
            panelClass: "demo-menu-example",
            position: this.position,
            locals: {
                filter: this.filter,
            },
            openFrom: null,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            zIndex: 2,
        };

    }

    $onInit() {

    }

    onOpen(env: Event) {
        //this.config.openFrom = env;
        //this.$mdPanel.open(this.config);
        this.$mdDialog.show({
            controller: ($scope, $mdDialog) => {
                $scope.hide = () => $mdDialog.hide();
                $scope.cancel = () => $mdDialog.cancel();
                $scope.answer = (answer) => $mdDialog.hide(answer);
            },
            controllerAs: "$ctrl",
            template:
                `<md-dialog id="analytics-chart-settings" aria-label="Analytics Chart Settings">
                        <analytics-chart-settings
                                layout="row" class="analytics-chart-settings"
                                settings="$ctrl.settings",
                                global-filter="$ctrl.filter",
                                on-cancel="cancel()" on-answer="answer(response)">
                        </analytics-chart-settings>
                   </md-dialog>`,
            parent: angular.element(document.body),
            targetEvent: env,
            locals: {
                settings: this.filter,
                filter: this.filter,
            },
            bindToController: true,
            clickOutsideToClose: false,
            escapeToClose: true,
            fullscreen: true,

        }).then(() => {}, () => {});

    }

    change(param, option) {
        debugger;
    }
}

const AnalyticsChartFilterComponent: IComponentOptions = {
    bindings: {
        filter: "<",
        change: "<",
        onChange: "&",
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsChartFilterCtrl,
    template: require("./analytics-chart-filter.component.html") as string,
};

export default AnalyticsChartFilterComponent;
