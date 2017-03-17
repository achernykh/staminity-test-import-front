
import {ExternalProviderState} from "../../../api/sync/sync.interface";
export const _NAVBAR = [
    {
        icon: "person",
        name: 'settings.personalInfo.header',
        link: '#personal',
        active: true
    },
    {
        icon: "security",
        name: 'settings.privacy.header',
        link: '#privacy',
        active: true
    },
    {
        icon: "dvr",
        name: 'settings.display.header',
        link: '#display',
        active: true
    },
    {
        icon: "vpn_key",
        name: 'settings.account.header',
        link: '#account',
        active: false
    },
    {
        icon: "sync",
        name: 'settings.sync.header',
        link: '#sync',
        active: true
    },
    {
        icon: "straighten",
        name: 'settings.zones.header',
        link: '#zones',
        active: true,
        sub: [
            {
                icon: "help",
                name: 'settings.zones.bpm.header',
                link: '#zonesBPM'
            },
            {
                icon: "help",
                name: 'settings.zones.power.header',
                link: '#zonesPower'
            },
            {
                icon: "help",
                name: 'settings.zones.speed.header',
                link: '#zonesSpeed'
            }
        ]
    },
    {
        icon: "notifications",
        name: 'settings.notification.header',
        link: '#notifications',
        active: true
    }
    // UX для этих панелей не определен
    /*,
     {
     icon: "content_paste.svg",
     name: 'settings.templates.header',
     link: '#templates',
     active: false
     },
     {
     icon: "star.svg",
     name: 'settings.favorites.header',
     link: '#favorites',
     active: false
     }*/
];

export const _LANGUAGE = {'ru': {text: 'Русский'}/*,'en': {text: 'English'}*/};
export const _UNITS = ['metric'/*,'imperial'*/];

export const _DELIVERY_METHOD = [{
    id: 'W',
    name: 'web'
}, {
    id: 'P',
    name: 'phone'
}, {
    id: 'E',
    name: 'email'
}];

export const _PRIVACY_LEVEL = [{id: 50}, {id: 40}, {id: 10}];

export const _ZONE_CALCULATION_METHOD = {
    heartRate: [{
        type: 'lactateThreshold',
        method: [
            'Joe Frill(7)'
        ]
    }, {
        type: 'restingAndMax',
        method: [
            'Karvonen(5)',
            'Fitzenger-Scott(6)'
        ]
    }, {
        type: 'max',
        method: [
            'Yansen(6)'
        ]
    }],
    power: [{
        type: 'powerThreshold',
        method: [
            'Andy Coggan(6)'
        ]
    }]
};

