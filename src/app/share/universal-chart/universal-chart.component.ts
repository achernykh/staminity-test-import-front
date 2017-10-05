import './universal-chart.component.scss';
import {IComponentOptions, IComponentController, IPromise, IWindowService} from 'angular';
import {UChartFactory} from './lib/UChart/UChartFactory.js';

class UniversalChartCtrl implements IComponentController {

    public data: any;
    public onEvent: (response: Object) => IPromise<void>;

    private chart: any;
    private container: any;
    private onResize: Function;

    static $inject = ['$element','$window'];

    constructor(private $element: any, private $window: IWindowService) {

    }

    $onInit() {
    }

    $onDestroy() {
        this.chart.remove();
    };

    $postLink():void {
        let self = this;
        this.$element.ready(() => self.redraw());

        this.onResize = () => {
            this.chart.remove();
            this.redraw();
        };
        angular.element(this.$element).on('resize', this.onResize);
        //angular.element(this.$window).on('resize', this.onResize);
    }


    $onChanges(changes: any) {
        if(changes.hasOwnProperty('update') && !changes.update.isFirstChange()){
            if(!this.chart){
                return;
            }
            setTimeout(() => {
                this.chart.remove();
                this.redraw();
            }, 500);
        }
    }

    redraw():void {
        this.container = this.$element[0];
        this.chart = UChartFactory.getInstance(this.data).renderTo(this.container);
    }
}

const UniversalChartComponent:IComponentOptions = {
    bindings: {
        data: '<',
        update: '<',
        onEvent: '&'
    },
    require: {
        //component: '^component'
    },
    controller: UniversalChartCtrl,
    template: require('./universal-chart.component.html') as string
};

export default UniversalChartComponent;