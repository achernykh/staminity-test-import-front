import { Observable, Subject } from "rxjs/Rx";

import { SessionService, SocketService } from "./index";

import {
    DeleteTariffSubscriptionRequest, GetBillDetailsRequest, GetBillRequest, GetTariffRequest,
    PostTariffSubscriptionRequest, PutProcessingCenterRequest, PutTariffSubscriptionRequest } from "../../../api";
import { IBill, IBillingTariff } from "../../../api/billing/billing.interface";

import moment from "moment/min/moment-with-locales.js";
import { parseYYYYMMDD } from "../share/share.module";
import { maybe, prop } from "../share/util.js";

export default class BillingService {
    public messages: Observable<any>;

    public static $inject = ["SocketService", "SessionService"];

    constructor(private SocketService: SocketService, private SessionService: SessionService) {
        this.messages = this.SocketService.messages
            .filter((message) => message.type === "bill")
            .share();
    }

    /**
     * @param tariffId
     * @param promoCodeString
     * @returns {Promise<IBillingTariff>}
     */
    public getTariff(tariffId: number, promoCodeString: string): Promise<IBillingTariff> {
        return this.SocketService.send(new GetTariffRequest(tariffId, promoCodeString));
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
    public enableTariff(
        tariffId: number,
        userIdReceiver: number,
        term: number,
        autoRenewal: boolean,
        trial: boolean,
        promoCode: string,
        paymentSystem: string,
    ): Promise<any> {
        return this.SocketService.send(new PostTariffSubscriptionRequest(
            tariffId, userIdReceiver, term, autoRenewal, trial, promoCode, paymentSystem,
        ));
    }

    /**
     * @param tariffId
     * @param autoRenewal
     * @param promoCode
     * @returns {Promise<any>}
     */
    public updateTariff(
        tariffId: number,
        autoRenewal: boolean,
        promoCode: string,
    ): Promise<any> {
        return this.SocketService.send(new PutTariffSubscriptionRequest(tariffId, autoRenewal, promoCode));
    }

    /**
     * @param tariffId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    public disableTariff(tariffId: number, userIdReceiver: number): Promise<any> {
        return this.SocketService.send(new DeleteTariffSubscriptionRequest(tariffId, userIdReceiver));
    }

    /**
     * @returns {Promise<[IBill]]>}
     */
    public getBillsList(): Promise<[IBill]> {
        return this.SocketService.send(new GetBillRequest(new Date(0), new Date()))
            .then((data) => data.arrayResult);
    }

    /**
     * @param billId
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    public getBillDetails(billId: number): Promise<any> {
        return this.SocketService.send(new GetBillDetailsRequest(billId, true));
    }

    /**
     * @param billId
     * @param paymentSystem
     * @returns {Promise<any>}
     */
    public updatePaymentSystem(billId: number, paymentSystem: string): Promise<any> {
        return this.SocketService.send(new PutProcessingCenterRequest(billId, paymentSystem));
    }

    /**
     * @param checkoutUrl
     * @returns {Promise<any>}
     */
    public checkout(checkoutUrl: string): Promise<any> {
        const [width, height] = [500, 500];
        const left = (screen.width - width) / 2;
        const top = (screen.height - height) / 2;
        window.open(checkoutUrl, "_blank", `width=${width},height=${height},left=${left},top=${top}`);
        return Promise.resolve();
    }

    /**
     * @param tariff
     * @returns IClubProfile?
     */
    public tariffEnablerClub(tariff): any {
        return tariff.clubProfile;
    }

    /**
     * @param tariff
     * @returns IUserProfile?
     */
    public tariffEnablerCoach(tariff): any {
        return (
            maybe(tariff.userProfilePayer) (prop("userId")) () !==
            maybe(this.SessionService.getUser()) (prop("userId")) ()
        ) && tariff.userProfilePayer;
    }

    /**
     * @param tariff
     * @returns 'enabled' | enabledByCoach' | 'enabledByClub' | 'notEnabled' | trial' | 'isPaid' | 'isBlocked' | undefined
     */
    public tariffStatus(tariff): string {
        const tariffEnablerClub = this.tariffEnablerClub(tariff);
        const tariffEnablerCoach = this.tariffEnablerCoach(tariff);

        return (
            tariff.isTrial && tariff.expireDate && "trial" ||
            tariffEnablerClub && "enabledByClub" ||
            tariffEnablerCoach && "enabledByCoach" ||
            tariff.isBlocked && "isBlocked" ||
            tariff.unpaidBill && "isBlocked" ||
            tariff.isOn && "enabled" ||
            !tariff.isOn && "notEnabled"
        );
    }

    /**
     * @param bill
     * @returns 'complete' | ready' | 'new'
     */
    public billStatus(bill: IBill): string {
        const now = moment();
        const startPeriod = parseYYYYMMDD(bill.startPeriod);
        const endPeriod = parseYYYYMMDD(bill.endPeriod);
        const billDate = parseYYYYMMDD(bill.billDate);

        return bill.receiptDate && "complete" ||
            now > billDate && "ready" ||
            startPeriod < now && now < endPeriod && billDate > endPeriod && "new";
    }

}
