interface WindowFbq extends Window {fbq: any;}

export function fbqLog (event: string, params: Object): void {
    if (window.hasOwnProperty('fbq')) {
        (window as WindowFbq).fbq('track', event, params);
    }
}