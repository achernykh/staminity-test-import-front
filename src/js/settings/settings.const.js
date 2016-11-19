export const _NAVBAR = [{
    icon: "person.svg",
    name: 'app.settings.personalInfo.header',
    link: '#personal',
    active: true
}, {
    icon: "security.svg",
    name: 'app.settings.privacy.header',
    link: '#privacy',
    active: true
}, {
    icon: "dvr.svg",
    name: 'app.settings.display.header',
    link: '#display',
    active: true
}, {
    icon: "vpn_key.svg",
    name: 'app.settings.account.header',
    link: '#account',
    active: true
}, {
    icon: "sync.svg",
    name: 'app.settings.sync.header',
    link: '#sync',
    active: true
}, {
    icon: "straighten.svg",
    name: 'app.settings.zones.header',
    link: '#zones',
    active: true,
    sub: [{
        icon: "help.svg",
        name: 'app.settings.zones.bpm.header',
        link: '#zonesBPM'
    }, {
        icon: "help.svg",
        name: 'app.settings.zones.power.header',
        link: '#zonesPower'
    }, {
        icon: "help.svg",
        name: 'app.settings.zones.speed.header',
        link: '#zonesSpeed'
    }]
}, {
    icon: "notifications.svg",
    name: 'app.settings.notification.header',
    link: '#notifications',
    active: true
}, {
    icon: "content_paste.svg",
    name: 'app.settings.templates.header',
    link: '#templates',
    active: false
}, {
    icon: "star.svg",
    name: 'app.settings.favorites.header',
    link: '#favorites',
    active: false
}]

export const _DELIVERY_METHOD = [{
    id: 'W',
    name: 'web'
}, {
    id: 'P',
    name: 'phone'
}, {
    id: 'E',
    name: 'email'
}]

export const _PRIVACY_LEVEL = [{
    name: 'Только я и тренер',
    id: 50
}, {
    name: 'Друзья',
    id: 40
}, {
    name: 'Друзья и группы',
    id: 30
}, {
    name: 'Друзья, группы и подписчики',
    id: 20
}, {
    name: 'Все',
    id: 10
}]

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
}
