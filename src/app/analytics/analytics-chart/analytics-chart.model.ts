import {copy} from "angular";
import moment from "moment/src/moment.js";
import {IChart, IChartMeasure} from "../../../../api/statistics/statistics.interface";
import {IUserProfile} from "../../../../api/user/user.interface";
import {activityTypes} from "../../activity/activity.constants";
import {_measurement_calculate} from "../../share/measure/measure.constants";
import {peaksByTime} from "../../share/measure/measure.filter";
import {AnalyticsChartFilter} from "../analytics-chart-filter/analytics-chart-filter.model";
import {
    IAnalyticsChartDescriptionParams,
    IAnalyticsChart,
    IAnalyticsChartCompareSettings,
    IChartData
} from "./analytics-chart.interface";
import {IAnalyticsChartSettings} from "@app/analytics/analytics-chart-filter/analytics-chart-filter.model";

export class AnalyticsChartLayout {
    gridColumn: number;
    gridRow: number;
    fullScreen: boolean = false;

    constructor(public gridColumnEnd: number,
                public gridRowEnd: number) {

    }

    get style(): any {
        return {
            "grid-column-end": `span ${this.gridColumnEnd}`,
            "grid-row-end": `span ${this.gridRowEnd}`,
        };
    }

}

export class AnalyticsChart implements IAnalyticsChart {

    id: number;
    order: number;
    revision: number;
    auth: string[];
    active: boolean;
    icon?: string;
    code: string;
    descriptionParams?: IAnalyticsChartDescriptionParams[]; //Контекст переводов для заголовка отчета
    //description?: string;
    //filter: IAnalyticsChartFilter;
    globalParams?: boolean;
    localParams?: AnalyticsChartFilter;
    paramsDescription?: string;
    layout: AnalyticsChartLayout;
    compareSettings?: IAnalyticsChartCompareSettings;
    localCompareSettings?: IAnalyticsChartCompareSettings;
    settings?: Array<IAnalyticsChartSettings<any>>; // Параметры, которые можно менять в графике
    localSettings?: Array<IAnalyticsChartSettings<any>>;
    charts: IChart[];
    data: IChartData[];

    isAuthorized: boolean; //результат проверки полномочий пользователя

    private keys: string[] = ["template", "user", "categories", "isAuthorized", "globalFilter", "keys"];

    constructor(public template?: IAnalyticsChart,
                public user?: IUserProfile,
                public globalFilter?: AnalyticsChartFilter,
                public $filter?: any) {

        Object.assign(this, {...template});
        this.prepareLayout();

        /**if ( !this.globalParams && this.localParams ) {
            this.prepareLocalParams(user);
            this.localParams = new AnalyticsChartFilter(
                this.globalFilter.user,
                this.globalFilter.categories,
                this.localParams,
                this.$filter,
            );
            this.localParams.activityTypes.options = activityTypes;
        }**/
    }

    update (params: IAnalyticsChart): void {
        Object.assign(this, {...params});
        this.prepareLayout();
    }

    clearMetrics() {
        this.charts.map((c) => c.hasOwnProperty("metrics") && delete c.metrics);
    }

    hasMetrics(): boolean {
        return this.charts && this.charts.some((c) => c.hasOwnProperty("metrics"));
    }

    transfer(keys: string[] = this.keys): IAnalyticsChart {

        const obj: IAnalyticsChart = copy(this);
        // удаляем вспомогательные данные
        keys.map((k) => delete obj[k]);
        // удаляем данные графиков
        obj.charts.map((c) => c.hasOwnProperty("metrics") && delete c.metrics);
        return obj;

    }

    changeSettings(param: IAnalyticsChartSettings<any>, value) {
        if (!param.change) { return; }
        param.change.forEach(change => {
            switch (change.area) {
                case "params": {
                    change.ind.map(ind =>
                        Object.keys(change.options[value]).map(k =>
                            this.charts[ind].params[k] = change.options[value][k]));
                    break;
                }
                case "series": {
                    change.ind.map(ind =>
                        this.charts[ind].series
                            .filter(s => change.idx.indexOf(s.idx) !== -1)
                            .map(s => s[change.name] = value),
                    );
                    break;
                }
                case "data": {
                    this.data.filter(d => change.code.indexOf(d.code) !== -1)
                        .map(d => Object.keys(change.options[value]).map(k => d[k] = change.options[value][k]));
                    break;
                }
                case "measures": {
                    change.ind.map((ind) =>
                            this.charts[ind].measures
                                .filter(m => change.idx.indexOf(m.idx) !== -1)
                                .map((m, iidx) => Object.keys(change.options[Array.isArray(value) ? value[iidx] : value])
                                    .map(k => m[k] = change.options[Array.isArray(value) ? value[iidx] : value][k])),
                        //.map(s => s[param.name] = value)
                    );
                    break;
                }
            }
        });

    }

    restore(): void {
        if (this.hasOwnProperty('localParams')) { delete this.localParams;}
        Object.assign(this, this.template);
        this.prepareLayout();
    }

    private prepareLayout (): void {
        if (this.hasOwnProperty("layout") && this.layout) {
            this.layout = new AnalyticsChartLayout(this.layout.gridColumn, this.layout.gridRow);
        }
    }

