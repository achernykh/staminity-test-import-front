import {IScope} from "angular";
import BillingService from "../../../core/billing.service";
import MessageService from "../../../core/message.service";
import { IBill, IBillDetails } from "../../../../../api/billing/billing.interface";
import {maybe, prop} from "../../utility";

export class BillDetailsCtrl {
    // private
    private billStatus: string;
    private paymentSystem: string;
    private savePaymentSystem: string;

    static $inject = ['$scope', '$mdDialog', 'dialogs', 'BillingService', 'message', 'bill'];
    constructor (private $scope: IScope,
                 private $mdDialog,
                 private dialogs,
                 private billingService: BillingService,
                 private messageService: MessageService,
                 private bill: IBillDetails) {

        this.setBill(this.bill);
        this.$scope.$watch(() => this.paymentSystem, this.savePaymentSystem);

    }

    setBill(bill) {
        this.bill = bill;
        this.billStatus = this.billingService.billStatus(bill);
    }

    fixedFee(tariff) {
        return tariff.rates.find(fee => fee.rateType === 'Fixed');
    }

    variableFees (tariff) {
        return tariff.rates.filter(fee => fee.rateType === 'Variable');
    }

    feeDetails (fee) {
        return fee.transactions && fee.transactions.length && this.dialogs.feeDetails(fee, this.bill);
    }

    getPaymentSystem (): string {
        return this.bill.paymentSystem || 'fondy';
    }

    setPaymentSystem (paymentSystem: string) {
        return this.billingService.updatePaymentSystem(this.bill.billId, paymentSystem)
            .then((bill) => this.setBill(bill), (info) => {
                this.messageService.systemWarning(info);
                throw info;
            });
    }

    submit () {
    let checkoutUrl = maybe(this.bill) (prop('payment')) (prop('checkoutUrl')) ();

        return checkoutUrl && this.billingService.checkout(checkoutUrl)
                .then(_ => this.$mdDialog.hide(), (info) => {
                    this.messageService.systemWarning(info);
                    throw info;
                });
    }

    cancel () {
        this.$mdDialog.cancel();
    }

    //console.log('BillDetailsController', this);

}