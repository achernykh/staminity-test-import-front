import './premium-dialog.component.scss';
import {IComponentOptions, IComponentController, IScope} from 'angular';
import {EnableTariffCtrl} from "../../share/dialogs/enable-tariff/enable-tariff.controller";
import BillingService from "@app/core/billing.service";
import MessageService from "@app/core/message.service";
import {IBillingTariff} from "@api/billing";
import {IUserProfile} from "@api/user";
import {PremiumConfig} from "@app/premium/premium.constants";

class PremiumDialogCtrl extends EnableTariffCtrl implements IComponentController {

    // bind
    //user: IUserProfile;
    //tariff: IBillingTariff;
    //billing: IBillingTariff;
    onEvent: (response: Object) => Promise<void>;
    onCancel: () => Promise<void>;

    // private

    // inject
    static $inject = ['$scope', '$mdDialog', 'BillingService', 'dialogs', 'message',
        'premiumConfig'];

    constructor($scope: IScope,
                $mdDialog,
                billingService: BillingService,
                dialogs,
                message: MessageService,
                private config: PremiumConfig) {

        super ($scope, $mdDialog, billingService, dialogs, message, null, null, null);
    }

    $onInit(): void {
        this.setBilling(this.billing);
    }

    pay (term: number, flowType: 'bill' | 'confirm' = 'confirm'): void {
        this.fee.term = term;
        super.submit(flowType);

        /**
         *
         *  billing: () => this.BillingService.getTariff(tariff.tariffId, '')
         .catch((info) => {
                            this.message.systemWarning(info);
                            throw info;
                        })
         *
         *
         */

    }

}

export const PremiumDialogComponent:IComponentOptions = {
    bindings: {
        user: '<',
        tariff: '<',
        billing: '<',
        page: '<',
        onCancel: '&'
    },
    controller: PremiumDialogCtrl,
    template: require('./premium-dialog.component.html') as string
};