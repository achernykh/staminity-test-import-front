import './universal-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise, element} from 'angular';
import {UChart} from './lib/UChart.js';

class UniversalChartCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;

    private chart: any;
    private container: any;

    static $inject = ['$element'];

    constructor(private $element: any) {
        this.chart = UChart.getInstance(null);
    }

    $onInit() {
    }

    $onDestroy() {
        this.chart.remove();
    };


    $onChanges() {
        this.chart.remove();
        this.container = this.$element[0];
        this.chart = UChart.getInstance(this.data).renderTo(this.container);
    }
}

const UniversalChartComponent:IComponentOptions = {
    bindings: {
        data: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: UniversalChartCtrl,
    template: require('./universal-chart.component.html') as string
};

export default UniversalChartComponent;