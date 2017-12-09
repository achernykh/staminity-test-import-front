/**
 * Переводим цвет из формата # в формат rgba
 * @param hex
 * @params opactity
 * @returns {string} формат 'rgba(number, number, number)'
 */
export const hexToRgbA = (hex: string, opactity: number = 1): string => {
    let c;
    if ( /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex) ) {
        c = hex.substring(1).split('');
        if ( c.length === 3 ) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opactity + ')';
    }
    throw new Error('Bad Hex');
};