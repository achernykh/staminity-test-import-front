import { copy } from "angular";
import moment from "moment/src/moment.js";
import { IChart, IChartMeasure } from "../../../../api/statistics/statistics.interface";
import { IUserProfile } from "../../../../api/user/user.interface";
import { activityTypes } from "../../activity/activity.constants";
import { _measurement_calculate } from "../../share/measure/measure.constants";
import { peaksByTime } from "../../share/measure/measure.filter";
import { AnalyticsChartFilter } from "../analytics-chart-filter/analytics-chart-filter.model";
import { IAnalyticsChartDescriptionParams, IAnalyticsChart, IChartData } from "./analytics-chart.interface";

export class AnalyticsChartLayout {

    fullScreen: boolean = false;

    constructor (public gridColumnEnd: number,
                 public gridRowEnd: number) {

    }

    get style (): any {
        return {
            "grid-column-end": `span ${this.gridColumnEnd}`,
            "grid-row-end": `span ${this.gridRowEnd}`,
        };
    }

}

export class AnalyticsChart implements IAnalyticsChart {

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
    localParams?: any;
    paramsDescription?: string;
    layout: AnalyticsChartLayout;
    charts: IChart[];
    data: IChartData[];

    isAuthorized: boolean; //результат проверки полномочий пользователя

    private keys: string[] = ["params", "user", "categories", "isAuthorized", "globalFilter", "keys"];

    constructor (private params?: IAnalyticsChart,
                 private user?: IUserProfile,
                 private globalFilter?: AnalyticsChartFilter,
                 private $filter?: any) {

        Object.assign(this, params);
        if ( this.hasOwnProperty("layout") && this.layout ) {
            this.layout = new AnalyticsChartLayout(this.layout.gridColumnEnd, this.layout.gridRowEnd);
        }

        if ( !this.globalParams && this.localParams ) {
            this.prepareLocalParams(user);
            this.localParams = new AnalyticsChartFilter(
                this.globalFilter.user,
                this.globalFilter.categories,
                this.localParams,
                this.$filter,
            );
            this.localParams.activityTypes.options = activityTypes;
        }
    }

    clearMetrics () {
        this.charts.map((c) => c.hasOwnProperty("metrics") && delete c.metrics);
    }

    hasMetrics (): boolean {
        return this.charts.some((c) => c.hasOwnProperty("metrics"));
    }

    transfer (keys: string[] = this.keys): IAnalyticsChart {

        const obj: IAnalyticsChart = copy(this);
        // удаляем вспомогательные данные
        keys.map((k) => delete obj[k]);
        // удаляем данные графиков
        obj.charts.map((c) => c.hasOwnProperty("metrics") && delete c.metrics);
        return obj;

    }

    private prepareLocalParams (user: IUserProfile) {

        if ( this.localParams.activityTypes.model &&
            (!this.localParams.activityTypes.hasOwnProperty("options") || !this.localParams.activityTypes.options) ) {
            this.localParams.activityTypes.options = activityTypes;
        }

        if ( typeof this.localParams.users.model !== "string" ) {
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
        }
    }

    calcData (): void {
        if (!this.charts.some(c => c.metrics.length > 0 || !this.data)) {return;}
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
                        this.charts[d.compile.ind].metrics.map(v => v[d.compile.idx] && (d.compile.value = v[d.compile.idx]));
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

    prepareMetrics (ind: number, metrics: any[][]): void {
        this.charts[ind].metrics = [];
        metrics.map((m) => {
            const metric: any[] = [];
            m.map((value, i) => {
                const params: IChartMeasure =
                    this.charts[ind].series.filter((s) => s.idx === i)[0] ||
                    this.charts[ind].measures.filter((s) => s.idx === i)[0];
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
