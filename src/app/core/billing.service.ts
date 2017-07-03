import { ISocketService } from './socket.service';
import { ISessionService } from './session.service';
import { GetTariff, PostTariffSubscription, PutTariffSubscription, DeleteTariffSubscription, GetBill, GetBillDetails, PutProcessingCenter } from "../../../api/billing/billing.request";
import { IBillingTariff, IBill } from "../../../api/billing/billing.interface";

import moment from 'moment/min/moment-with-locales.js';
import { parseYYYYMMDD } from '../share/share.module';
import { maybe, prop } from "../share/util.js";


export default class BillingService {

    static $inject = ['SocketService', 'SessionService'];

    constructor (private SocketService:ISocketService, private SessionService: ISessionService) {

    }

    /**
     * @param tariffId
     * @param promoCodeString
     * @returns {Promise<IBillingTariff>}
     */
    getTariff (tariffId: number, promoCodeString: string) : Promise<IBillingTariff> {
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
    enableTariff (
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
     * @param promoCode
     * @returns {Promise<any>}
     */
    updateTariff (
        tariffId: number,
        autoRenewal: boolean,
        promoCode: string
    ) : Promise<any> {
        return this.SocketService.send(new PutTariffSubscription(tariffId, autoRenewal, promoCode));
    }

    /**
     * @param tariffId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    disableTariff (tariffId: number, userIdReceiver: number) : Promise<any> {
        return this.SocketService.send(new DeleteTariffSubscription(tariffId, userIdReceiver));
    }

    /**
     * @returns {Promise<[IBill]]>}
     */
    getBillsList () : Promise<[IBill]> {
        return this.SocketService.send(new GetBill(new Date(0), new Date()))
            .then((data) => data.arrayResult);
    }

    /**
     * @param billId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    getBillDetails (billId: number) : Promise<any> {
        return this.SocketService.send(new GetBillDetails(billId, true));
    }

    /**
     * @param billId
     * @param paymentSystem
     * @returns {Promise<any>}
     */
    updatePaymentSystem (billId: number, paymentSystem: string) : Promise<any> {
        return this.SocketService.send(new PutProcessingCenter(billId, paymentSystem));
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
    tariffEnablerCoach (tariff) : any {
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
            tariff.isOn && tariff.expireDate && !this.tariffEnablerCoach(tariff) && 'enabled' ||
            tariffEnablerClub && 'enabledByClub' ||
            tariffEnablerCoach && 'enabledByCoach' ||
            tariff.isTrial && tariff.expireDate && 'trial' ||
            tariff.isBlocked && 'isBlocked' ||
            tariff.unpaidBill && 'isBlocked' ||
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