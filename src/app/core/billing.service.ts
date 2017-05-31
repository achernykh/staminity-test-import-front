import { ISocketService } from './socket.service';
import { GetTariff, PostTariffSubscription, PutTariffSubscription, DeleteTariffSubscription } from "../../../api/billing/billing.request";
import { IBillingTariff, IBill } from "../../../api/billing/billing.interface";


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
     * @param userIdReceiver
     * @returns {Promise<any>}
     */
    disableTariff(tariffId: number, userIdReceiver: number) : Promise<any> {
        return this.SocketService.send(new DeleteTariffSubscription(tariffId, userIdReceiver));
    }

}