import { Observable, Subject } from 'rxjs/Rx';

import { SocketService, SessionService } from './index';

import {
    GetTariffRequest, PostTariffSubscriptionRequest, PutTariffSubscriptionRequest, DeleteTariffSubscriptionRequest,
    GetBillRequest, GetBillDetailsRequest, PutProcessingCenterRequest } from "../../../api";
import { IBillingTariff, IBill } from "../../../api/billing/billing.interface";

import moment from 'moment/min/moment-with-locales.js';
import { parseYYYYMMDD } from '../share/share.module';
import { maybe, prop } from "../share/util.js";


export default class BillingService {
    public messages: Observable<any>;

    static $inject = ['SocketService', 'SessionService'];

    constructor (private SocketService: SocketService, private SessionService: SessionService) {
        this.messages = this.SocketService.messages
            .filter((message) => message.type === 'bill')
            .share();
    }

    /**
     * @param tariffId
     * @param promoCodeString
     * @param term
     * @returns {Promise<IBillingTariff>}
     */
    getTariff (tariffId: number, promoCodeString: string, term?: number) : Promise<IBillingTariff> {
        return this.SocketService.send(new GetTariffRequest(tariffId, promoCodeString, term));
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
    enableTariff (
        tariffId: number,
        userIdReceiver: number,
        term: number,
        autoRenewal: boolean,
        trial: boolean,
        promoCode: string,
        paymentSystem: string
    ) : Promise<any> {
        return this.SocketService.send(new PostTariffSubscriptionRequest(
            tariffId, userIdReceiver, term, autoRenewal, trial, promoCode, paymentSystem
        ));
    }

    /**
     * @param tariffId
     * @param autoRenewal
     * @param promoCode
     * @param term
     * @returns {Promise<any>}
     */
    updateTariff (
        tariffId: number,
        autoRenewal: boolean,
        promoCode: string,
        term?: number
    ) : Promise<any> {
        return this.SocketService.send(new PutTariffSubscriptionRequest(tariffId, autoRenewal, promoCode, term));
    }

    /**
     * @param tariffId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    disableTariff (tariffId: number, userIdReceiver: number) : Promise<any> {
        return this.SocketService.send(new DeleteTariffSubscriptionRequest(tariffId, userIdReceiver));
    }

    /**
     * @returns {Promise<[IBill]]>}
     */
    getBillsList () : Promise<[IBill]> {
        return this.SocketService.send(new GetBillRequest(new Date(0), new Date()))
            .then((data) => data.arrayResult);
    }

    /**
     * @param billId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    getBillDetails (billId: number) : Promise<any> {
        return this.SocketService.send(new GetBillDetailsRequest(billId, true));
    }

    /**
     * @param billId
     * @param paymentSystem
     * @returns {Promise<any>}
     */
    updatePaymentSystem (billId: number, paymentSystem: string) : Promise<any> {
        return this.SocketService.send(new PutProcessingCenterRequest(billId, paymentSystem));
    }

    /**
     * @param checkoutUrl
     * @returns {Promise<any>}
     */
    checkout (checkoutUrl: string) : Promise<any> {
        let [width, height] = [500, 500];
        let left = (screen.width - width) / 2;
        let top = (screen.height - height) / 2;
        window.open(checkoutUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
        return Promise.resolve();
    }

    /**
     * @param tariff
     * @returns IClubProfile?
     */
    tariffEnablerClub (tariff) : any {
        return tariff.clubProfile;
    }

    /**
     * @param tariff
     * @returns IUserProfile?
     */
    tariffEnablerCoach (tariff): any {
        return (
            maybe(tariff.userProfilePayer) (prop('userId')) () !== 
            maybe(this.SessionService.getUser()) (prop('userId')) () 
        ) && tariff.userProfilePayer;
    }

    /**
     * @param tariff
     * @returns 'enabled' | enabledByCoach' | 'enabledByClub' | 'notEnabled' | trial' | 'isPaid' | 'isBlocked' | undefined
     */
    tariffStatus (tariff) : string {
        let tariffEnablerClub = this.tariffEnablerClub(tariff);
        let tariffEnablerCoach = this.tariffEnablerCoach(tariff);

        return (
            tariff.isTrial && 'trial' ||
            tariffEnablerClub && 'enabledByClub' ||
            tariffEnablerCoach && 'enabledByCoach' ||
            tariff.isBlocked && 'isBlocked' ||
            tariff.unpaidBill && 'isBlocked' ||
            tariff.isOn && 'enabled' ||
            !tariff.isOn && 'notEnabled' 
        );
    }

    /**
     * @param bill
     * @returns 'complete' | ready' | 'new'
     */
    billStatus (bill: IBill) : string {
        let now = moment();
        let startPeriod = parseYYYYMMDD(bill.startPeriod);
        let endPeriod = parseYYYYMMDD(bill.endPeriod);
        let billDate = parseYYYYMMDD(bill.billDate);

        return bill.receiptDate && 'complete' ||
            now > billDate && 'ready' ||
            startPeriod < now && now < endPeriod && billDate > endPeriod && 'new';
    }

}