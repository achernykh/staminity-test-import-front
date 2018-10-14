import {IBill, IBillDetails, IBillingTariff} from "@api/billing";
interface WindowGoogle extends Window { dataLayer: any; }

export const gtmEvent = (event: string, appEventCategory: string, appEventLabel: string, appEventAction: string, appEventValue?: number ) =>
    (window as WindowGoogle).dataLayer.push({ appEventCategory, appEventAction, appEventLabel, appEventValue}, { event });

export const gaEmailSignup = () => {
    (window as WindowGoogle).dataLayer('send', 'event', {
        eventCategory: 'signup',
        eventAction: 'click',
        eventLabel: 'emailsignup'
    });
};

export const gaSocialSignup = () =>
    (window as WindowGoogle).dataLayer('send', 'event', {
        eventCategory: 'signup',
        eventAction: 'click',
        eventLabel: 'socialsignup'
    });

export const gtmViewTariff = (tariff: IBillingTariff, fee: { currency: string, rate: number }) => {
    /**dataLayer.push({
        'ecommerce': {
            'currencyCode': fee.currency,
            'click': {
                'actionField': {'list': 'Tariffs'},
                'products': [{
                    'name': tariff.tariffCode,         // Name or ID is required.
                    'id': tariff.tariffId,
                    'price': fee.rate,
                    'brand': 'Staminity',
                    'category': 'tariffs',
                    //'variant': ''
                }]
            }
        },
        'event': 'appCommerceEvent',
        'appEventCategory': 'Ecommerce',
        'appEventAction': 'View Tariff',
    });**/
    gtmEvent('appEvent', 'tariffs', tariff.tariffCode, 'viewTariff');
};

export const gtmOpenInvoice = (bill: IBill | IBillDetails) => {
    gtmEvent('appEvent', 'billing', 'tariffsAndInvoices', 'openInvoice');
    /**dataLayer.push({
        'ecommerce': {
            'currencyCode': bill.currency,
            'click': {
                'actionField': {'list': 'Tariffs'},
                'products': [{
                    'name': bill.tariffCode,         // Name or ID is required.
                    'id': tariff.tariffId,
                    'price': fee.rate,
                    'brand': 'Staminity',
                    'category': 'tariffs',
                    //'variant': ''
                }]
            }
        },
        'event': 'appCommerceEvent',
        'appEventCategory': 'Ecommerce',
        'appEventAction': 'View Tariff',
    });**/
};

export const gtmPayment = (bill: IBill | IBillDetails) => {
    gtmEvent('appEvent', 'billing', `tariffsAndInvoices${bill.currency}`, 'payment',bill.totalAmount);
};


export const gtmRequest = (flow: 'join' | 'cancel' | 'leave' | 'commit' | 'reject', groupType: 'coach' | 'club') => {
    gtmEvent('appEvent', 'requests', groupType, flow);
};

export const gtmFindCoach = (coach: string) => {
    gtmEvent('appEvent', 'requests', coach, 'view');
};

export const gtmFindPlan = (plan: string) => {
    gtmEvent('appEvent', 'planStore', plan, 'view');
};
