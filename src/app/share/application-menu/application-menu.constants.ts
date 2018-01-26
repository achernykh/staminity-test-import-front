//import { _UserRoles } from '../config/app.constants.js';

export const UserMenuSettings = [
    {
        icon: "account_circle",
        name: "userMenu.profile",
        link: "user"
    },
    {
        icon: "settings",
        name: "userMenu.settings",
        link: "settings/user"
    },
    {
        icon: "help",
        name: "userMenu.help",
        link: "https://help.staminity.com/ru/"
    },
    {
        icon: "error",
        name: "userMenu.issue",
        link: "http://support.staminity.com/"
    },
    {
        icon: "home",
        name: "userMenu.home",
        link: "welcome"
    },
    {
        icon: "exit_to_app",
        name: "userMenu.exit",
        link: "signout"
    }
];

export const AppMenuSettings = [
    {
        icon: "today",
        name: "appMenu.calendar",
        link: "calendar",
        hideMobile: false
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: 'search',
        name: 'appMenu.search',
        link: 'search',
        hideMobile: false
    },
    /**{
        icon: 'import_contacts',
        name: 'appMenu.reference',
        link: 'reference'

    },**/
    {
        icon: "forum",
        name: "appMenu.feeds",
        link: "feeds",
        state: 'soon',
        hideMobile: true
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "insert_chart",
        name: "appMenu.reports",
        link: "analytics",
        hideMobile: true
        //state: 'soon'
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart",
        name: "appMenu.plan",
        link: "training-plans-search",
        state: 'soon',
        hideMobile: true
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "methodology",
        name: "appMenu.methodology",
        link: "methodology",
        hideMobile: true,
        //role: ['ActivitiesPlan_User', 'ActivitiesPlan_Athletes']
    },
    {
        icon: "season",
        name: "appMenu.season",
        link: "training-season-builder",
        hideMobile: true,
        role: ['ActivitiesPlan_User', 'ActivitiesPlan_Athletes']
        //state: 'soon'
        //role: [_UserRoles.user]
    },
    {
        icon: "group",
        name: "appMenu.groups",
        link: "groups",
        hideMobile: true,
        state: 'soon'
        //role: [_UserRoles.user, _UserRoles.coach]
    }
];

