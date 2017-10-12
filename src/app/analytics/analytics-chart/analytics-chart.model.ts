import {
    IAnalyticsChartFilter,
    IAnalyticsChartSettings
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IChartMeasure, IChartParams, IChart} from "../../../../api/statistics/statistics.interface";
import moment from 'moment/src/moment.js';
import {IUserProfile} from "../../../../api/user/user.interface";
import {peaksByTime} from "../../share/measure/measure.filter";
import {_measurement_calculate} from "../../share/measure/measure.constants";
import {activityTypes} from "../../activity/activity.constants";

export class AnalyticsChartLayout {


    fullScreen: boolean = false;

    constructor(public gridColumnEnd: number,
                public gridRowEnd: number){

    }

    get style(): any {
        return {
            'grid-column-end': `span ${this.gridColumnEnd}`,
            'grid-row-end':`span ${this.gridRowEnd}`
        };
    }

}

export interface IAnalyticsChartTitleContext {
    ind: number;
    idx: number;
    area: string;
    param: string;
}

export interface IAnalyticsChart {
    order: number;
    auth: Array<string>;
    active: boolean;
    icon?: string;
    code: string;
    context?: Array<IAnalyticsChartTitleContext>; //Контекст переводов для заголовка отчета
    description?: string;
    settings?: Array<IAnalyticsChartSettings<any>>;
    //filter: IAnalyticsChartFilter;
    globalParams?: boolean;
    localParams?: any;
    paramsDescription?: string;
    layout: AnalyticsChartLayout;
    charts: Array<IChart>;
}

export class AnalyticsChart implements IAnalyticsChart{

    order: number;
    auth: Array<string>;
    active: boolean;
    icon?: string;
    code: string;
    context?: Array<IAnalyticsChartTitleContext>; //Контекст переводов для заголовка отчета
    description?: string;
    //filter: IAnalyticsChartFilter;
    globalParams?: boolean;
    localParams?: any;
    paramsDescription?: string;
    layout: AnalyticsChartLayout;
    charts: Array<IChart>;

    isAuthorized: boolean; //результат проверки полномочий пользователя

    constructor(params?: IAnalyticsChart, user?: IUserProfile) {
        Object.assign(this, params);
        if(this.hasOwnProperty('layout') && this.layout) {
            this.layout = new AnalyticsChartLayout(this.layout.gridColumnEnd, this.layout.gridRowEnd);
        }

        if(!this.globalParams && this.localParams && this.isAuthorized) {
            this.prepareLocalParams(user);
        }
    }

    clearMetrics() {
        this.charts.map(c => c.hasOwnProperty('metrics') && delete c.metrics);
    }

    hasMetrics(): boolean {
        return this.charts.some(c => c.hasOwnProperty('metrics'));
    }

    private prepareLocalParams(user: IUserProfile){

        if(this.localParams.activityTypes.model &&
            (!this.localParams.activityTypes.hasOwnProperty('options') || !this.localParams.activityTypes.options)) {
            this.localParams.activityTypes.options = activityTypes;
        }

        if(typeof this.localParams.users.model !== "string") {
            return;
        }

        switch (this.localParams.users.model) {
            case 'me': {
                this.localParams.users.model = [user.userId];

                this.localParams.users.options.push({
                    userId: user.userId,
                    public: user.public
                });

                if(user.connections.hasOwnProperty('allAthletes')) {
                    this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map(a => ({
                        userId: a.userId,
                        public: a.public
                    })));
                }

                break;
            }
            case 'first5': {
                this.localParams.users.model = user.connections.allAthletes.groupMembers.filter((a,i) => i < 5).map(a => a.userId);

                this.localParams.users.options.push({
                    userId: user.userId,
                    public: user.public
                });

                if(user.connections.hasOwnProperty('allAthletes')) {
                    this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map(a => ({
                        userId: a.userId,
                        public: a.public
                    })));
                }

                break;
            }
        }
    }

    prepareMetrics(ind: number, metrics: Array<Array<any>>): void {
        this.charts[ind].metrics = [];
        metrics.map(m => {
            let metric: Array<any> = [];
            m.map((value,i) => {
                let params: IChartMeasure = this.charts[ind].series.filter(s => s.idx === i)[0] ||
                    this.charts[ind].measures.filter(s => s.idx === i)[0];

                value === "NaN" || value === "Infinity" ? value = null : value = value;

                if(params) {
                    if(params.dataType === 'date') {
                        metric.push(moment(value).format('MM-DD-YYYY'));
                    } else if(['duration','heartRateMPM','powerMPM','speedMPM'].indexOf(params.measureName) !== -1) {
                        metric.push(value / 60 / 60);
                    } else if(params.measureName === 'distance') {
                        metric.push(_measurement_calculate.meter.km(value));
                    // Пересчет темпа мин/км
                    } else if ((params.measureName === 'speed' && params.dataType === 'time' && params.measureSource === 'activity.actual.measure')
                        || params.unit === 'мин/км') {
                        metric.push(_measurement_calculate.mps.minpkm(value));//moment().startOf('day').millisecond(_measurement_calculate.mps.minpkm(value)*1000).startOf('millisecond').format('mm:ss'));
                    // Пересчет темпа мин/100м
                    } else if ((params.measureName === 'speed' && params.dataType === 'time' && params.measureSource === 'activity.actual.measure')
                        || params.unit === 'мин/100м') {
                        metric.push(_measurement_calculate.mps.minp100m(value));
                    // Пересчет скорости км/ч
                    } else if ((params.measureName === 'speed' && params.dataType !== 'time' && params.measureSource === 'activity.actual.measure')
                        || params.unit === 'км/ч') {
                        metric.push(_measurement_calculate.mps.kmph(value));
                    } else if (['speedDecoupling','powerDecoupling'].indexOf(params.measureName) !== -1) {
                        metric.push(value * 100);
                    } else if(params.measureSource === 'peaksByTime') {
                        metric.push(peaksByTime(value));
                    }
                    else{
                        metric.push(value);
                    }

               }
            });
            this.charts[ind].metrics.push(metric);
        });
    }

}