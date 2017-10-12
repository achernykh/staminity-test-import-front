import './analytics-management-panel.component.scss';
import {IComponentOptions, IComponentController, IPromise} from 'angular';
import {AnalyticsCtrl} from "../analytics.component";
import {
    IReportPeriodOptions,
    periodByType, IAnalyticsChartFilter, AnalyticsChartFilter
} from "../analytics-chart-filter/analytics-chart-filter.model";
import {IUserProfileShort} from "../../../../api/user/user.interface";
import {IActivityType} from "../../../../api/activity/activity.interface";
import {IActivityCategory} from "../../../../api/reference/reference.interface";
import {IReportPeriod} from "../../../../api/statistics/statistics.interface";
import moment from 'moment/src/moment.js';
import {IStorageService} from "../../core/storage.service";

class AnalyticsManagementPanelCtrl implements IComponentController {

    public data: any;
    private filter: AnalyticsChartFilter;

    private panel: 'filters' | 'settings' | 'hide' = 'filters';
    private startDate: Date;
    private endDate: Date;

    private analytics: AnalyticsCtrl;
    public onChangeFilter: () => IPromise<void>;
    public onChangeCharts: () => IPromise<void>;
    public onChangePanelSize: () => IPromise<void>;

    static $inject = ['$filter','storage'];

    constructor(private $filter: any, private storage: IStorageService) {

    }

    $onInit() {
        this.panel = this.storage.get(`${this.analytics.user.userId}#panelStatus`) || 'filters';
    }

    panelChange(value) {
        if ((this.panel !== 'hide' && value === 'hide') || (this.panel === 'hide' && value !== 'hide')) {
            this.onChangePanelSize();
        }
        this.panel = value;
        this.storage.set(`${this.analytics.user.userId}#panelStatus`, value);
    }

}

const AnalyticsManagementPanelComponent:IComponentOptions = {
    bindings: {
        user: '<',
        charts: '<',
        filter: '<',
        onChangeFilter: '&',
        onChangeCharts: '&',
        onChangePanelSize: '&'
    },
    require: {
        analytics: '^analytics'
    },
    controller: AnalyticsManagementPanelCtrl,
    template: require('./analytics-management-panel.component.html') as string
};

export default AnalyticsManagementPanelComponent;