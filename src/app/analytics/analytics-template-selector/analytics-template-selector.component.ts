import './analytics-template-selector.component.scss';
import {IComponentController, IComponentOptions} from "angular";
import AuthService from "@app/auth/auth.service";
import {AnalyticsConfig} from "@app/analytics/analytics.constants";
import { AnalyticsService } from "../analytics.service";
import MessageService from "../../core/message.service";

class AnalyticsTemplateSelectorCtrl implements IComponentController {

    // bind
    functionCode: string;
    additionalAuth: boolean;
    onCancel: () => Promise<void>;
    onChange: (response: {code: string, active: boolean}) => Promise<void>;

    // private

    // inject
    static $inject = ['AuthService', 'analyticsConfig', 'AnalyticsService', 'message'];

    constructor(
        private authService: AuthService,
        private analyticsConfig: AnalyticsConfig,
        private analyticsService: AnalyticsService,
        private messageService: MessageService) {}


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
