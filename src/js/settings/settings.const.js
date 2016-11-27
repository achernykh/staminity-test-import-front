export const _NAVBAR = [
    {
        icon: "person.svg",
        name: 'settings.personalInfo.header',
        link: '#personal',
        active: true
    },
    {
        icon: "security.svg",
        name: 'settings.privacy.header',
        link: '#privacy',
        active: true
    },
    {
        icon: "dvr.svg",
        name: 'settings.display.header',
        link: '#display',
        active: false
    },
    {
        icon: "vpn_key.svg",
        name: 'settings.account.header',
        link: '#account',
        active: false
    },
    {
        icon: "sync.svg",
        name: 'settings.sync.header',
        link: '#sync',
        active: true
    },
    {
        icon: "straighten.svg",
        name: 'settings.zones.header',
        link: '#zones',
        active: true,
        sub: [
            {
                icon: "svg",
                name: 'settings.zones.bpm.header',
                link: '#zonesBPM'
            },
            {
                icon: "help.svg",
                name: 'settings.zones.power.header',
                link: '#zonesPower'
            },
            {
                icon: "help.svg",
                name: 'settings.zones.speed.header',
                link: '#zonesSpeed'
            }
        ]
    },
    {
        icon: "notifications.svg",
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
]

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

export const _PRIVACY_LEVEL = [{id: 50}, {id: 40}, {id: 10}]

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