export const _country_list = {
    ru: {"AU":"\u0410\u0432\u0441\u0442\u0440\u0430\u043b\u0438\u044f","AT":"\u0410\u0432\u0441\u0442\u0440\u0438\u044f","AZ":"\u0410\u0437\u0435\u0440\u0431\u0430\u0439\u0434\u0436\u0430\u043d","AX":"\u0410\u043b\u0430\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","AL":"\u0410\u043b\u0431\u0430\u043d\u0438\u044f","DZ":"\u0410\u043b\u0436\u0438\u0440","AS":"\u0410\u043c\u0435\u0440\u0438\u043a\u0430\u043d\u0441\u043a\u043e\u0435 \u0421\u0430\u043c\u043e\u0430","AI":"\u0410\u043d\u0433\u0438\u043b\u044c\u044f","AO":"\u0410\u043d\u0433\u043e\u043b\u0430","AD":"\u0410\u043d\u0434\u043e\u0440\u0440\u0430","AQ":"\u0410\u043d\u0442\u0430\u0440\u043a\u0442\u0438\u0434\u0430","AG":"\u0410\u043d\u0442\u0438\u0433\u0443\u0430 \u0438 \u0411\u0430\u0440\u0431\u0443\u0434\u0430","AR":"\u0410\u0440\u0433\u0435\u043d\u0442\u0438\u043d\u0430","AM":"\u0410\u0440\u043c\u0435\u043d\u0438\u044f","AW":"\u0410\u0440\u0443\u0431\u0430","AF":"\u0410\u0444\u0433\u0430\u043d\u0438\u0441\u0442\u0430\u043d","BS":"\u0411\u0430\u0433\u0430\u043c\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","BD":"\u0411\u0430\u043d\u0433\u043b\u0430\u0434\u0435\u0448","BB":"\u0411\u0430\u0440\u0431\u0430\u0434\u043e\u0441","BH":"\u0411\u0430\u0445\u0440\u0435\u0439\u043d","BY":"\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u044c","BZ":"\u0411\u0435\u043b\u0438\u0437","BE":"\u0411\u0435\u043b\u044c\u0433\u0438\u044f","BJ":"\u0411\u0435\u043d\u0438\u043d","BM":"\u0411\u0435\u0440\u043c\u0443\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","BG":"\u0411\u043e\u043b\u0433\u0430\u0440\u0438\u044f","BO":"\u0411\u043e\u043b\u0438\u0432\u0438\u044f","BQ":"\u0411\u043e\u043d\u044d\u0439\u0440, \u0421\u0438\u043d\u0442-\u042d\u0441\u0442\u0430\u0442\u0438\u0443\u0441 \u0438 \u0421\u0430\u0431\u0430","BA":"\u0411\u043e\u0441\u043d\u0438\u044f \u0438 \u0413\u0435\u0440\u0446\u0435\u0433\u043e\u0432\u0438\u043d\u0430","BW":"\u0411\u043e\u0442\u0441\u0432\u0430\u043d\u0430","BR":"\u0411\u0440\u0430\u0437\u0438\u043b\u0438\u044f","IO":"\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u044f \u0432 \u0418\u043d\u0434\u0438\u0439\u0441\u043a\u043e\u043c \u043e\u043a\u0435\u0430\u043d\u0435","BN":"\u0411\u0440\u0443\u043d\u0435\u0439-\u0414\u0430\u0440\u0443\u0441\u0441\u0430\u043b\u0430\u043c","BF":"\u0411\u0443\u0440\u043a\u0438\u043d\u0430-\u0424\u0430\u0441\u043e","BI":"\u0411\u0443\u0440\u0443\u043d\u0434\u0438","BT":"\u0411\u0443\u0442\u0430\u043d","VU":"\u0412\u0430\u043d\u0443\u0430\u0442\u0443","VA":"\u0412\u0430\u0442\u0438\u043a\u0430\u043d","GB":"\u0412\u0435\u043b\u0438\u043a\u043e\u0431\u0440\u0438\u0442\u0430\u043d\u0438\u044f","HU":"\u0412\u0435\u043d\u0433\u0440\u0438\u044f","VE":"\u0412\u0435\u043d\u0435\u0441\u0443\u044d\u043b\u0430","VG":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0411\u0440\u0438\u0442\u0430\u043d\u0441\u043a\u0438\u0435)","VI":"\u0412\u0438\u0440\u0433\u0438\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","UM":"\u0412\u043d\u0435\u0448\u043d\u0438\u0435 \u043c\u0430\u043b\u044b\u0435 \u043e-\u0432\u0430 (\u0421\u0428\u0410)","TL":"\u0412\u043e\u0441\u0442\u043e\u0447\u043d\u044b\u0439 \u0422\u0438\u043c\u043e\u0440","VN":"\u0412\u044c\u0435\u0442\u043d\u0430\u043c","GA":"\u0413\u0430\u0431\u043e\u043d","HT":"\u0413\u0430\u0438\u0442\u0438","GY":"\u0413\u0430\u0439\u0430\u043d\u0430","GM":"\u0413\u0430\u043c\u0431\u0438\u044f","GH":"\u0413\u0430\u043d\u0430","GP":"\u0413\u0432\u0430\u0434\u0435\u043b\u0443\u043f\u0430","GT":"\u0413\u0432\u0430\u0442\u0435\u043c\u0430\u043b\u0430","GN":"\u0413\u0432\u0438\u043d\u0435\u044f","GW":"\u0413\u0432\u0438\u043d\u0435\u044f-\u0411\u0438\u0441\u0430\u0443","DE":"\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f","GG":"\u0413\u0435\u0440\u043d\u0441\u0438","GI":"\u0413\u0438\u0431\u0440\u0430\u043b\u0442\u0430\u0440","HN":"\u0413\u043e\u043d\u0434\u0443\u0440\u0430\u0441","HK":"\u0413\u043e\u043d\u043a\u043e\u043d\u0433 (\u043e\u0441\u043e\u0431\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","GD":"\u0413\u0440\u0435\u043d\u0430\u0434\u0430","GL":"\u0413\u0440\u0435\u043d\u043b\u0430\u043d\u0434\u0438\u044f","GR":"\u0413\u0440\u0435\u0446\u0438\u044f","GE":"\u0413\u0440\u0443\u0437\u0438\u044f","GU":"\u0413\u0443\u0430\u043c","DK":"\u0414\u0430\u043d\u0438\u044f","JE":"\u0414\u0436\u0435\u0440\u0441\u0438","DJ":"\u0414\u0436\u0438\u0431\u0443\u0442\u0438","DG":"\u0414\u0438\u0435\u0433\u043e-\u0413\u0430\u0440\u0441\u0438\u044f","DM":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430","DO":"\u0414\u043e\u043c\u0438\u043d\u0438\u043a\u0430\u043d\u0441\u043a\u0430\u044f \u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430","EG":"\u0415\u0433\u0438\u043f\u0435\u0442","ZM":"\u0417\u0430\u043c\u0431\u0438\u044f","EH":"\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u0421\u0430\u0445\u0430\u0440\u0430","ZW":"\u0417\u0438\u043c\u0431\u0430\u0431\u0432\u0435","IL":"\u0418\u0437\u0440\u0430\u0438\u043b\u044c","IN":"\u0418\u043d\u0434\u0438\u044f","ID":"\u0418\u043d\u0434\u043e\u043d\u0435\u0437\u0438\u044f","JO":"\u0418\u043e\u0440\u0434\u0430\u043d\u0438\u044f","IQ":"\u0418\u0440\u0430\u043a","IR":"\u0418\u0440\u0430\u043d","IE":"\u0418\u0440\u043b\u0430\u043d\u0434\u0438\u044f","IS":"\u0418\u0441\u043b\u0430\u043d\u0434\u0438\u044f","ES":"\u0418\u0441\u043f\u0430\u043d\u0438\u044f","IT":"\u0418\u0442\u0430\u043b\u0438\u044f","YE":"\u0419\u0435\u043c\u0435\u043d","CV":"\u041a\u0430\u0431\u043e-\u0412\u0435\u0440\u0434\u0435","KZ":"\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d","KY":"\u041a\u0430\u0439\u043c\u0430\u043d\u043e\u0432\u044b \u043e-\u0432\u0430","KH":"\u041a\u0430\u043c\u0431\u043e\u0434\u0436\u0430","CM":"\u041a\u0430\u043c\u0435\u0440\u0443\u043d","CA":"\u041a\u0430\u043d\u0430\u0434\u0430","IC":"\u041a\u0430\u043d\u0430\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","QA":"\u041a\u0430\u0442\u0430\u0440","KE":"\u041a\u0435\u043d\u0438\u044f","CY":"\u041a\u0438\u043f\u0440","KG":"\u041a\u0438\u0440\u0433\u0438\u0437\u0438\u044f","KI":"\u041a\u0438\u0440\u0438\u0431\u0430\u0442\u0438","CN":"\u041a\u0438\u0442\u0430\u0439","KP":"\u041a\u041d\u0414\u0420","CC":"\u041a\u043e\u043a\u043e\u0441\u043e\u0432\u044b\u0435 \u043e-\u0432\u0430","CO":"\u041a\u043e\u043b\u0443\u043c\u0431\u0438\u044f","KM":"\u041a\u043e\u043c\u043e\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","CG":"\u041a\u043e\u043d\u0433\u043e - \u0411\u0440\u0430\u0437\u0437\u0430\u0432\u0438\u043b\u044c","CD":"\u041a\u043e\u043d\u0433\u043e - \u041a\u0438\u043d\u0448\u0430\u0441\u0430","XK":"\u041a\u043e\u0441\u043e\u0432\u043e","CR":"\u041a\u043e\u0441\u0442\u0430-\u0420\u0438\u043a\u0430","CI":"\u041a\u043e\u0442-\u0434\u2019\u0418\u0432\u0443\u0430\u0440","CU":"\u041a\u0443\u0431\u0430","KW":"\u041a\u0443\u0432\u0435\u0439\u0442","CW":"\u041a\u044e\u0440\u0430\u0441\u0430\u043e","LA":"\u041b\u0430\u043e\u0441","LV":"\u041b\u0430\u0442\u0432\u0438\u044f","LS":"\u041b\u0435\u0441\u043e\u0442\u043e","LR":"\u041b\u0438\u0431\u0435\u0440\u0438\u044f","LB":"\u041b\u0438\u0432\u0430\u043d","LY":"\u041b\u0438\u0432\u0438\u044f","LT":"\u041b\u0438\u0442\u0432\u0430","LI":"\u041b\u0438\u0445\u0442\u0435\u043d\u0448\u0442\u0435\u0439\u043d","LU":"\u041b\u044e\u043a\u0441\u0435\u043c\u0431\u0443\u0440\u0433","MU":"\u041c\u0430\u0432\u0440\u0438\u043a\u0438\u0439","MR":"\u041c\u0430\u0432\u0440\u0438\u0442\u0430\u043d\u0438\u044f","MG":"\u041c\u0430\u0434\u0430\u0433\u0430\u0441\u043a\u0430\u0440","YT":"\u041c\u0430\u0439\u043e\u0442\u0442\u0430","MO":"\u041c\u0430\u043a\u0430\u043e (\u043e\u0441\u043e\u0431\u044b\u0439 \u0440\u0430\u0439\u043e\u043d)","MK":"\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0438\u044f","MW":"\u041c\u0430\u043b\u0430\u0432\u0438","MY":"\u041c\u0430\u043b\u0430\u0439\u0437\u0438\u044f","ML":"\u041c\u0430\u043b\u0438","MV":"\u041c\u0430\u043b\u044c\u0434\u0438\u0432\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","MT":"\u041c\u0430\u043b\u044c\u0442\u0430","MA":"\u041c\u0430\u0440\u043e\u043a\u043a\u043e","MQ":"\u041c\u0430\u0440\u0442\u0438\u043d\u0438\u043a\u0430","MH":"\u041c\u0430\u0440\u0448\u0430\u043b\u043b\u043e\u0432\u044b \u043e-\u0432\u0430","MX":"\u041c\u0435\u043a\u0441\u0438\u043a\u0430","MZ":"\u041c\u043e\u0437\u0430\u043c\u0431\u0438\u043a","MD":"\u041c\u043e\u043b\u0434\u043e\u0432\u0430","MC":"\u041c\u043e\u043d\u0430\u043a\u043e","MN":"\u041c\u043e\u043d\u0433\u043e\u043b\u0438\u044f","MS":"\u041c\u043e\u043d\u0442\u0441\u0435\u0440\u0440\u0430\u0442","MM":"\u041c\u044c\u044f\u043d\u043c\u0430 (\u0411\u0438\u0440\u043c\u0430)","NA":"\u041d\u0430\u043c\u0438\u0431\u0438\u044f","NR":"\u041d\u0430\u0443\u0440\u0443","NP":"\u041d\u0435\u043f\u0430\u043b","NE":"\u041d\u0438\u0433\u0435\u0440","NG":"\u041d\u0438\u0433\u0435\u0440\u0438\u044f","NL":"\u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u044b","NI":"\u041d\u0438\u043a\u0430\u0440\u0430\u0433\u0443\u0430","NU":"\u041d\u0438\u0443\u044d","NZ":"\u041d\u043e\u0432\u0430\u044f \u0417\u0435\u043b\u0430\u043d\u0434\u0438\u044f","NC":"\u041d\u043e\u0432\u0430\u044f \u041a\u0430\u043b\u0435\u0434\u043e\u043d\u0438\u044f","NO":"\u041d\u043e\u0440\u0432\u0435\u0433\u0438\u044f","AC":"\u043e-\u0432 \u0412\u043e\u0437\u043d\u0435\u0441\u0435\u043d\u0438\u044f","IM":"\u041e-\u0432 \u041c\u044d\u043d","NF":"\u043e-\u0432 \u041d\u043e\u0440\u0444\u043e\u043b\u043a","CX":"\u043e-\u0432 \u0420\u043e\u0436\u0434\u0435\u0441\u0442\u0432\u0430","SH":"\u041e-\u0432 \u0421\u0432. \u0415\u043b\u0435\u043d\u044b","CK":"\u043e-\u0432\u0430 \u041a\u0443\u043a\u0430","TC":"\u041e-\u0432\u0430 \u0422\u0451\u0440\u043a\u0441 \u0438 \u041a\u0430\u0439\u043a\u043e\u0441","AE":"\u041e\u0410\u042d","OM":"\u041e\u043c\u0430\u043d","PK":"\u041f\u0430\u043a\u0438\u0441\u0442\u0430\u043d","PW":"\u041f\u0430\u043b\u0430\u0443","PS":"\u041f\u0430\u043b\u0435\u0441\u0442\u0438\u043d\u0441\u043a\u0438\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","PA":"\u041f\u0430\u043d\u0430\u043c\u0430","PG":"\u041f\u0430\u043f\u0443\u0430 \u2013 \u041d\u043e\u0432\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","PY":"\u041f\u0430\u0440\u0430\u0433\u0432\u0430\u0439","PE":"\u041f\u0435\u0440\u0443","PN":"\u041f\u0438\u0442\u043a\u044d\u0440\u043d","PL":"\u041f\u043e\u043b\u044c\u0448\u0430","PT":"\u041f\u043e\u0440\u0442\u0443\u0433\u0430\u043b\u0438\u044f","PR":"\u041f\u0443\u044d\u0440\u0442\u043e-\u0420\u0438\u043a\u043e","KR":"\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u043e\u0440\u0435\u044f","RE":"\u0420\u0435\u044e\u043d\u044c\u043e\u043d","RU":"\u0420\u043e\u0441\u0441\u0438\u044f","RW":"\u0420\u0443\u0430\u043d\u0434\u0430","RO":"\u0420\u0443\u043c\u044b\u043d\u0438\u044f","SV":"\u0421\u0430\u043b\u044c\u0432\u0430\u0434\u043e\u0440","WS":"\u0421\u0430\u043c\u043e\u0430","SM":"\u0421\u0430\u043d-\u041c\u0430\u0440\u0438\u043d\u043e","ST":"\u0421\u0430\u043d-\u0422\u043e\u043c\u0435 \u0438 \u041f\u0440\u0438\u043d\u0441\u0438\u043f\u0438","SA":"\u0421\u0430\u0443\u0434\u043e\u0432\u0441\u043a\u0430\u044f \u0410\u0440\u0430\u0432\u0438\u044f","SZ":"\u0421\u0432\u0430\u0437\u0438\u043b\u0435\u043d\u0434","MP":"\u0421\u0435\u0432\u0435\u0440\u043d\u044b\u0435 \u041c\u0430\u0440\u0438\u0430\u043d\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","SC":"\u0421\u0435\u0439\u0448\u0435\u043b\u044c\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","BL":"\u0421\u0435\u043d-\u0411\u0430\u0440\u0442\u0435\u043b\u044c\u043c\u0438","MF":"\u0421\u0435\u043d-\u041c\u0430\u0440\u0442\u0435\u043d","PM":"\u0421\u0435\u043d-\u041f\u044c\u0435\u0440 \u0438 \u041c\u0438\u043a\u0435\u043b\u043e\u043d","SN":"\u0421\u0435\u043d\u0435\u0433\u0430\u043b","VC":"\u0421\u0435\u043d\u0442-\u0412\u0438\u043d\u0441\u0435\u043d\u0442 \u0438 \u0413\u0440\u0435\u043d\u0430\u0434\u0438\u043d\u044b","KN":"\u0421\u0435\u043d\u0442-\u041a\u0438\u0442\u0441 \u0438 \u041d\u0435\u0432\u0438\u0441","LC":"\u0421\u0435\u043d\u0442-\u041b\u044e\u0441\u0438\u044f","RS":"\u0421\u0435\u0440\u0431\u0438\u044f","EA":"\u0421\u0435\u0443\u0442\u0430 \u0438 \u041c\u0435\u043b\u0438\u043b\u044c\u044f","SG":"\u0421\u0438\u043d\u0433\u0430\u043f\u0443\u0440","SX":"\u0421\u0438\u043d\u0442-\u041c\u0430\u0440\u0442\u0435\u043d","SY":"\u0421\u0438\u0440\u0438\u044f","SK":"\u0421\u043b\u043e\u0432\u0430\u043a\u0438\u044f","SI":"\u0421\u043b\u043e\u0432\u0435\u043d\u0438\u044f","US":"\u0421\u043e\u0435\u0434\u0438\u043d\u0435\u043d\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b","SB":"\u0421\u043e\u043b\u043e\u043c\u043e\u043d\u043e\u0432\u044b \u043e-\u0432\u0430","SO":"\u0421\u043e\u043c\u0430\u043b\u0438","SD":"\u0421\u0443\u0434\u0430\u043d","SR":"\u0421\u0443\u0440\u0438\u043d\u0430\u043c","SL":"\u0421\u044c\u0435\u0440\u0440\u0430-\u041b\u0435\u043e\u043d\u0435","TJ":"\u0422\u0430\u0434\u0436\u0438\u043a\u0438\u0441\u0442\u0430\u043d","TH":"\u0422\u0430\u0438\u043b\u0430\u043d\u0434","TW":"\u0422\u0430\u0439\u0432\u0430\u043d\u044c","TZ":"\u0422\u0430\u043d\u0437\u0430\u043d\u0438\u044f","TG":"\u0422\u043e\u0433\u043e","TK":"\u0422\u043e\u043a\u0435\u043b\u0430\u0443","TO":"\u0422\u043e\u043d\u0433\u0430","TT":"\u0422\u0440\u0438\u043d\u0438\u0434\u0430\u0434 \u0438 \u0422\u043e\u0431\u0430\u0433\u043e","TA":"\u0422\u0440\u0438\u0441\u0442\u0430\u043d-\u0434\u0430-\u041a\u0443\u043d\u044c\u044f","TV":"\u0422\u0443\u0432\u0430\u043b\u0443","TN":"\u0422\u0443\u043d\u0438\u0441","TM":"\u0422\u0443\u0440\u043a\u043c\u0435\u043d\u0438\u0441\u0442\u0430\u043d","TR":"\u0422\u0443\u0440\u0446\u0438\u044f","UG":"\u0423\u0433\u0430\u043d\u0434\u0430","UZ":"\u0423\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u0430\u043d","UA":"\u0423\u043a\u0440\u0430\u0438\u043d\u0430","WF":"\u0423\u043e\u043b\u043b\u0438\u0441 \u0438 \u0424\u0443\u0442\u0443\u043d\u0430","UY":"\u0423\u0440\u0443\u0433\u0432\u0430\u0439","FO":"\u0424\u0430\u0440\u0435\u0440\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FM":"\u0424\u0435\u0434\u0435\u0440\u0430\u0442\u0438\u0432\u043d\u044b\u0435 \u0428\u0442\u0430\u0442\u044b \u041c\u0438\u043a\u0440\u043e\u043d\u0435\u0437\u0438\u0438","FJ":"\u0424\u0438\u0434\u0436\u0438","PH":"\u0424\u0438\u043b\u0438\u043f\u043f\u0438\u043d\u044b","FI":"\u0424\u0438\u043d\u043b\u044f\u043d\u0434\u0438\u044f","FK":"\u0424\u043e\u043b\u043a\u043b\u0435\u043d\u0434\u0441\u043a\u0438\u0435 \u043e-\u0432\u0430","FR":"\u0424\u0440\u0430\u043d\u0446\u0438\u044f","GF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u0413\u0432\u0438\u0430\u043d\u0430","PF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0430\u044f \u041f\u043e\u043b\u0438\u043d\u0435\u0437\u0438\u044f","TF":"\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u0441\u043a\u0438\u0435 \u042e\u0436\u043d\u044b\u0435 \u0422\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438","HR":"\u0425\u043e\u0440\u0432\u0430\u0442\u0438\u044f","CF":"\u0426\u0410\u0420","TD":"\u0427\u0430\u0434","ME":"\u0427\u0435\u0440\u043d\u043e\u0433\u043e\u0440\u0438\u044f","CZ":"\u0427\u0435\u0445\u0438\u044f","CL":"\u0427\u0438\u043b\u0438","CH":"\u0428\u0432\u0435\u0439\u0446\u0430\u0440\u0438\u044f","SE":"\u0428\u0432\u0435\u0446\u0438\u044f","SJ":"\u0428\u043f\u0438\u0446\u0431\u0435\u0440\u0433\u0435\u043d \u0438 \u042f\u043d-\u041c\u0430\u0439\u0435\u043d","LK":"\u0428\u0440\u0438-\u041b\u0430\u043d\u043a\u0430","EC":"\u042d\u043a\u0432\u0430\u0434\u043e\u0440","GQ":"\u042d\u043a\u0432\u0430\u0442\u043e\u0440\u0438\u0430\u043b\u044c\u043d\u0430\u044f \u0413\u0432\u0438\u043d\u0435\u044f","ER":"\u042d\u0440\u0438\u0442\u0440\u0435\u044f","EE":"\u042d\u0441\u0442\u043e\u043d\u0438\u044f","ET":"\u042d\u0444\u0438\u043e\u043f\u0438\u044f","ZA":"\u042e\u0410\u0420","GS":"\u042e\u0436\u043d\u0430\u044f \u0413\u0435\u043e\u0440\u0433\u0438\u044f \u0438 \u042e\u0436\u043d\u044b\u0435 \u0421\u0430\u043d\u0434\u0432\u0438\u0447\u0435\u0432\u044b \u043e-\u0432\u0430","SS":"\u042e\u0436\u043d\u044b\u0439 \u0421\u0443\u0434\u0430\u043d","JM":"\u042f\u043c\u0430\u0439\u043a\u0430","JP":"\u042f\u043f\u043e\u043d\u0438\u044f"},
    en: {"AF":"Afghanistan","AX":"\u00c5land Islands","AL":"Albania","DZ":"Algeria","AS":"American Samoa","AD":"Andorra","AO":"Angola","AI":"Anguilla","AQ":"Antarctica","AG":"Antigua & Barbuda","AR":"Argentina","AM":"Armenia","AW":"Aruba","AC":"Ascension Island","AU":"Australia","AT":"Austria","AZ":"Azerbaijan","BS":"Bahamas","BH":"Bahrain","BD":"Bangladesh","BB":"Barbados","BY":"Belarus","BE":"Belgium","BZ":"Belize","BJ":"Benin","BM":"Bermuda","BT":"Bhutan","BO":"Bolivia","BA":"Bosnia & Herzegovina","BW":"Botswana","BR":"Brazil","IO":"British Indian Ocean Territory","VG":"British Virgin Islands","BN":"Brunei","BG":"Bulgaria","BF":"Burkina Faso","BI":"Burundi","KH":"Cambodia","CM":"Cameroon","CA":"Canada","IC":"Canary Islands","CV":"Cape Verde","BQ":"Caribbean Netherlands","KY":"Cayman Islands","CF":"Central African Republic","EA":"Ceuta & Melilla","TD":"Chad","CL":"Chile","CN":"China","CX":"Christmas Island","CC":"Cocos (Keeling) Islands","CO":"Colombia","KM":"Comoros","CG":"Congo - Brazzaville","CD":"Congo - Kinshasa","CK":"Cook Islands","CR":"Costa Rica","CI":"C\u00f4te d\u2019Ivoire","HR":"Croatia","CU":"Cuba","CW":"Cura\u00e7ao","CY":"Cyprus","CZ":"Czech Republic","DK":"Denmark","DG":"Diego Garcia","DJ":"Djibouti","DM":"Dominica","DO":"Dominican Republic","EC":"Ecuador","EG":"Egypt","SV":"El Salvador","GQ":"Equatorial Guinea","ER":"Eritrea","EE":"Estonia","ET":"Ethiopia","FK":"Falkland Islands","FO":"Faroe Islands","FJ":"Fiji","FI":"Finland","FR":"France","GF":"French Guiana","PF":"French Polynesia","TF":"French Southern Territories","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GL":"Greenland","GD":"Grenada","GP":"Guadeloupe","GU":"Guam","GT":"Guatemala","GG":"Guernsey","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HN":"Honduras","HK":"Hong Kong SAR China","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IM":"Isle of Man","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JE":"Jersey","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","XK":"Kosovo","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau SAR China","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall Islands","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","ME":"Montenegro","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk Island","KP":"North Korea","MP":"Northern Mariana Islands","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PS":"Palestinian Territories","PA":"Panama","PG":"Papua New Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn Islands","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"R\u00e9union","RO":"Romania","RU":"Russia","RW":"Rwanda","WS":"Samoa","SM":"San Marino","ST":"S\u00e3o Tom\u00e9 & Pr\u00edncipe","SA":"Saudi Arabia","SN":"Senegal","RS":"Serbia","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SX":"Sint Maarten","SK":"Slovakia","SI":"Slovenia","SB":"Solomon Islands","SO":"Somalia","ZA":"South Africa","GS":"South Georgia & South Sandwich Islands","KR":"South Korea","SS":"South Sudan","ES":"Spain","LK":"Sri Lanka","BL":"St. Barth\u00e9lemy","SH":"St. Helena","KN":"St. Kitts & Nevis","LC":"St. Lucia","MF":"St. Martin","PM":"St. Pierre & Miquelon","VC":"St. Vincent & Grenadines","SD":"Sudan","SR":"Suriname","SJ":"Svalbard & Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TL":"Timor-Leste","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad & Tobago","TA":"Tristan da Cunha","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks & Caicos Islands","TV":"Tuvalu","UM":"U.S. Outlying Islands","VI":"U.S. Virgin Islands","UG":"Uganda","UA":"Ukraine","AE":"United Arab Emirates","GB":"United Kingdom","US":"United States","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City","VE":"Venezuela","VN":"Vietnam","WF":"Wallis & Futuna","EH":"Western Sahara","YE":"Yemen","ZM":"Zambia","ZW":"Zimbabwe"}
};

export const _SYNC_ADAPTORS = [
    {
        provider: 'garmin',
        isAuth: false,
        state: ExternalProviderState.Disabled
    },
    {
        provider: 'strava',
        state: ExternalProviderState.Disabled,
        isAuth: true
    },
    {
        provider: 'polar',
        state: ExternalProviderState.Disabled,
        isAuth: false
    }
];

const _SYNC_ADAPTORS_STATUS = {
    offNeverEnabled: {
        code: 'offNeverEnabled',
        switch: false
    },
    offEnabledEarly: {},
    onSyncing: {},
    onSyncComplete: {},
    ofSyncError: {}
};

export const syncStatus = (last,state) => {

    let status = {
        offSyncNeverEnabled: {
            code: 'offSyncNeverEnabled',
            switch: false
        },
        offSyncEnabledEarly: {
            code: 'offSyncEnabledEarly',
            switch: false
        },
        onSyncing: {
            code: 'onSyncing',
            switch: true
        },
        onSyncComplete: {
            code: 'onSyncComplete',
            switch: true
        },
        offSyncError: {
            code: 'offSyncError',
            switch: false
        },
        offSyncUnauthorized: {
            code: 'offSyncUnauthorized',
            switch: false
        },
        onSyncCreate: {
            code: 'onSyncCreate',
            switch: true
        },
        onSyncPendingRequest: {
            code: 'onSyncCreate',
            switch: true
        }
    };

    // Статус 1: Интеграция выключена и ранее не выполнялась
    if (typeof last === "undefined" && (state === "Disabled" || typeof state === "undefined")) {
        return status.offSyncNeverEnabled;
    }

    // Статус 2: Интеграция выключена после того, как была ранее выполнена
    if (state === "Disabled") {
        return status.offSyncEnabledEarly;
    }

    // Статус 3: Интеграция включена, выполняется начальная синхронизация
    if (typeof last === "undefined" && state === "Enabled") {
        return status.onSyncing;
    }

    // Статус 4: Интеграция включена, синхронизация выполнена
    if (typeof last !== "undefined" && state === "Enabled") {
        return status.onSyncComplete;
    }

    // Статус 5: Интеграция выключена, ошибки авторизации
    if (state === "Unauthorized") {
        return status.offSyncUnauthorized;
    }

    //  Статус 6: Формирование запроса на соединение аккаунтов
    if (state === "Created") {
        return status.onSyncCreate;
    }

    //  Статус 7: Ожидается присоединение аккаунта пользователя к аккаунту сервсиа
    if (state === "PendingRequest") {
        return status.onSyncPendingRequest;
    }

};
