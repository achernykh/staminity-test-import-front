export const keyboardShortcut = () => (str: string): string => {
    if (!str) { return; }
    let keys = str.split('-');
    let isOSX = /Mac OS X/.test(window.navigator.userAgent);
    let sep = (!isOSX || keys.length > 2) ? '+' : '';
    let abbreviations = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
    };
    return keys.map((key, index) => index === keys.length - 1 ? key : abbreviations[key]).join(sep);
};