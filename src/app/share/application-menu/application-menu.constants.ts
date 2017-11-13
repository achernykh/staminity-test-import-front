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
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: 'search',
        name: 'appMenu.search',
        link: 'search'
    },
    {
        icon: 'import_contacts',
        name: 'appMenu.reference',
        link: 'reference'

    },
    {
        icon: "forum",
        name: "appMenu.feeds",
        link: "feeds",
        state: 'soon'
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "insert_chart",
        name: "appMenu.reports",
        link: "analytics"
        //state: 'soon'
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart",
        name: "appMenu.plan",
        link: "training-plans-search"
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "methodology",
        name: "appMenu.methodology",
        link: "methodology"
        //role: [_UserRoles.user, _UserRoles.coach]
    },
    {
        icon: "show_chart",
        name: "appMenu.season",
        link: "season",
        state: 'soon'
        //role: [_UserRoles.user]
    },
    {
        icon: "group",
        name: "appMenu.groups",
        link: "groups",
        state: 'soon'
        //role: [_UserRoles.user, _UserRoles.coach]
    }
];

