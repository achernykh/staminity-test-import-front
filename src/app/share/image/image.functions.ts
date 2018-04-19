import * as _connection from '../../core/env.js';
import { InitiatorType } from "../../../../api/notification/notification.interface";

export const fullImageUrl = () => (sub: string, url:string = 'default.jpg') : string => {
    return url.indexOf('http') !== -1 ? url : _connection.content + '/content' + sub + url;
};

export const avatarUrl = () => (avatar: string, type: InitiatorType = InitiatorType.user):string => {
    let url: string = '/assets/picture/default_avatar.png';
    switch (type) {
        case InitiatorType.user: {
            url = `url(${avatar && avatar !== 'default.jpg' ? fullImageUrl() ('/user/avatar/', avatar) : '/assets/picture/default_avatar.png'})`;
            break;
        }
        case InitiatorType.group: case InitiatorType.club: {
        url = `url(${avatar ? fullImageUrl() ('/group/avatar/',avatar) : fullImageUrl() (null,'/assets/picture/default_avatar.png')})`;
        break;
    }
        case InitiatorType.provider: {
            url = `url(/assets/icon/${avatar.toLowerCase()}_on.png)`;
            break;
        }
        case InitiatorType.staminity: {
            url = `url(/assets/icon/apple-touch-icon-57x57.png)`;
            break;
        }
    }
    return url;
};