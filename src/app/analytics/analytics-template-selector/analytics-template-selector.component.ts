import './analytics-template-selector.component.scss';
import {IComponentController, IComponentOptions} from "angular";
import AuthService from "@app/auth/auth.service";
import {AnalyticsConfig} from "@app/analytics/analytics.constants";
import { AnalyticsService } from "../analytics.service";
import MessageService from "../../core/message.service";
import {AnalyticsDialogService} from "../analytics-dialog.service";
import {AnalyticsChart} from "@app/analytics/analytics-chart/analytics-chart.model";

export class AnalyticsTemplateSelectorCtrl implements IComponentController {

    // bind
    charts: AnalyticsChart[];
    onCancel: () => Promise<void>;
    onChange: (response: {code: string, active: boolean}) => Promise<void>;

    // private

    // inject
    static $inject = ['AuthService', 'analyticsConfig', 'AnalyticsService', 'message', 'AnalyticsDialogService'];

    constructor(
        private authService: AuthService,
        private analyticsConfig: AnalyticsConfig,
        private analyticsService: AnalyticsService,
        private messageService: MessageService, private analyticsDialogService: AnalyticsDialogService) {

        this.charts = this.analyticsDialogService.charts.getValue();
        //this.analyticsDialogService.charts.subscribe(d => {debugger;});

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
