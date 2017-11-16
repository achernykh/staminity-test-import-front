import moment from 'moment/src/moment.js';
import { copy } from 'angular';
import {IReportPeriod, IChartParams} from "../../../../api/statistics/statistics.interface";
import {IUserProfileShort, IUserProfile} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {getSportBasic, getSportsByBasicId} from "../../activity/activity.constants";
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

    categoriesByOwner: {[owner in Owner]: Array<IActivityCategory>};
    change: number = null;

    private prepareComplete: boolean = false;
    private readonly defaultBasicActivityTypes: Array<number> = [2,7,10,13];
    private keys: Array<string> = ['user','categories','storage','prepareComplete','categoriesByOwner',
        'defaultBasicActivityTypes','change','keys'];

    constructor(
        public user: IUserProfile,
        public categories: Array<IActivityCategory>,
        public storage?: IAnalyticsChartFilter,
        private $filter?: any) {

        this.prepareUsers();
        this.prepareActivityTypes();
        this.prepareCategories();
        this.preparePeriods();
        this.prepareComplete = true;
    }

    transfer(keys: Array<string> = this.keys): IAnalyticsChartFilter {
        let obj: IAnalyticsChartFilter = copy(this);
        keys.map(k => delete obj[k]);
        return obj;
    }

    changeParam(filter: string):void {
        switch (filter) {
            case 'users': {
                this.users.model = this.users.model.map(v => Number(v));
                break;
            }
            case 'activityTypes':
                this.activityTypes.model = this.activityTypes.model.map(v => Number(v));
                break;
        }

        if(filter === 'periods' && this.periods.model === 'customPeriod'){

            if(!this.periods.data.startDate && !this.periods.data.endDate){
                [this.periods.data.startDate, this.periods.data.endDate] = [new Date(moment().startOf('year')), new Date()];
            }

            this.periods.data.model = [{
                startDate: moment(this.periods.data.startDate).format('YYYYMMDD'),
                endDate: moment(this.periods.data.endDate).format('YYYYMMDD')
            }];
        }

        this.change ++;
    }

    setCategoriesOption(options: Array<IActivityCategory>) {
        this.categories = options;

        this.categoriesByOwner = pipe(
            orderBy(prop('sortOrder')),
            groupBy(getOwner(this.user))
        ) (this.categories);

        this.activityCategories.options = this.categories;

    }

    setActivityTypesOptions(options: Array<IActivityType>) {
        this.activityTypes.options = options;
    }

    setUsersModel(model: Array<string>) {
        this.users.model = model;
    }

    setActivityTypes(model: Array<number>, mode: 'basic' | 'single', transform: boolean) {
        if (mode === 'basic' && transform) {
            model.map(id => this.activityTypes.model.push(...getSportsByBasicId(Number(id))));
        } else {
            this.activityTypes.model = model;
        }
        this.change ++;
    }

    setActivityCategories(model: Array<number>) {
        this.activityCategories.model = model;
        this.change ++;
    }

    setPeriods(model: any, data?: any) {
        [this.periods.model, this.periods.data] = [model, data];
        this.change ++;
    }

    usersSelectedText():string {
        if (this.users.model && this.users.model.length > 0) {
            return `${this.$filter('username')(
                this.users.options.filter(u => u.userId === Number(this.users.model[0]))[0])}      
                ${this.users.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.users.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.users.empty');
        }
    }

    activityTypesSelectedText():string {
        if(this.activityTypes.model && this.activityTypes.model.length > 0) {
            return `${this.$filter('translate')('sport.' +
                this.activityTypes.options.filter(t => t.id === Number(this.activityTypes.model[0]))[0].code)}
                ${this.activityTypes.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.activityTypes.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityTypes.empty');
        }
    }

    activityCategoriesSelectedText():string {
        if(this.activityCategories.model && this.activityCategories.model.length > 0) {
            return `${this.$filter('categoryCode')(
                this.activityCategories.options.filter(c => c.id === this.activityCategories.model[0])[0])}
                ${this.activityCategories.model.length > 1 ?
                this.$filter('translate')('analytics.filter.more',{num: this.activityCategories.model.length - 1}) : ''}`;
        } else {
            return this.$filter('translate')('analytics.filter.activityCategories.empty');
        }
    }

    periodsSelectedText(): string {
        if(this.periods.model) {
            return `${this.$filter('translate')('analytics.params.' + this.periods.model)}`;
        } else {
            return this.$filter('translate')('analytics.filter.periods.empty');
        }
    }

    descriptions(): string {
        return `
            ${this.$filter('translate')('analytics.filter.periods.placeholder')}: 
            ${this.periods.model !== 'customPeriod' ? 
                this.$filter('translate')('analytics.params.' + this.periods.model) :
                this.$filter('date')(moment(this.periods.model.startDate).toDate(),'shortDate') + '-' +
            this.$filter('date')(moment(this.periods.model.endDate).toDate(),'shortDate')}, 
            ${this.$filter('translate')('analytics.filter.activityTypes.placeholder')}: ${this.activityTypesSelectedText()}, 
            ${this.$filter('translate')('analytics.filter.users.placeholder')}: ${this.usersSelectedText()}`;
    }

    chartParams(): IChartParams {
        return {
            users: this.users.model,
            activityTypes: this.activityTypes.model.map(v => Number(v)) || [],
            activityCategories: this.activityCategories.model.map(v => Number(v)) || [],
            periods: this.periods.model !== 'customPeriod' ? periodByType(this.periods.model) : this.periods.data.model // временные периоды, в рамках которых требуется отбирать данные
        };
    }

    save(): IAnalyticsChartFilter {
        return {
            users: this.users,
            activityTypes: this.activityTypes,
            activityCategories: this.activityCategories,
            periods: this.periods
        };
    }


    private prepareUsers() {
        this.users = {
            type: 'checkbox',
            area: 'params',
            name: 'users',
            text: 'users',
            model: this.storage && this.storage.users.model || [this.user.userId],
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
            model: this.storage && this.storage.periods.model || null,
            data: this.storage && this.storage.periods.data || {
                model: null,
                startDate: null,
                endDate: null
            }
        };
        if(!this.periods.model){
            this.periods.model = this.periods.options[0];
        }
    }




}