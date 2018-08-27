import "./universal-chart.component.scss";
import moment from "moment/src/moment.js";
import { IScope, IComponentOptions, IComponentController, IPromise, IWindowService, copy } from "angular";
import { UChartFactory } from "./lib/UChart/UChartFactory.js";
import { IChart, IChartMeasure } from "../../../../api/statistics/statistics.interface";
import {_measurement_calculate, activityTypeColor} from "../measure/measure.constants";
import { peaksByTime } from "../measure/measure.filter";
import { deepCopy } from "../data/data.finctions";
import { IAnalyticsChartCompareSettings } from "../../analytics/analytics-chart/analytics-chart.interface";
import { comparePeriodTransform } from "../../analytics/analytics-chart-filter/analytics-chart-filter.function";
import {hexToRgbA} from "../utility";

class UniversalChartCtrl implements IComponentController {

    data: IChart[];
    compareSettings: IAnalyticsChartCompareSettings;
    update: number;
    filter: boolean;
    onEvent: (response: Object) => IPromise<void>;

    private universalChart: any;
    private container: any;
    private onResize: Function;
    private chart: IChart[];

    static $inject = ['$scope', '$element', '$window', '$translate'];

    constructor (private $scope: IScope, private $element: any, private $window: IWindowService, private $translate: any) {

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
        this.universalChart = UChartFactory.getInstance(this.chart).renderTo(this.container);
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

            this.chart[ci].metrics = this.chart[ci].metrics.map((m, mi) => {
                const metric: any[] = [];
                m.map((value, i) => {
                    const params: IChartMeasure =
                        this.chart[ci].series.filter((s) => s.idx === i)[0] ||
                        this.chart[ci].measures.filter((s) => s.idx === i)[0];
                    if (value === "NaN" || value === "Infinity") { value = null; }
                    if ( params ) {
                        if ( value === null ) {
                            metric.push(params.cumulative && Date.parse(this.chart[ci].metrics[mi][0]) &&
                                new Date(this.chart[ci].metrics[mi][0]) > new Date() ? undefined : null);
                        } else if ( params.dataType === "date" ) {
                            if (this.compareSettings && this.compareSettings.visible &&
                                this.compareSettings.ind === ci && this.compareSettings.type === 'periods') {
                                console.debug('compare', this.compareSettings.ind, ci, value);
                                //metric.push(comparePeriodTransform(this.compareSettings.mode, value));
                                metric.push(mi < this.chart[ci + 1].metrics.length ?
                                    moment(this.chart[ci + 1].metrics[mi][i]).format("MM-DD-YYYY") :
                                    moment(this.chart[ci + 1].metrics[this.chart[ci + 1].metrics.length - 1][i]).format("MM-DD-YYYY"));
                            } else { metric.push(moment(value).format("MM-DD-YYYY")); }
                        } else if (params.measureName === 'activityType') {
                            this.chart[ci].options.palette.push(hexToRgbA(activityTypeColor[value]));
                            metric.push(this.$translate.instant(value));
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
        console.debug('prepared chart:', this.chart);
    }

}

const UniversalChartComponent: IComponentOptions = {
    bindings: {
        data: '=',
        compareSettings: '=',
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