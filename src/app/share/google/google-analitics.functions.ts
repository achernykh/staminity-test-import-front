import {IBillingTariff} from "@api/billing";

declare var dataLayer: any[];

interface WindowGoogle extends Window {
    dataLayer: any;
}

export const gtmEvent = (params: any) => (window as WindowGoogle).dataLayer.push(params);

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
    dataLayer.push({
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
        'appEventAction': 'Product Clicks',
    });

};