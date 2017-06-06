import { ISocketService } from './socket.service';
import { GetTariff, PostTariffSubscription, PutTariffSubscription, DeleteTariffSubscription, GetBill, GetBillDetails } from "../../../api/billing/billing.request";
import { IBillingTariff, IBill } from "../../../api/billing/billing.interface";

import moment from 'moment/min/moment-with-locales.js';
import { parseYYYYMMDD } from '../share/share.module';


export default class BillingService {

    static $inject = ['SocketService'];

    constructor (private SocketService:ISocketService) {

    }

    /**
     * @param tariffId
     * @param promoCodeString
     * @returns {Promise<any>}
     */
    getTariff (tariffId: number, promoCodeString: string) : Promise<any> {
        return this.SocketService.send(new GetTariff(tariffId, promoCodeString));
    }

    /**
     * @param tariffId
     * @param userIdReceiver
     * @param term
     * @param autoRenewal
     * @param trial
     * @param promoCode
     * @param paymentSystem
     * @returns {Promise<any>}
     */
    enableTariff(
        tariffId: number,
        userIdReceiver: number,
        term: number,
        autoRenewal: boolean,
        trial: boolean,
        promoCode: string,
        paymentSystem: string
    ) : Promise<any> {
        return this.SocketService.send(new PostTariffSubscription(
            tariffId, userIdReceiver, term, autoRenewal, trial, promoCode, paymentSystem
        ));
    }

    /**
     * @param tariffId
     * @param autoRenewal
     * @returns {Promise<any>}
     */
    updateTariff(
        tariffId: number,
        autoRenewal: boolean
    ) : Promise<any> {
        return this.SocketService.send(new PutTariffSubscription(tariffId, autoRenewal));
    }

    /**
     * @param tariffId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    disableTariff(tariffId: number, userIdReceiver: number) : Promise<any> {
        return this.SocketService.send(new DeleteTariffSubscription(tariffId, userIdReceiver));
    }

    /**
     * @returns {Promise<any>}
     */
    getBillsList() : Promise<any> {
        return this.SocketService.send(new GetBill(new Date(0), new Date()))
            .then((data) => data.arrayResult);
    }

    /**
     * @param billId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    getBillDetails(billId: number) : Promise<any> {
        return this.SocketService.send(new GetBillDetails(billId));
    }

    /**
     * @param bill
     * @returns 'complete' | ready' | 'new'
     */
    billStatus (bill: IBill) {
        let now = moment();
        let startPeriod = parseYYYYMMDD(bill.startPeriod);
        let endPeriod = parseYYYYMMDD(bill.endPeriod);
        let billDate = parseYYYYMMDD(bill.billDate);

        return bill.receiptDate && 'complete' ||
            now > billDate && 'ready' ||
            startPeriod < now && now < endPeriod && billDate > endPeriod && 'new';
    }

}