    private prepareLocalParams(user: IUserProfile) {

        /**if ( this.localParams.activityTypes.model &&
         (!this.localParams.activityTypes.hasOwnProperty("options") || !this.localParams.activityTypes.options) ) {
            this.localParams.activityTypes.options = activityTypes;
        }**/

        /**if (this.params.users && typeof this.params.users.model !== "string" ) {
            return;
        }

         switch ( this.localParams.users.model ) {
            case "me": {
                this.localParams.users.model = [user.userId];

                this.localParams.users.options.push({
                    userId: user.userId,
                    public: user.public,
                });

                if ( user.connections.hasOwnProperty("allAthletes") ) {
                    this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map((a) => ({
                        userId: a.userId,
                        public: a.public,
                    })));
                }

                break;
            }
            case "first5": {
                this.localParams.users.model = user.connections.allAthletes.groupMembers.filter((a, i) => i < 5).map((a) => a.userId);

                this.localParams.users.options.push({
                    userId: user.userId,
                    public: user.public,
                });

                if ( user.connections.hasOwnProperty("allAthletes") ) {
                    this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map((a) => ({
                        userId: a.userId,
                        public: a.public,
                    })));
                }

                break;
            }
        }**/
    }

    calcData(): void {
        if (!this.charts.some(c => c.metrics.length > 0) || !this.data) {
            return;
        }
        this.data.map(d => {
            d.compile.value = null;
            d.compile.formula.forEach(f => {
                switch (f) {
                    case "start": {
                        d.compile.value = this.charts[d.compile.ind].metrics[0][d.compile.idx];
                        break;
                    }
                    case "end": {
                        let length: number = this.charts[d.compile.ind].metrics.length;
                        d.compile.value = this.charts[d.compile.ind].metrics[length - 1][d.compile.idx];
                        break;
                    }
                    case "last": {
                        this.charts[d.compile.ind].metrics.map(v =>
                            v[d.compile.idx] && (d.compile.value = v[d.compile.idx]));
                        break;
                    }
                    case "sum": {
                        if (d.compile.filter) {
                            this.charts[d.compile.ind].metrics
                                .filter(v => v[0] === d.compile.filter)
                                .map(v => v[d.compile.idx] && (d.compile.value = d.compile.value + v[d.compile.idx]));
                        } else {
                            this.charts[d.compile.ind].metrics
                                .map(v => v[d.compile.idx] && (d.compile.value = d.compile.value + v[d.compile.idx]));
                        }
                        break;
                    }
                    case "avg": {
                        let length: number = this.charts[d.compile.ind].metrics.length;
                        this.charts[d.compile.ind].metrics.map(v =>
                            v[d.compile.idx] && (d.compile.value = d.compile.value + v[d.compile.idx]));
                        d.compile.value = length > 1 ?
                            (d.compile.value - this.charts[d.compile.ind].metrics[length - 1][d.compile.idx]) / (length - 1) :
                            d.compile.value;
                        break;
                    }
                    case "max": {
                        this.charts[d.compile.ind].metrics.map(v =>
                            v[d.compile.idx] && (d.compile.value = Math.max(d.compile.value, v[d.compile.idx])));
                        break;
                    }
                }
            });
        });
        this.data.map(d => {
            if (d.compile.subValue) {
                d.compile.subValue.formula.forEach(f => {
                    switch (f) {
                        case 'subtract': {
                            d.compile.subValue.value = d.compile.value;
                            d.compile.subValue.params.forEach(p =>
                                d.compile.subValue.value = d.compile.subValue.value - this.data.filter(i => i.code === p)[0].compile.value);
                            break;
                        }
                    }
                });
            }
        });
    }

    prepareMetrics(ind: number, metrics: any[][]): void {
        this.charts[ind].metrics = [];
        metrics.map((m) => {
            const metric: any[] = [];
            m.map((value, i) => {
                const params: IChartMeasure =
                    this.charts[ind].series.filter((s) => s.idx === i)[0] ||
                    this.charts[ind].measures.filter((s) => s.idx === i)[0];
                value === "NaN" || value === "Infinity" ? value = null : value = value;
                if (params) {
                    if (value === null) {
                        metric.push(value);
                    } else if (params.dataType === "date") {
                        metric.push(moment(value).format("MM-DD-YYYY"));
                    } else if (["duration", "heartRateMPM", "powerMPM", "speedMPM"].indexOf(params.measureName) !== -1) {
                        metric.push(value / 60 / 60);
                    } else if (params.measureName === "distance") {
                        metric.push(_measurement_calculate.meter.km(value));
                        // Пересчет темпа мин/км
                    } else if ((params.measureName === "speed" && params.dataType === "time" && params.measureSource === "activity.actual.measure")
                        || params.unit === "мин/км") {
                        metric.push(_measurement_calculate.mps.minpkm(value)); //moment().startOf('day').millisecond(_measurement_calculate.mps.minpkm(value)*1000).startOf('millisecond').format('mm:ss'));
                        // Пересчет темпа мин/100м
                    } else if ((params.measureName === "speed" && params.dataType === "time" && params.measureSource === "activity.actual.measure")
                        || params.unit === "мин/100м") {
                        metric.push(_measurement_calculate.mps.minp100m(value));
                        // Пересчет скорости км/ч
                    } else if ((params.measureName === "speed" && params.dataType !== "time" && params.measureSource === "activity.actual.measure")
                        || params.unit === "км/ч") {
                        metric.push(_measurement_calculate.mps.kmph(value));
                    } else if (["speedDecoupling", "powerDecoupling"].indexOf(params.measureName) !== -1) {
                        metric.push(value * 100);
                    } else if (params.measureSource === "peaksByTime") {
                        metric.push(peaksByTime(value));
                    } else {
                        metric.push(value);
                    }

                }
            });
            this.charts[ind].metrics.push(metric);
        });
    }

}
