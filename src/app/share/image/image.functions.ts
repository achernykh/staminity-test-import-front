import * as _connection from '../../core/env.js';

export const fullImageUrl = () => (sub: string, url:string = 'default.jpg') : string => {
    return url.indexOf('http') !== -1 ? url : _connection.content + '/content' + sub + url;
};