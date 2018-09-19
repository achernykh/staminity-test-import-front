import {maybe, prop} from "../../utility";
import moment from "moment/min/moment-with-locales";
import { IComponentController, IScope } from 'angular';
import BillingService from "@app/core/billing.service";
import MessageService from "@app/core/message.service";
import {IBillingTariff} from "@api/billing";
import {IUserProfile} from "@api/user";
import {gtmViewTariff} from "../../google/google-analitics.functions";

export class EnableTariffCtrl {

    // private
    autoRenewal: boolean = true;
    promoCode: string = '';
    rejectedPromoCode: string = '';
    paymentSystem: string = 'fondy';
    agreement: boolean = false;

    fee;
    monthlyFee;
    yearlyFee;
    variableFees;
    activePromo;


    static $inject = ['$scope', '$mdDialog', 'BillingService', 'dialogs', 'message', 'user', 'tariff', 'billing'];
    constructor (private $scope: IScope,
                 private $mdDialog,
                 private billingService: BillingService,
                 private dialogs,
                 private message: MessageService,
                 public user: IUserProfile,
                 public tariff: IBillingTariff,
                 public billing: IBillingTariff) {

        if (tariff && billing) {
            this.setBilling(billing);
        }

    }

    discountedFee (fee): number {
        return fee.rate * (1 + (fee.promo.discount || 0) / 100);
    }

    hasMaxPaidCount (fee): boolean {
        return fee.varMaxPaidCount && fee.varMaxPaidCount < 99999;
    };

    trialExpires (): Date {
        return moment().add(this.billing.trialConditions.term, 'days').toDate();
    };

    getActivePromo (billing) {
        return billing.rates.map(prop('promo')).find((promo) => promo && promo.code);
    };

    setBilling (billing) {
        this.billing = billing;
        this.fee = this.billing.rates.find(fee => fee.rateType === 'Fixed');
        this.monthlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 1);
        this.yearlyFee = this.billing.rates.find(fee => fee.rateType === 'Fixed' && fee.term === 12);
        this.variableFees = this.billing.rates.filter(fee => fee.rateType === 'Variable');
        this.activePromo = this.getActivePromo(billing);
        debugger;
        gtmViewTariff(this.billing, this.monthlyFee);
    };

    submitPromo (promoCode) {
        this.billingService.getTariff(this.tariff.tariffId, promoCode)
            .then((billing) => {
                console.log('submitPromo', billing);
                this.setBilling(billing);
                this.rejectedPromoCode = this.activePromo? '' : promoCode;
                this.promoCode = '';
                this.$scope.$apply();
            }, (info) => {
                this.message.systemWarning(info);
                throw info;
            });
    };

    cancel () {
        debugger;
        this.$mdDialog.cancel();
    };

    submit (flowType: 'bill' | 'confirm' = 'bill') {
        let trial = this.billing.trialConditions.isAvailable;
        this.billingService.enableTariff(
            this.tariff.tariffId,
            this.user.userId,
            this.fee.term,
            this.autoRenewal,
            trial,
            maybe(this.activePromo) (prop('code')) (),
            this.paymentSystem)
            .then((bill) => {
                this.$mdDialog.hide();
                if (!trial && flowType === 'bill') { this.dialogs.billDetails(bill, this.user);}
                if (!trial && flowType === 'confirm') { this.dialogs.tariffConfirm(bill, this.user).then(); }
                return bill;
            }, (info) => {
                this.message.toastInfo(info);
                throw info;
            });
    };


}

