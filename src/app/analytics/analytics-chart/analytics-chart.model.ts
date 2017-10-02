import {
    IAnalyticsChartFilter,
    IAnalyticsChartFilterParam
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IChartMeasure, IChartParams, IChart} from "../../../../api/statistics/statistics.interface";
import moment from 'moment/src/moment.js';
import {IUserProfile} from "../../../../api/user/user.interface";

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
    title: string;
    context?: Array<IAnalyticsChartTitleContext>; //Контекст переводов для заголовка отчета
    description?: string;
    settings?: Array<IAnalyticsChartFilterParam<any>>;
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
    title: string;
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

    hasMetrics(): boolean {
        return this.charts.some(c => c.hasOwnProperty('metrics'));
    }

    private prepareLocalParams(user: IUserProfile){

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

                this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map(a => ({
                    userId: a.userId,
                    public: a.public
                })));

                break;
            }
            case 'first5': {
                this.localParams.users.model = user.connections.allAthletes.groupMembers.filter((a,i) => i < 5).map(a => a.userId);

                this.localParams.users.options.push({
                    userId: user.userId,
                    public: user.public
                });

                this.localParams.users.options.push(...user.connections.allAthletes.groupMembers.map(a => ({
                    userId: a.userId,
                    public: a.public
                })));

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
                    } else if(params.measureName === 'duration' ) {
                        metric.push(value / 60 / 60);
                    } else if(params.measureName === 'distance') {
                        metric.push(value / 1000);
                    } else if (params.measureName === 'speed' && params.dataType === 'time') {
                        metric.push(!!value ? (60 * 60) / (value * 3.6) : null);
                    } else {
                        metric.push(value);
                    }

               }
            });
            this.charts[ind].metrics.push(metric);
        });
    }

}