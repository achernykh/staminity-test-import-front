export const gaEmailSignup = () => {
    window['ga']('send', 'event', { eventCategory: 'signup', eventAction: 'click', eventLabel: 'emailsignup'});
};

export const gaSocialSignup = () =>
    window['ga']('send', 'event', { eventCategory: 'signup', eventAction: 'click', eventLabel: 'socialsignup'});