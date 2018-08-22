import { IChart, IChartParams } from "../../../../api/statistics/statistics.interface";
import {
    IAnalyticsChartSettings, IAnalyticsChartFilter,
    AnalyticsChartFilter
} from "../analytics-chart-filter/analytics-chart-filter.model";
import { AnalyticsChartLayout } from "./analytics-chart.model";

export interface IAnalyticsChartDescriptionParams {
    ind: number;
    idx: number;
    area: string;
    param: string;
}

export interface IAnalyticsChartLocalParams {
    [param: string]: {
        type: 'checkbox' | 'date';
        area: 'params';
        name: string;
        text: string;
        model: any;
        options?: any;
    }
}

export interface IChartData {
    measure: string;
    code: string;
    color: string;
    hasBullet: boolean;
    description: boolean;
    compile: {
        ind: number;
        idx: number;
        formula: string[]; // last, fist, max, avg, sum
        value: any;
        subValue: {
            formula: string[];
            params: string[];
            value: any;
        }
    };
    visible: boolean;
}

export interface IAnalyticsChart {
    id: number;
    order: number;
    revision: number;
    auth: string[];
    active: boolean;
    icon?: string;
    code: string;
    descriptionParams?: IAnalyticsChartDescriptionParams[]; //Контекст переводов для заголовка отчета
    description?: string; // = analytics.[code].description
    settings?: Array<IAnalyticsChartSettings<any>>; // Параметры, которые можно менять в графике
    //filter: IAnalyticsChartFilter;
    globalParams?: boolean;
    localParams?: IAnalyticsChartFilter; // настройки пользователя графика
    //paramsDescription?: string;
    layout: AnalyticsChartLayout; // Настройки отображения графика внутри сетки
    charts: IChart[];
    metrics?: any[];
    data?: IChartData[];
}