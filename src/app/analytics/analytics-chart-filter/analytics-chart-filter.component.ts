import './analytics-chart-filter.component.scss';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import {AnalyticsChartFilterPanelCtrl} from "./analytics-chart-filter-panel.controller";
import {IAnalyticsChartFilter} from "./analytics-chart-filter.model";



class AnalyticsChartFilterCtrl implements IComponentController {

    public filter: IAnalyticsChartFilter;
    public onEvent: (response: Object) => IPromise<void>;

    private position;
    private config;

    static $inject = ['$mdPanel','$mdDialog'];

    constructor(private $mdPanel: any, private $mdDialog: any) {

        this.position = $mdPanel.newPanelPosition()
            .relativeTo('.open-button')
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW);

        this.config = {
            attachTo: element(document.body),
            controller: AnalyticsChartFilterPanelCtrl,
            controllerAs: 'ctrl',
            template: require('./analytics-chart-filter-panel.html') as string,
            panelClass: 'demo-menu-example',
            position: this.position,
            locals: {
                filter: this.filter
            },
            openFrom: null,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false,
            zIndex: 2
        };

    }

    $onInit() {

    }

    onOpen(env: Event) {
        this.config.openFrom = env;
        this.$mdPanel.open(this.config);
    }

    change(param, option) {
        debugger;
    }
}

const AnalyticsChartFilterComponent:IComponentOptions = {
    bindings: {
        filter: '<',
        onChange: '&'
    },
    require: {
        //component: '^component'
    },
    controller: AnalyticsChartFilterCtrl,
    template: require('./analytics-chart-filter.component.html') as string
};

export default AnalyticsChartFilterComponent;