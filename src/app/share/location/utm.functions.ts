export const saveUtmParams = (search: Object): void => {
    let utm: Object = {};
    let keys: Array<string> = Object.keys(search).filter(k => k.indexOf('utm') !== -1) || [];
    keys.map(k => utm[k] = search[k]);
    window.sessionStorage.setItem('utm', JSON.stringify(utm));
};