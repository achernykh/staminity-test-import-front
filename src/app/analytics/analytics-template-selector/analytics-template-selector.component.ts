import './analytics-template-selector.component.scss';
import {IComponentController, IComponentOptions} from "angular";
import AuthService from "@app/auth/auth.service";
import {AnalyticsConfig} from "@app/analytics/analytics.constants";

class AnalyticsTemplateSelectorCtrl implements IComponentController {

    // bind
    functionCode: string;
    additionalAuth: boolean;
    onCancel: () => Promise<void>;
    onChange: (response: {code: string, active: boolean}) => Promise<void>;

    // private

    // inject
    static $inject = ['AuthService', 'analyticsConfig'];

    constructor(
        private authService: AuthService,
        private analyticsConfig: AnalyticsConfig) {}


    $onInit(): void {}

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
