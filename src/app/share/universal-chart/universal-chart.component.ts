import "./universal-chart.component.scss";
import moment from "moment/src/moment.js";
import { IComponentOptions, IComponentController, IPromise, IWindowService, copy } from "angular";
import { UChartFactory } from "./lib/UChart/UChartFactory.js";
import { IChart, IChartMeasure } from "../../../../api/statistics/statistics.interface";
import { _measurement_calculate } from "../measure/measure.constants";
import { peaksByTime } from "../measure/measure.filter";
import { deepCopy } from "../data/data.finctions";

class UniversalChartCtrl implements IComponentController {

    data: IChart[];
    update: number;
    filter: boolean;
    onEvent: (response: Object) => IPromise<void>;

    private universalChart: any;
    private container: any;
    private onResize: Function;
    private chart: IChart[];

    static $inject = ['$element', '$window', '$translate'];

    constructor (private $element: any, private $window: IWindowService, private $translate: any) {

    }

    $onInit () {}

    $onDestroy () {
        if ( this.hasOwnProperty('chart') && this.universalChart ) { this.universalChart.remove(); }
    };

    $postLink (): void {
        this.$element.ready(_ => this.redraw());
        angular.element(this.$element).on('resize', () => { this.universalChart.remove(); this.redraw(); });
    }

    $onChanges (changes: any) {
        if ( changes.hasOwnProperty('update') && !changes.update.isFirstChange() ) {
            if ( !this.universalChart ) { return; }
            setTimeout(() => { this.universalChart.remove(); this.redraw(); }, 300);
        }
    }

    redraw (): void {
        this.container = this.$element[0];
        this.prepareMetrics();
        this.universalChart = UChartFactory.getInstance(copy(this.chart)).renderTo(this.container);
    }

    prepareMetrics (): void {
        if ( !this.filter ) { return; }
        this.chart = deepCopy(this.data);
        this.chart.map((c,ci) => {

            this.chart[ci].measures = this.chart[ci].measures.map((m) => {
                const measures: any = Object.assign({}, m);
                measures.unit = m.unit && this.$translate.instant(m.unit);
                measures.label = m.label && this.$translate.instant(m.label);
                measures.tooltipLabel = m.tooltipLabel && this.$translate.instant(m.tooltipLabel);
                return measures;
            });

            this.chart[ci].metrics = this.chart[ci].metrics.map((m) => {
                const metric: any[] = [];
                m.map((value, i) => {
                    const params: IChartMeasure =
                        this.chart[ci].series.filter((s) => s.idx === i)[0] ||
                        this.chart[ci].measures.filter((s) => s.idx === i)[0];
                    value === "NaN" || value === "Infinity" ? value = null : value = value;
                    if ( params ) {
                        if ( value === null ) {
                            metric.push(value);
                        } else if ( params.dataType === "date" ) {
                            metric.push(moment(value).format("MM-DD-YYYY"));
                        } else if ( ["duration", "heartRateMPM", "powerMPM", "speedMPM"].indexOf(params.measureName) !== -1 ) {
                            metric.push(value / 60 / 60);
                        } else if ( params.measureName === "distance" ) {
                            metric.push(_measurement_calculate.meter.km(value));
                            // Пересчет темпа мин/км
                        } else if ( (params.measureName === "speed" && params.dataType === "time" && params.measureSource === "activity.actual.measure")
                            || params.unit === "мин/км" ) {
                            metric.push(_measurement_calculate.mps.minpkm(value)); //moment().startOf('day').millisecond(_measurement_calculate.mps.minpkm(value)*1000).startOf('millisecond').format('mm:ss'));
                            // Пересчет темпа мин/100м
                        } else if ( (params.measureName === "speed" && params.dataType === "time" && params.measureSource === "activity.actual.measure")
                            || params.unit === "мин/100м" ) {
                            metric.push(_measurement_calculate.mps.minp100m(value));
                            // Пересчет скорости км/ч
                        } else if ( (params.measureName === "speed" && params.dataType !== "time" && params.measureSource === "activity.actual.measure")
                            || params.unit === "км/ч" ) {
                            metric.push(_measurement_calculate.mps.kmph(value));
                        } else if ( ["speedDecoupling", "powerDecoupling"].indexOf(params.measureName) !== -1 ) {
                            metric.push(value * 100);
                        } else if ( params.measureSource === "peaksByTime" ) {
                            metric.push(this.$translate.instant(peaksByTime(value)));
                        } else {
                            metric.push(value);
                        }
                    }
                });
                return metric;
            });
        });
    }

}

const UniversalChartComponent: IComponentOptions = {
    bindings: {
        data: '=',
        filter: '=',
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