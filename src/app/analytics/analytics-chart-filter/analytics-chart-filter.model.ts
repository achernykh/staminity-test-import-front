import moment from 'moment/src/moment.js';
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {getSportBasic} from "../../activity/activity.constants";
import { pipe, orderBy, prop, groupBy } from "../../share/util.js";
import {getOwner, Owner} from "../../reference/reference.datamodel";

export const periodByType = (type: string): Array<IReportPeriod> => {
    let format: string = 'YYYYMMDD';
    switch (type) {
        case 'thisYear': {
            return [{
                startDate: moment().startOf('year').format(format),
                endDate: moment().format(format)
            }];
        }
        case 'thisMonth': {
            return [{
                startDate: moment().startOf('month').format(format),
                endDate: moment().format(format)
            }];
        }
        case 'thisWeek': {
            return [{
                startDate: moment().startOf('week').format(format),
                endDate: moment().endOf('week').format(format)
            }];
        }
        case 'customPeriod': {
            return [{
                startDate: moment().startOf('year').format(format),
                endDate: moment().format(format)
            }];
        }
    }
};

export const PeriodOptions = (options: Array<string> = ['thisYear','thisMonth','thisWeek','customPeriod']):
    Array<IReportPeriodOptions> => {
    return options.map(o => ({
        name: o,
        period: null//periodByType(o)
    }));
};

interface IReportCustomPeriod {
    startDate: Date;
    endDate: Date;
    period: IReportPeriod;
}

export interface IAnalyticsChartSettings<T> {
    type: 'date' | 'text' | 'select' | 'checkbox' | 'radio';
    area: 'params' | 'series' | 'measures';
    ind?: Array<number>; // индекс в массиве chart
    idx?: Array<number>; // индекс в массиве series/measures
    name?: string;
    text: string; // название показателя для вывода на экран analytics.params... | translate
    multiTextParam?: string; // ссылка на показатель, в котором будет задан текст в случае мултипеременных
    model: any;
    data?: any | IReportCustomPeriod; // расчетные данные для формирования model (используется для customPeriod)
    options: Array<T>;
    change?: any; // объект содержащий перечень изменения для структуры series/measures
    protected?: boolean;
}

export interface IReportPeriodOptions {
    name: string;
    period: IReportPeriod;
}

export interface IReportRadioOptions {
    name: string;
    value: boolean;
}

export interface IAnalyticsChartFilter {
    users: IAnalyticsChartSettings<IUserProfileShort>;
    activityTypes: IAnalyticsChartSettings<IActivityType>;
    activityCategories: IAnalyticsChartSettings<IActivityCategory>;
    periods: IAnalyticsChartSettings<string>;
}

export class AnalyticsChartFilter implements IAnalyticsChartFilter{

    users: IAnalyticsChartSettings<IUserProfileShort>;
    activityTypes: IAnalyticsChartSettings<IActivityType>;
    activityCategories: IAnalyticsChartSettings<IActivityCategory>;
    periods: IAnalyticsChartSettings<string>;
    prepareComplete: boolean = false;
    categoriesByOwner: {[owner in Owner]: Array<IActivityCategory>};

    private readonly defaultBasicActivityTypes: Array<number> = [2,7,10,13];
    change: number = null;

    constructor(
        private user: IUserProfile,
        private categories: Array<IActivityCategory>,
        private storage?: IAnalyticsChartFilter) {

        this.prepareUsers();
        this.prepareActivityTypes();
        this.prepareCategories();
        this.preparePeriods();
        this.prepareComplete = true;
    }

    changeParam(filter: string):void {
        switch (filter) {
            case 'users': {
                this.users.model = angular.isArray(this.users.model) && this.users.model.map(v => Number(v)) || Number(this.users.model);
                break;
            }
            case 'activityType':
                this.activityTypes.model = this.activityTypes.model.map(v => Number(v));
                break;
        }
        if(filter === 'periods' && this.periods.model === 'customPeriod'){
            let period: Array<IReportPeriod>;
            if(!this.periods.data.startDate && !this.periods.data.endDate){
                period = periodByType('thisYear');
                [this.periods.data.startDate, this.periods.data.endDate] = [new Date(moment().startOf('year')), new Date()];
            }
            this.periods.data.model = [{
                startDate: moment(this.periods.data.startDate).format('YYYYMMDD'),
                endDate: moment(this.periods.data.endDate).format('YYYYMMDD')
            }];
        }
    }

    private prepareUsers() {
        this.users = {
            type: 'checkbox',
            area: 'params',
            name: 'users',
            text: 'users',
            model: this.storage && this.storage.users.model || this.user.userId,
            options: []
        };

        this.users.options.push({
            userId: this.user.userId,
            public: this.user.public
        });

        if(this.user.public.isCoach && this.user.connections.hasOwnProperty('allAthletes')) {
            this.users.options.push(...this.user.connections.allAthletes.groupMembers.map(a => ({
                userId: a.userId,
                public: a.public
            })));
        }
    }

    private prepareActivityTypes(){
        this.activityTypes = {
            type: 'checkbox',
            area: 'params',
            name: 'activityTypes',
            text: 'activityTypes',
            model: this.storage && this.storage.activityTypes.model || this.defaultBasicActivityTypes,
            options: getSportBasic()
        };
    }

    private prepareCategories() {
        this.activityCategories = {
            type: 'checkbox',
            area: 'params',
            name: 'activityCategories',
            text: 'activityCategories',
            model: this.storage && this.storage.activityCategories.model || [],
            options: this.categories
        };

        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(this.user))
        ) (this.categories);
    }

    private preparePeriods() {
        this.periods = {
            type: 'date',
            area: 'params',
            name: 'periods',
            text: 'periods',
            options: ['thisYear','thisMonth','thisWeek','customPeriod'],
            model: this.storage && this.storage.periods.model || null
        };
        if(!this.periods.model){
            this.periods.model = this.periods.options[0];
        }
    }




}