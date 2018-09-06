interface WindowGoogle extends Window {dataLayer: any;}

export const gtmEvent = (params: any) => (window as WindowGoogle).dataLayer.push(params);

export const gaEmailSignup = () => {
    (window as WindowGoogle).dataLayer('send', 'event', { eventCategory: 'signup', eventAction: 'click', eventLabel: 'emailsignup'});
};

export const gaSocialSignup = () =>
    (window as WindowGoogle).dataLayer('send', 'event', { eventCategory: 'signup', eventAction: 'click', eventLabel: 'socialsignup'});