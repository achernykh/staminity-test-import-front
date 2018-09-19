import './analytics-template-selector.component.scss';
import {IComponentController, IComponentOptions} from "angular";
import AuthService from "@app/auth/auth.service";
import {AnalyticsConfig} from "@app/analytics/analytics.constants";
import { AnalyticsService } from "../analytics.service";
import MessageService from "../../core/message.service";
import {AnalyticsDialogService} from "../analytics-dialog.service";
import {AnalyticsChart} from "@app/analytics/analytics-chart/analytics-chart.model";
import {IUserProfile} from "@api/user";
import {AnalyticsChartFilter} from "@app/analytics/analytics-chart-filter/analytics-chart-filter.model";

export class AnalyticsTemplateSelectorCtrl implements IComponentController {

    // bind
    charts: AnalyticsChart[];
    onCancel: () => Promise<void>;
    onChange: (response: {code: string, active: boolean}) => Promise<void>;

    // private
    owner: IUserProfile;
    globalFilter: AnalyticsChartFilter;
    athletes: any[];

    // inject
    static $inject = ['AuthService', 'analyticsConfig', 'AnalyticsService', 'message', 'AnalyticsDialogService'];

    constructor(
        private authService: AuthService,
        private analyticsConfig: AnalyticsConfig,
        private analyticsService: AnalyticsService,
        private messageService: MessageService, private analyticsDialogService: AnalyticsDialogService) {

        console.debug('chart: modalDialog template controller');

        this.charts = this.analyticsDialogService.charts.getValue();
        this.globalFilter = this.analyticsDialogService.globalFilter.getValue();
        this.athletes = this.globalFilter.users.options.map(u => ({id: u.userId,name: `${u.public.firstName} ${u.public.lastName}`}));

    }


    $onInit(): void {}

    changeActive (id:number, code: string, active: boolean): void {
        this.analyticsService.saveChartSettings(id, {code, active})
            .then(_ => this.messageService.toastInfo('analyticsSaveChartSettingsComplete'),
                e => e ? this.messageService.toastError(e) : this.messageService.toastError('analyticsSaveChartSettingsError'));
    }

    auth (roles: string[]): boolean {
        return this.authService.isAuthorized(roles);
    }

    private setUser (userId: number, param: string = 'users'): void {
        //this.user = this.athletes.filter(a => a.userId === userId)[0] || this.owner;
        this.globalFilter.users.model = [userId];
        this.globalFilter.changeParam(param);
        //this.globalFilterChange ++;
        this.analyticsDialogService.globalFilter.next(this.globalFilter);
    }

    private setPeriod (type: string, param: string = 'periods'): void {
        this.globalFilter.periods.model = type;
        this.globalFilter.changeParam(param);
        this.analyticsDialogService.globalFilter.next(this.globalFilter);
    }

}

export const AnalyticsTemplateSelectorComponent:IComponentOptions = {
    bindings: {
        charts: '=',
        onChange: '&',
        onCancel: '&'
    },
    controller: AnalyticsTemplateSelectorCtrl,
    template: require('./analytics-template-selector.component.html') as string
};